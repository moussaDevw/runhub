import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams();
  
  const isPublish = type === 'publish';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, presentation: 'fullScreenModal' }} />

      {/* BACKGROUND IMAGE */}
      <Image
        source={require('@/assets/images/onboarding_bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <View style={[
        styles.contentContainer, 
        { 
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: Math.max(insets.bottom, Spacing.space20) 
        }
      ]}>

        {/* CENTER CONTENT */}
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}>
            <Ionicons name={isPublish ? "flash" : "checkmark"} size={48} color="#ffffff" />
          </View>

          <Text style={styles.title}>{isPublish ? "C'est en ligne !" : "C'est noté !"}</Text>

          {isPublish ? (
            <>
              <Text style={styles.subtitle}>
                <Text style={styles.boldText}>Sunset Run · Corniche</Text> est visible dans Explorer. Partage-le pour remplir tes 40 places.
              </Text>
              <View style={styles.linkPill}>
                <Text style={styles.linkPillText}>yallaa.app/e/sunset-run-7k2</Text>
              </View>
            </>
          ) : (
            <Text style={styles.subtitle}>
              Tu participes à <Text style={styles.boldText}>Sunset Run · Corniche</Text>, auj. à 18:30. On t'a ajouté au groupe WhatsApp.
            </Text>
          )}
        </View>

        {/* BOTTOM ACTIONS */}
        <View style={styles.actionsContainer}>
          {isPublish ? (
            <>
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Inviter des sportifs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/agenda')}
              >
                <Text style={styles.secondaryButtonText}>Gérer mes events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tertiaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.tertiaryButtonText}>Voir la page de l'event</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8}
                onPress={() => router.push('/ticket/1' as any)}
              >
                <Text style={styles.primaryButtonText}>Voir mon billet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => router.replace('/chat/1' as any)}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#ffffff" style={styles.chatIcon} />
                <Text style={styles.secondaryButtonText}>Ouvrir la discussion</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tertiaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/explorer')}
              >
                <Text style={styles.tertiaryButtonText}>Explorer d'autres events</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.text,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.space20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.space20,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space32,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 40,
    color: '#ffffff',
    marginBottom: Spacing.space16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: '#e3e3e1',
    textAlign: 'center',
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  linkPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
    borderRadius: 99,
    marginTop: Spacing.space24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkPillText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: 1,
  },
  actionsContainer: {
    width: '100%',
    paddingTop: Spacing.space32,
  },
  primaryButton: {
    backgroundColor: AccentColors.bissap,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space12,
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space16,
  },
  chatIcon: {
    marginRight: 8,
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  tertiaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
});
