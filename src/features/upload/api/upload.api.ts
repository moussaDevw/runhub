/**
 * Upload API — Gère les presigned URLs pour Cloudflare R2.
 *
 * Le flux :
 *   1. Frontend demande une presigned URL → POST /upload/presigned-url
 *   2. Backend retourne { original: { uploadUrl, publicUrl, key }, thumbnail?: {...} }
 *   3. Frontend upload le fichier directement vers uploadUrl (PUT)
 *   4. Frontend utilise publicUrl comme URL définitive
 */
import { apiClient } from '@/core/api/client';
import * as FileSystem from 'expo-file-system/legacy';

export type UploadType = 'avatar' | 'club-logo' | 'club-cover' | 'event-cover' | 'event-gallery';

export interface GetPresignedUrlPayload {
    type: UploadType;
    contentType: string;
}

export interface PresignedUrlResponse {
    original: {
        key: string;
        uploadUrl: string;
        publicUrl: string;
    };
    thumbnail?: {
        key: string;
        uploadUrl: string;
        publicUrl: string;
    };
}

export const UploadApi = {
    /**
     * Demande une presigned URL pour uploader un fichier vers Cloudflare R2.
     */
    async getPresignedUrl(payload: GetPresignedUrlPayload): Promise<PresignedUrlResponse> {
        return apiClient<PresignedUrlResponse>('/upload/presigned-url', {
            method: 'POST',
            body: payload,
        });
    },

    /**
     * Upload un fichier directement vers R2 via l'URL présignée.
     * Retourne la publicUrl à utiliser définitivement.
     */
    async uploadToR2(fileUri: string, contentType: string, uploadType: UploadType): Promise<string> {
        // 1. Demander une presigned URL au backend
        const presigned = await this.getPresignedUrl({
            type: uploadType,
            contentType,
        });

        // 2. Uploader directement avec expo-file-system pour éviter les erreurs de conversion de Blob
        const uploadResponse = await FileSystem.uploadAsync(presigned.original.uploadUrl, fileUri, {
            httpMethod: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
        });

        if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
            throw new Error(`R2 upload failed with status ${uploadResponse.status}`);
        }

        // 3. Retourner l'URL publique
        return presigned.original.publicUrl;
    },
};
