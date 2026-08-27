import { useRouter } from 'expo-router';
import { useFavoriteEvents, useToggleFavorite } from '@/features/events/hooks/useFavorites';
import { formatTime, getDayLabel, formatPrice } from '@/core/utils/locale';
import { getEventImageSource } from '@/features/events/utils/event.utils';

export function useFavoritesScreen() {
  const router = useRouter();
  const { data: rawFavoriteEvents = [], isLoading } = useFavoriteEvents();
  const toggleMutation = useToggleFavorite();

  const favoriteEvents = (rawFavoriteEvents || []).map((event) => ({
    id: event.id,
    title: event.title,
    time: event.startsAt ? `${getDayLabel(event.startsAt)} à ${formatTime(event.startsAt)}` : '',
    location: event.venueName || 'Dakar',
    price: formatPrice(event.price || 0),
    imageSource: getEventImageSource(event.coverUrl),
  }));

  const handleUnlike = (id: string) => {
    toggleMutation.mutate({ eventId: id, isFavorited: true }); // It is favorited since it's in the favorites list
  };

  return {
    favoriteEvents,
    handleUnlike,
    isLoading,
    router,
  };
}
