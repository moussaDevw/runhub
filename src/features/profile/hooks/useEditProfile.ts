import { useAuth } from '@/features/auth/context/AuthContext';
import { ProfileApi } from '@/features/profile/api/profile.api';
import { UploadApi } from '@/features/upload/api/upload.api';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

export function useEditProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState(
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Tidiane Diop'
  );
  const [username, setUsername] = useState(user?.username ? `@${user.username}` : '@tidiane');
  const [location, setLocation] = useState(user?.city || 'Médina, Dakar');
  const [bio, setBio] = useState(
    user?.bio || 'Coureur du dimanche 🏃. Toujours partant pour un 5k au coucher du soleil.'
  );
  const [email, setEmail] = useState(user?.email || 'coureur@runhub.app');
  const [isSaving, setIsSaving] = useState(false);

  const initials =
    ((user?.firstName?.[0] || name?.[0] || 'T') + (user?.lastName?.[0] || name.split(' ')[1]?.[0] || 'D')).toUpperCase();

  const handlePickAvatar = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission requise',
            'RunHub a besoin d\'accéder à vos photos pour changer votre photo de profil.'
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      setIsUploadingAvatar(true);
      const publicUrl = await UploadApi.uploadToR2(
        asset.uri,
        asset.mimeType || 'image/jpeg',
        'avatar'
      );
      setAvatarUrl(publicUrl);
    } catch (err: any) {
      console.error('Erreur upload avatar:', err);
      Alert.alert('Erreur', 'Impossible de charger votre photo de profil.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const cleanUsername = username.replace(/^@/, '').trim();

      const updated = await ProfileApi.updateProfile({
        firstName,
        lastName,
        username: cleanUsername,
        bio: bio.trim(),
        city: location.trim(),
        avatarUrl: avatarUrl || undefined,
      });
      updateUser(updated);
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de mettre à jour le profil.";
      Alert.alert('Erreur', message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    name,
    setName,
    username,
    setUsername,
    location,
    setLocation,
    bio,
    setBio,
    email,
    setEmail,
    avatarUrl,
    isUploadingAvatar,
    handlePickAvatar,
    isSaving,
    initials,
    handleSave,
    router,
  };
}
