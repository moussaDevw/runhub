import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Chargement conditionnel du module Apple (non dispo hors iOS natif)
let AppleAuthModule: any = null;
try {
  AppleAuthModule = require('expo-apple-authentication');
} catch {
  AppleAuthModule = null;
}

export type AuthProvider = 'apple' | 'google';

export function useLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  // ─── Google ───────────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    // 1. Détection de l'environnement Expo Go
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (isExpoGo) {
      Alert.alert(
        'Environnement non supporté',
        'La connexion Google native (Nitro) nécessite un Development Build (expo run:android ou expo run:ios) et ne peut pas fonctionner dans Expo Go.'
      );
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert(
        'Non supporté sur le web',
        'La connexion Google native (Nitro) est disponible uniquement sur Android et iOS.'
      );
      return;
    }

    // 2. Chargement du module natif Nitro
    let nitroSignin: typeof import('react-native-nitro-google-signin') | null = null;
    try {
      nitroSignin = require('react-native-nitro-google-signin');
    } catch {
      Alert.alert(
        'Build natif requis',
        'Le module natif react-native-nitro-google-signin n\'a pas pu être chargé. Assurez-vous d\'exécuter l\'application via un Development Build natif.'
      );
      return;
    }

    if (!nitroSignin) return;

    const {
      GoogleOneTapSignIn,
      isSuccessResponse,
      isCancelledResponse,
      isNoSavedCredentialFoundResponse,
      isErrorWithCode,
      statusCodes,
    } = nitroSignin;

    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) {
      Alert.alert(
        'Configuration manquante',
        'La variable d\'environnement EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID n\'est pas configurée.'
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingProvider('google');

      // 3. Validation Google Play Services (Android uniquement)
      await GoogleOneTapSignIn.checkPlayServices(true);

      // 4. Configuration avec le Web Client ID du projet GCP / Firebase
      GoogleOneTapSignIn.configure({
        webClientId,
      });

      // 5. Tentative de One Tap sign-in (comptes autorisés / session enregistrée)
      let response = await GoogleOneTapSignIn.signIn();

      // 6. Si aucun compte mémorisé, proposer la création / choix interactif de compte
      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.createAccount();
      }

      // 7. Si toujours sans résultat, afficher la boîte de dialogue explicite
      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.presentExplicitSignIn();
      }

      // 8. Annulation utilisateur (fermeture de la modale sans sélection)
      if (isCancelledResponse(response)) {
        return;
      }

      // 9. Vérification du succès
      if (!isSuccessResponse(response)) {
        return;
      }

      const { idToken } = response.data;
      if (!idToken) {
        throw new Error("Aucun jeton d'identité (idToken) retourné par Google.");
      }

      // 10. Authentification auprès de l'API backend Jump-In
      // La redirection vers les tabs est gérée par Stack.Protected (_layout.tsx)
      await login('google', idToken);
    } catch (err: any) {
      if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      if (isErrorWithCode(err) && err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Services Google Play indisponibles',
          'Veuillez mettre à jour ou installer les services Google Play pour vous connecter avec Google.'
        );
        return;
      }

      const message =
        err instanceof Error ? err.message : 'Connexion impossible. Veuillez réessayer.';
      Alert.alert('Erreur Google', message);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // ─── Apple ────────────────────────────────────────────────────────────────

  const handleAppleSignIn = async () => {
    if (!AppleAuthModule) {
      Alert.alert(
        'Module Apple manquant',
        'La connexion Apple réelle nécessite un build natif iOS (expo run:ios ou Development Build).'
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingProvider('apple');

      const credential = await AppleAuthModule.signInAsync({
        requestedScopes: [
          AppleAuthModule.AppleAuthenticationScope.FULL_NAME,
          AppleAuthModule.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Aucun jeton d'identité Apple reçu.");
      }

      const firstName = credential.fullName?.givenName || undefined;
      const lastName = credential.fullName?.familyName || undefined;

      await login('apple', credential.identityToken, firstName, lastName);
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Erreur Apple', err?.message || 'Connexion Apple impossible.');
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // ─── Navigation ───────────────────────────────────────────────────────────

  const handleBack = () => router.back();

  return {
    loading,
    loadingProvider,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleBack,
  };
}
