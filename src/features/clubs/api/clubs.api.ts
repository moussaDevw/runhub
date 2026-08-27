import { apiClient } from '@/core/api/client';
import { ClubResponse, CreateClubPayload } from '../types/clubs.types';

export const ClubsApi = {
  /**
   * Créer un nouveau club
   */
  async createClub(payload: CreateClubPayload): Promise<ClubResponse> {
    return apiClient<ClubResponse>('/clubs', {
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Récupérer les détails d'un club
   */
  async getClub(id: string): Promise<ClubResponse> {
    return apiClient<ClubResponse>(`/clubs/${id}`);
  },

  /**
   * Récupérer la liste des clubs de l'utilisateur courant
   */
  async getMyClubs(): Promise<(ClubResponse & { role: string })[]> {
    return apiClient<(ClubResponse & { role: string })[]>('/users/me/clubs');
  },
};
