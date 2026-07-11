import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { DUMMY_EVENTS } from '@/data/mock-data';

export function useFavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  
  const favoriteEvents = DUMMY_EVENTS.filter(event => favorites.includes(event.id));

  const handleUnlike = (id: string) => {
    toggleFavorite(id);
  };

  return {
    favorites,
    favoriteEvents,
    handleUnlike,
    router,
  };
}
