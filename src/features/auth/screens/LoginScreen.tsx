import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

// Tente de charger les modules natifs en toute sécurité via un try/catch pour ne jamais faire planter Expo Go
let GoogleAuthSession: any = null;
try {
  GoogleAuthSession = require('expo-auth-session/providers/google');
} catch {
  GoogleAuthSession = null;
}

let AppleAuthModule: any = null;
try {
  AppleAuthModule = require('expo-apple-authentication');
} catch {
  AppleAuthModule = null;
}

/**
 * Composant interne pour Google OAuth.
 * Rendu uniquement si GoogleAuthSession a été chargé avec succès (hors Expo Go / build natif valide).
 */
function RealGoogleAuthButton({
  GoogleModule,
  onSuccessToken,
  loading,
  setLoadingProvider,
}: {
  GoogleModule: any;
  onSuccessToken: (token: string) => void;
  loading: boolean;
  setLoadingProvider: (p: 'google' | null) => void;
}) {
  const [request, response, promptAsync] = GoogleModule.useAuthRequest({
    clientId: '56194811758-bthf9sk2bm0qcjo2kdh9a350g485r47g.apps.googleusercontent.com',
    webClientId: '56194811758-bthf9sk2bm0qcjo2kdh9a350g485r47g.apps.googleusercontent.com',
    iosClientId: '56194811758-90l4smcmerqv5qgg5emm0pjfg3cj0mn3.apps.googleusercontent.com',
    androidClientId: '56194811758-mt1hcfmsvkuv17cmgmerlbd6gl4f88hh.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken || response.params?.id_token;
      if (idToken) {
        onSuccessToken(idToken);
      } else {
        Alert.alert('Erreur Google', "Aucun jeton d'identité (idToken) retourné par Google.");
      }
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={[styles.oauthBtn, styles.googleBtn]}
      onPress={() => {
        if (request) {
          setLoadingProvider('google');
          promptAsync();
        }
      }}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <>
          <Ionicons name="logo-google" size={20} color="#ffffff" style={styles.btnIcon} />
          <Text style={[styles.oauthBtnText, styles.googleBtnText]}>Continuer avec Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'apple' | 'google' | null>(null);

  const handleGoogleLoginWithToken = async (idToken: string) => {
    try {
      setLoading(true);
      setLoadingProvider('google');
      await login('google', idToken);
      router.replace('/(tabs)');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connexion impossible. Veuillez réessayer.';
      Alert.alert('Erreur Google', message);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

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
      router.replace('/(tabs)');
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

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/bg_home.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.superTitle}>COMMUNAUTÉ SPORTIVE</Text>
          <Text style={styles.title}>Connecte-toi en{"\n"}quelques secondes</Text>
          <Text style={styles.subtitle}>
            Choisis ton mode de connexion sécurisé. Aucune publication sur tes réseaux.
          </Text>

          <View style={styles.buttonsContainer}>
            {/* Apple Sign In Button */}
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={[styles.oauthBtn, styles.appleBtn]}
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                {loading && loadingProvider === 'apple' ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={22} color="#000000" style={styles.btnIcon} />
                    <Text style={[styles.oauthBtnText, styles.appleBtnText]}>
                      Continuer avec Apple
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Google Sign In Button */}
            {GoogleAuthSession ? (
              <RealGoogleAuthButton
                GoogleModule={GoogleAuthSession}
                onSuccessToken={handleGoogleLoginWithToken}
                loading={loading && loadingProvider === 'google'}
                setLoadingProvider={(p) => setLoadingProvider(p)}
              />
            ) : (
              <TouchableOpacity
                style={[styles.oauthBtn, styles.googleBtn]}
                onPress={() =>
                  Alert.alert(
                    'Module Google manquant',
                    'La connexion Google réelle nécessite un build natif (expo run:ios/android ou Development Build).'
                  )
                }
                disabled={loading}
              >
                <Ionicons name="logo-google" size={20} color="#ffffff" style={styles.btnIcon} />
                <Text style={[styles.oauthBtnText, styles.googleBtnText]}>
                  Continuer avec Google
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b359a5ff',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 22, 28, 0.85)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space32,
  },
  superTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: Typography.meta.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.space12,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 34,
    color: '#ffffff',
    lineHeight: 40,
    marginBottom: Spacing.space16,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
    lineHeight: 22,
    marginBottom: Spacing.space32,
  },
  buttonsContainer: {
    gap: Spacing.space16,
  },
  oauthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
  },
  btnIcon: {
    marginRight: 12,
  },
  appleBtn: {
    backgroundColor: '#ffffff',
  },
  appleBtnText: {
    color: '#000000',
  },
  googleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  googleBtnText: {
    color: '#ffffff',
  },
  oauthBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  devContainer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  devTitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
