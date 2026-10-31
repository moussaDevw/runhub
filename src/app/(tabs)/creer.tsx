import { useCreateModal } from '@/features/creation/store/useCreateModal';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

// Fallback if the route is directly accessed: opens the creation modal and replaces route with explorer
export default function CreerRoute() {
  const { open } = useCreateModal();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      open();
      router.replace('/(tabs)/explorer');
    }, [open, router])
  );

  return <View style={{ flex: 1, backgroundColor: '#faf9f5' }} />;
}
