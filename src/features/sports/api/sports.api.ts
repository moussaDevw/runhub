import { apiClient } from '@/core/api/client';
import { Sport } from '../types/sports.types';

export const SportsApi = {
  /**
   * Récupérer la liste complète des sports disponibles
   */
  async getAllSports(): Promise<Sport[]> {
    return apiClient<Sport[]>('/sports');
  },

  /**
   * Mettre à jour les sports préférés de l'utilisateur connecté
   */
  async updateUserSports(sportIds: string[]): Promise<void> {
    await apiClient('/users/me/sports', {
      method: 'PUT',
      body: { sportIds },
    });
  },
};
