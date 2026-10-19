import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginScreen } from './useLoginScreen';

export function LoginScreen() {
  const { loading, loadingProvider, handleGoogleSignIn, handleAppleSignIn, handleBack } =
    useLoginScreen();

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
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.superTitle}>COMMUNAUTÉ SPORTIVE</Text>
          <Text style={styles.title}>Connecte-toi en{'\n'}quelques secondes</Text>
          <Text style={styles.subtitle}>
            Choisis ton mode de connexion sécurisé. Aucune publication sur tes réseaux.
          </Text>

          <View style={styles.buttonsContainer}>
            {/* Apple Sign In Button — iOS uniquement */}
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
            <TouchableOpacity
              style={[styles.oauthBtn, styles.googleBtn]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              {loading && loadingProvider === 'google' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#ffffff" style={styles.btnIcon} />
                  <Text style={[styles.oauthBtnText, styles.googleBtnText]}>
                    Continuer avec Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
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
});
