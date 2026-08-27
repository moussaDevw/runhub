import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TicketDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon billet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* TICKET CARD */}
        <View style={styles.ticketWrapper}>

          {/* Top Half */}
          <View style={styles.ticketTop}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/bg_home.jpeg')}
                style={styles.image}
                contentFit="cover"
              />
              <View style={styles.sportBadge}>
                <View style={styles.sportDot} />
                <Text style={styles.sportLabel}>RUNNING</Text>
              </View>
            </View>

            <View style={styles.ticketDetails}>
              <Text style={styles.title}>Sunset Run · Corniche</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>QUAND</Text>
                  <Text style={styles.infoValue}>AUJ. · 18:30</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>LIEU</Text>
                  <Text style={styles.infoValue}>Corniche Ouest</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ticket Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.leftCutout} />
            <View style={styles.dashedLine} />
            <View style={styles.rightCutout} />
          </View>

          {/* Bottom Half */}
          <View style={styles.ticketBottom}>
            <View style={styles.qrCodeWrapper}>
              <Ionicons name="qr-code" size={160} color={Colors.light.text} />
            </View>

            <Text style={styles.ticketCode}>Y L - 7 K 2 - 9 Q D</Text>
            <Text style={styles.footerText}>Présente ce code à l&apos;organisateur à l&apos;arrivée</Text>
          </View>

        </View>

        {/* BOTTOM ACTIONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Partager</Text>
          </TouchableOpacity>
          <View style={{ width: Spacing.space16 }} />
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Ajouter à l&apos;agenda</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space20,
  },
  ticketWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: Spacing.space24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ticketTop: {
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sportBadge: {
    position: 'absolute',
    bottom: Spacing.space16,
    left: Spacing.space16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 22, 28, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f2784f',
    marginRight: 6,
  },
  sportLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  ticketDetails: {
    padding: Spacing.space20,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: Spacing.space16,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    position: 'relative',
    overflow: 'visible',
  },
  leftCutout: {
    position: 'absolute',
    left: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    zIndex: 10,
  },
  rightCutout: {
    position: 'absolute',
    right: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    zIndex: 10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  ticketBottom: {
    alignItems: 'center',
    padding: Spacing.space32,
    paddingTop: Spacing.space12,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space20,
  },
  ticketCode: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    letterSpacing: 3,
    marginBottom: Spacing.space12,
  },
  footerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
});
