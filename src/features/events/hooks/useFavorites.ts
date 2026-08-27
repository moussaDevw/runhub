import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoritesApi } from '../api/favorites.api';

/**
 * Fetches the list of event IDs the user has favorited.
 * Used to check favorite status across the app.
 */
export function useFavoriteIds() {
  return useQuery<string[]>({
    queryKey: ['favorite-ids'],
    queryFn: () => FavoritesApi.getFavoriteIds(),
  });
}

/**
 * Fetches the full list of favorited events (for the Favorites screen).
 */
export function useFavoriteEvents() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => FavoritesApi.getFavorites(),
  });
}

/**
 * Toggle favorite mutation with optimistic updates.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, isFavorited }: { eventId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        await FavoritesApi.removeFavorite(eventId);
      } else {
        await FavoritesApi.addFavorite(eventId);
      }
    },

    // Optimistic update on favorite-ids
    onMutate: async ({ eventId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: ['favorite-ids'] });

      const previousIds = queryClient.getQueryData<string[]>(['favorite-ids']);

      queryClient.setQueryData<string[]>(['favorite-ids'], (old = []) => {
        if (isFavorited) {
          return old.filter((id) => id !== eventId);
        }
        return [...old, eventId];
      });

      return { previousIds };
    },

    // Rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(['favorite-ids'], context.previousIds);
      }
    },

    // Refetch on settle to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
