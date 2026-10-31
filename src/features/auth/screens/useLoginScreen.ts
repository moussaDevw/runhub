import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform } from 'react-native';
import { AuthApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

// Chargement conditionnel du module Apple (non dispo hors iOS natif)
let AppleAuthModule: any = null;
try {
  AppleAuthModule = require('expo-apple-authentication');
} catch {
  AppleAuthModule = null;
}

export type AuthProvider = 'apple' | 'google' | 'email';
export type LoginStep = 'oauth' | 'otp';

export function useLoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, loginWithEmailOtp } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  // Flux Email OTP
  const [step, setStep] = useState<LoginStep>('oauth');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Décompte de renvoi de code
  useEffect(() => {
    if (resendCountdown > 0) {
      timerRef.current = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendCountdown]);

  // Validation email basique
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // ─── Envoi du code OTP Email ───────────────────────────────────────────────

  const handleSendEmailOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError(t('auth.invalidEmail'));
      return;
    }

    setEmailError(null);
    setOtpError(null);
    setLoading(true);
    setLoadingProvider('email');

    try {
      await AuthApi.sendEmailOtp(trimmedEmail);
      setStep('otp');
      setResendCountdown(45);
    } catch (err: any) {
      const msg = err?.message || 'Impossible d\'envoyer le code. Veuillez réessayer.';
      setEmailError(msg);
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // ─── Vérification du code OTP Email ─────────────────────────────────────────

  const handleVerifyEmailOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code.length !== 6) {
      setOtpError(t('auth.codeRequired'));
      return;
    }

    setOtpError(null);
    setLoading(true);
    setLoadingProvider('email');

    try {
      await loginWithEmailOtp(email.trim().toLowerCase(), code);
    } catch (err: any) {
      const msg = err?.message || 'Code invalide ou expiré.';
      setOtpError(msg);
      Alert.alert('Erreur de validation', msg);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // ─── Renvoyer le code OTP ───────────────────────────────────────────────────

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    await handleSendEmailOtp();
  };

  // ─── Modifier l'adresse e-mail ──────────────────────────────────────────────

  const handleChangeEmail = () => {
    setStep('oauth');
    setOtpCode('');
    setOtpError(null);
  };

  // ─── Google ───────────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
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

      await GoogleOneTapSignIn.checkPlayServices(true);
      GoogleOneTapSignIn.configure({
        webClientId,
      });

      let response = await GoogleOneTapSignIn.signIn();

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.createAccount();
      }

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.presentExplicitSignIn();
      }

      if (isCancelledResponse(response)) {
        return;
      }

      if (!isSuccessResponse(response)) {
        return;
      }

      const { idToken } = response.data;
      if (!idToken) {
        throw new Error("Aucun jeton d'identité (idToken) retourné par Google.");
      }

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

  const handleBack = () => {
    if (step === 'otp') {
      handleChangeEmail();
    } else {
      router.back();
    }
  };

  return {
    loading,
    loadingProvider,
    step,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    emailError,
    otpError,
    resendCountdown,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    handleResendOtp,
    handleChangeEmail,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleBack,
  };
}
