import { apiClient } from '@/core/api/client';
import { TokenStorage } from '@/core/api/token-storage';
import { Platform } from 'react-native';
import { User, VerifyOtpResponse } from '../types/auth.types';

/**
 * Déconnecte la session Google côté SDK natif (GoogleOneTapSignIn).
 * Nécessaire pour que le prochain signIn() affiche le picker de comptes
 * au lieu de réutiliser le credential en cache.
 */
async function revokeGoogleSession(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const nitroSignin = require('react-native-nitro-google-signin');
    if (nitroSignin?.GoogleOneTapSignIn) {
      await nitroSignin.GoogleOneTapSignIn.signOut();
    }
  } catch {
    // Module non disponible (Expo Go, etc.) — rien à faire
  }
}

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
      // skipRefresh : un 401 ici ne doit pas relancer un refresh ni re-déclencher logout()
      await apiClient('/auth/logout', { method: 'POST', skipRefresh: true });
    } catch {
      // Ignorer si le serveur renvoie une erreur (ex: token déjà expiré)
    } finally {
      await Promise.all([TokenStorage.clearTokens(), revokeGoogleSession()]);
    }
  },
};
