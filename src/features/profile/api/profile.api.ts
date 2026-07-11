import { apiClient } from '@/core/api/client';
import { User } from '@/features/auth/types/auth.types';
import { UpdateProfilePayload } from '../types/profile.types';

export const ProfileApi = {
  /**
   * Mettre à jour le profil utilisateur (prénom, nom, bio, etc.)
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    return apiClient<User>('/users/me', {
      method: 'PATCH',
      body: payload,
    });
  },

  /**
   * Récupérer les infos complètes de l'utilisateur connecté (incluant ses sports)
   */
  async getMe(): Promise<User> {
    return apiClient<User>('/users/me');
  },

  /**
   * Mettre à jour spécifiquement la position GPS (ultra-rapide)
   */
  async updateLocation(lat: number, lng: number): Promise<{ success: boolean; coords: { lat: number; lng: number } }> {
    return apiClient('/users/me/location', {
      method: 'PATCH',
      body: { lat, lng },
    });
  },

  /**
   * Mettre à jour les paramètres (notifications, mode éco-data)
   */
  async updateSettings(payload: { notifEnabled?: boolean; ecoData?: boolean }): Promise<Partial<User>> {
    return apiClient('/users/me/settings', {
      method: 'PATCH',
      body: payload,
    });
  },
};
