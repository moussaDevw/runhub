import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ProfileApi } from '@/features/profile/api/profile.api';

export function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Merci de renseigner votre prénom et votre nom.');
      return;
    }
    setError(undefined);
    setLoading(true);

    try {
      await ProfileApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Vérifier si l'utilisateur a déjà choisi 2 sports ou plus
      if (!user?.sports || user.sports.length < 2) {
        router.replace('/sports' as any);
      } else {
        router.replace('/(tabs)/explorer' as any);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/bg_home.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.superTitle}>ÉTAPE 1 SUR 2</Text>
            <Text style={styles.title}>Faisons connaissance</Text>
            <Text style={styles.subtitle}>
              Comment tu t&apos;appelles ? C&apos;est le nom sous lequel la communauté te verra.
            </Text>

            <View style={styles.formSection}>
              <FormInput
                label="PRÉNOM"
                placeholder="Ex : Tidiane"
                value={firstName}
                onChangeText={(val) => {
                  setFirstName(val);
                  if (error) setError(undefined);
                }}
                autoCapitalize="words"
                containerStyle={styles.inputContainer}
              />

              <FormInput
                label="NOM"
                placeholder="Ex : Diop"
                value={lastName}
                onChangeText={(val) => {
                  setLastName(val);
                  if (error) setError(undefined);
                }}
                autoCapitalize="words"
                containerStyle={styles.inputContainer}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              label={loading ? 'Enregistrement...' : 'Continuer'}
              variant="primary"
              onPress={handleSubmit}
              disabled={loading || !isFormValid}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.text,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 22, 28, 0.88)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
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
    marginBottom: Spacing.space12,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
    lineHeight: 22,
    marginBottom: Spacing.space24,
  },
  formSection: {
    marginBottom: Spacing.space12,
  },
  inputContainer: {
    marginBottom: Spacing.space16,
  },
  errorText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: '#C8392F',
    marginBottom: Spacing.space16,
  },
});
