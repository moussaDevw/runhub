import { apiClient } from '@/core/api/client';
import { TokenStorage } from '@/core/api/token-storage';
import { User, VerifyOtpResponse } from '../types/auth.types';

export const AuthApi = {
  /**
   * Envoie le token OAuth au backend pour vérification / création du compte.
   */
  async verifyOAuth(
    provider: 'google' | 'apple',
    idToken: string,
    firstName?: string,
    lastName?: string,
  ): Promise<VerifyOtpResponse> {
    const res = await apiClient<any>('/auth/oauth/verify', {
      method: 'POST',
      body: { provider, idToken, firstName, lastName },
      skipAuth: true,
    });

    const accessToken = res.accessToken || res.access_token || res.token;
    const refreshToken = res.refreshToken || res.refresh_token || accessToken;

    if (accessToken) {
      await TokenStorage.saveTokens(accessToken, refreshToken);
    }

    return res as VerifyOtpResponse;
  },

  /**
   * Récupère le profil de l'utilisateur connecté via le token sauvegardé.
   */
  async getMe(): Promise<User> {
    return apiClient<User>('/users/me');
  },

  /**
   * Déconnecte l'utilisateur côté serveur et supprime les tokens locaux.
   */
  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignorer si le serveur renvoie une erreur (ex: token déjà expiré)
    } finally {
      await TokenStorage.clearTokens();
    }
  },
};
