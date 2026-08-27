import { UploadApi } from '@/features/upload/api/upload.api';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export function useClubImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const pickAndUploadImage = useCallback(async (type: 'logo' | 'cover') => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Nous avons besoin d\'accéder à votre galerie pour ajouter une photo.'
          );
          return null;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'cover' ? [16, 9] : [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        return null;
      }

      const asset = result.assets[0];
      const fileUri = asset.uri;
      const mimeType = asset.mimeType || 'image/jpeg';

      setIsUploading(true);

      const publicUrl = await UploadApi.uploadToR2(fileUri, mimeType, `club-${type}`);
      return publicUrl;
    } catch (err) {
      console.error('Erreur upload photo de club:', err);
      Alert.alert(
        'Erreur',
        'Impossible d\'uploader la photo pour le moment. Veuillez réessayer.'
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    isUploading,
    pickAndUploadImage,
  };
}
