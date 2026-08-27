import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useEventCreationStore } from '@/features/creation/store/useEventCreationStore';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { EventsApi } from '../api/events.api';
import { getOrganizerDisplay } from '@/core/utils/user';

export function useEventPreview() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Zustand Store selectors
  const title = useEventCreationStore((state) => state.title);
  const description = useEventCreationStore((state) => state.description);
  const sportId = useEventCreationStore((state) => state.sportId);
  const startsAt = useEventCreationStore((state) => state.startsAt);
  const venueName = useEventCreationStore((state) => state.venueName);
  const capacity = useEventCreationStore((state) => state.capacity);
  const price = useEventCreationStore((state) => state.price);
  const coords = useEventCreationStore((state) => state.coords);
  const googlePlaceId = useEventCreationStore((state) => state.googlePlaceId);
  const city = useEventCreationStore((state) => state.city);
  const country = useEventCreationStore((state) => state.country);
  const coverUrl = useEventCreationStore((state) => state.coverUrl);
  const resetStore = useEventCreationStore((state) => state.resetStore);
  const editingEventId = useEventCreationStore((state) => state.editingEventId);

  // Load sports to match name and color
  const { data: sportsList = [] } = useAllSports();
  const selectedSport = sportsList.find((s) => s.id === sportId);

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let resultEvent;

      if (editingEventId) {
        // 1. Update the event
        resultEvent = await EventsApi.updateEvent(editingEventId, {
          title,
          description: description || undefined,
          sportId,
          startsAt,
          venueName,
          capacity,
          price,
          coords,
          googlePlaceId,
          city,
          country,
          coverUrl: coverUrl || undefined,
        });
      } else {
        // 1. Create the event
        const created = await EventsApi.createEvent({
          title,
          description: description || undefined,
          sportId,
          startsAt,
          venueName,
          capacity,
          price,
          coords,
          googlePlaceId,
          city,
          country,
          coverUrl: coverUrl || undefined,
        });

        // 2. Publish it immediately
        await EventsApi.publishEvent(created.id);
        resultEvent = created;
      }

      // 3. Invalidate React Query events list cache to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['events'] });
      if (editingEventId) {
        queryClient.invalidateQueries({ queryKey: ['event', editingEventId] });
      }

      // 5. Navigate to SuccessScreen
      router.push({
        pathname: '/success',
        params: {
          type: 'publish',
          title: title,
          capacity: capacity ? String(capacity) : '',
          slug: resultEvent.shareSlug,
        },
      } as any);

      // 4. Clean Zustand creation state
      resetStore();
    } catch (err) {
      console.error(editingEventId ? 'Erreur modification événement:' : 'Erreur publication événement:', err);
      const message = err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.";
      Alert.alert(
        editingEventId ? 'Erreur de modification' : 'Erreur de publication',
        message
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const { name: organizerName, initials: organizerInitials } = getOrganizerDisplay({
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
  });

  return {
    title,
    price,
    startsAt,
    venueName,
    capacity,
    coverUrl,
    selectedSport,
    organizerName,
    organizerInitials,
    isPublishing,
    handlePublish,
    goBack: () => router.back(),
  };
}
