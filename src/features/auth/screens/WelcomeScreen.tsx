import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { YallaaLogo } from '@/components/ui/yallaa-logo';
import { Colors, Spacing, Typography } from '@/constants/theme';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image */}
      <Image
        source={require('@/assets/images/bg_home.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <YallaaLogo />
        </View>

        {/* Bottom Content Area */}
        <View style={styles.content}>
          <Text style={styles.superTitle}>DAKAR — COMMUNAUTE SPORTIVE</Text>

          <Text style={styles.title}>Le sport{"\n"}se vit{"\n"}ensemble.</Text>

          <Text style={styles.subtitle}>
            Trouve, crée et rejoins les events sportifs près de chez toi. Fini Instagram et WhatsApp.
          </Text>

          <View style={styles.paginationContainer}>
            <PaginationDots total={2} activeIndex={0} />
          </View>

          <View style={styles.actions}>
            <Button
              label="Créer mon compte"
              variant="primary"
              onPress={() => router.push('/auth/login' as any)}
            />
            <Button
              label="J'ai déjà un compte"
              variant="secondary"
              onPress={() => router.push('/auth/login' as any)}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.text, // Nuit
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '30%', // Start gradient lower down
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
  },
  content: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space26,
  },
  superTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: Typography.meta.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.space16,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: Typography.display.fontSize,
    color: '#ffffff',
    lineHeight: 48,
    marginBottom: Spacing.space20,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: Typography.corps.fontSize,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: Spacing.space26,
  },
  paginationContainer: {
    marginBottom: Spacing.space26,
  },
  actions: {
    gap: Spacing.space12,
  },
});
