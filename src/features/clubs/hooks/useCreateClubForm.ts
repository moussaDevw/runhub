import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateClub } from './useCreateClub';
import { useClubImageUpload } from './useClubImageUpload';

export function useCreateClubForm() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [baseName, setBaseName] = useState('');
  const [coords, setCoords] = useState<{lat: number; lng: number} | null>(null);

  const { pickAndUploadImage, isUploading } = useClubImageUpload();
  const { mutate: createClub, isPending } = useCreateClub();

  const handleSelectCover = async () => {
    const url = await pickAndUploadImage('cover');
    if (url) setCoverUrl(url);
  };

  const handleSelectLogo = async () => {
    const url = await pickAndUploadImage('logo');
    if (url) setLogoUrl(url);
  };

  const handleHandleChange = (val: string) => {
    setHandle(val.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
  };

  const handleLocationSelect = (
    venueName: string, 
    locationCoords: {lat: number; lng: number} | undefined,
    googlePlaceId?: string,
    city?: string,
    country?: string
  ) => {
    setBaseName(venueName);
    setCoords(locationCoords || null);
  };

  const handleSubmit = () => {
    if (!name || !handle) {
      Alert.alert('Erreur', 'Le nom et l\'identifiant sont obligatoires.');
      return;
    }

    createClub({
      name,
      handle,
      bio,
      coverUrl: coverUrl || undefined,
      logoUrl: logoUrl || undefined,
      baseName: baseName || undefined,
      coords: coords || undefined
    }, {
      onSuccess: (club) => {
        Alert.alert('Succès', 'Club créé avec succès !');
        router.replace(`/club/${club.id}`);
      },
      onError: (err: any) => {
        Alert.alert('Erreur', err.message || 'Impossible de créer le club.');
      }
    });
  };

  return {
    state: {
      name,
      handle,
      bio,
      coverUrl,
      logoUrl,
      isLocationModalVisible,
      baseName,
      coords,
    },
    actions: {
      setName,
      setHandle: handleHandleChange,
      setBio,
      setIsLocationModalVisible,
      handleLocationSelect,
      handleSelectCover,
      handleSelectLogo,
      handleSubmit,
    },
    status: {
      isUploading,
      isPending,
    }
  };
}
