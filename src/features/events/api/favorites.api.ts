import { apiClient } from '@/core/api/client';
import { EventItemResponse } from './events.api';

export const FavoritesApi = {
  /**
   * Récupère la liste complète des événements favoris de l'utilisateur.
   */
  async getFavorites(): Promise<EventItemResponse[]> {
    return apiClient<EventItemResponse[]>('/events/favorites');
  },

  /**
   * Récupère uniquement les IDs des événements favoris (pour vérification rapide).
   */
  async getFavoriteIds(): Promise<string[]> {
    return apiClient<string[]>('/events/favorite-ids');
  },

  /**
   * Ajoute un événement aux favoris.
   */
  async addFavorite(eventId: string): Promise<void> {
    await apiClient(`/events/${eventId}/favorite`, { method: 'POST' });
  },

  /**
   * Retire un événement des favoris.
   */
  async removeFavorite(eventId: string): Promise<void> {
    await apiClient(`/events/${eventId}/favorite`, { method: 'DELETE' });
  },
};
