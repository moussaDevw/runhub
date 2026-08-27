/**
 * Hook personnalisé pour uploader une photo de couverture d'événement.
 *
 * Pattern : suit la même logique que les autres hooks du projet (ex: useSports, useProfile).
 * Le flux :
 *   1. L'utilisateur sélectionne une image via expo-image-picker
 *   2. On upload vers R2 via UploadApi.uploadToR2
 *   3. On stocke l'URL publique dans le store Zustand
 */
import { useEventCreationStore } from '@/features/creation/store/useEventCreationStore';
import { UploadApi } from '@/features/upload/api/upload.api';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export function useEventCoverUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const updateField = useEventCreationStore((state) => state.updateField);

    const pickAndUploadImage = useCallback(async () => {
        try {
            // 1. Demander la permission d'accéder à la galerie
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission refusée',
                        'Nous avons besoin d\'accéder à votre galerie pour ajouter une photo de couverture.'
                    );
                    return;
                }
            }

            // 2. Ouvrir la galerie
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (result.canceled || !result.assets?.[0]) {
                return; // L'utilisateur a annulé
            }

            const asset = result.assets[0];
            const fileUri = asset.uri;
            const mimeType = asset.mimeType || 'image/jpeg';

            setIsUploading(true);

            // 3. Upload vers R2
            const publicUrl = await UploadApi.uploadToR2(fileUri, mimeType, 'event-cover');

            // 4. Stocker dans le store
            updateField('coverUrl', publicUrl);

            return publicUrl;
        } catch (err) {
            console.error('Erreur upload photo de couverture:', err);
            Alert.alert(
                'Erreur',
                'Impossible d\'uploader la photo pour le moment. Veuillez réessayer.'
            );
        } finally {
            setIsUploading(false);
        }
    }, [updateField]);

    const removeCover = useCallback(() => {
        updateField('coverUrl', null);
    }, [updateField]);

    return {
        isUploading,
        pickAndUploadImage,
        removeCover,
    };
}
