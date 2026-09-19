import { apiClient } from '@/core/api/client';
import { ClubJoinRequest, ClubResponse, CreateClubPayload } from '../types/clubs.types';

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

  /**
   * Récupérer/Rechercher les clubs de la plateforme
   */
  async searchClubs(params?: { q?: string; sportId?: string }): Promise<{ data: ClubResponse[] }> {
    const queryParts = [];
    if (params?.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
    if (params?.sportId) queryParts.push(`sportId=${params.sportId}`);
    const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return apiClient<{ data: ClubResponse[] }>(`/search/clubs${queryStr}`);
  },

  /**
   * Envoyer une demande d'adhésion à un club
   */
  async joinClub(clubId: string): Promise<any> {
    return apiClient<any>(`/clubs/${clubId}/join-requests`, {
      method: 'POST',
    });
  },

  /**
   * Quitter un club
   */
  async leaveClub(clubId: string, userId: string): Promise<any> {
    return apiClient<any>(`/clubs/${clubId}/members/${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Suivre un club
   */
  async followClub(clubId: string): Promise<any> {
    return apiClient<any>(`/clubs/${clubId}/follow`, {
      method: 'POST',
    });
  },

  /**
   * Ne plus suivre un club
   */
  async unfollowClub(clubId: string): Promise<any> {
    return apiClient<any>(`/clubs/${clubId}/follow`, {
      method: 'DELETE',
    });
  },

  /**
   * Récupérer les demandes d'adhésion en attente (ADMIN/OWNER uniquement)
   */
  async getJoinRequests(clubId: string): Promise<ClubJoinRequest[]> {
    return apiClient<ClubJoinRequest[]>(`/clubs/${clubId}/join-requests`);
  },

  /**
   * Accepter ou refuser une demande d'adhésion (ADMIN/OWNER uniquement)
   */
  async respondToJoinRequest(
    clubId: string,
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
  ): Promise<any> {
    return apiClient<any>(`/clubs/${clubId}/join-requests/${requestId}`, {
      method: 'PATCH',
      body: { status },
    });
  },
};


