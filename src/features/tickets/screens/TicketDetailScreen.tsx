import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';

import { useEventDetail, useRegistrationStatus } from '@/features/events/hooks/useEvents';
import { formatEventPresentation } from '@/features/events/utils/event.utils';

export function TicketDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const eventId = id || '';

  const { data: event, isLoading: isEventLoading } = useEventDetail(eventId);
  const { data: regStatus, isLoading: isStatusLoading } = useRegistrationStatus(eventId);

  const isLoading = isEventLoading || isStatusLoading;
  const presentation = event ? formatEventPresentation(event) : null;
  const rawTicketCode = regStatus?.registration?.ticketCode || 'RUNHUB01';
  const isCheckedIn = regStatus?.registration?.status === 'CHECKED_IN';

  // Format code nicely: e.g. 7KB9 - QD2A
  const formattedTicketCode = rawTicketCode.length === 8 
    ? `${rawTicketCode.slice(0, 4)} - ${rawTicketCode.slice(4)}`
    : rawTicketCode.split('').join(' ');

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await Share.share({
        message: `Mon billet pour "${event?.title || 'l\'événement'}" sur RunHub.\nCode d'accès : ${rawTicketCode}`,
      });
    } catch (err) {
      console.log('Error sharing ticket:', err);
    }
  };

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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
          <Text style={styles.loadingText}>Chargement de votre billet...</Text>
        </View>
      ) : (
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
                  source={event?.coverUrl ? { uri: event.coverUrl } : require('@/assets/images/bg_home.jpeg')}
                  style={styles.image}
                  contentFit="cover"
                />
                <View style={styles.sportBadge}>
                  <View style={[styles.sportDot, event?.sport?.color ? { backgroundColor: event.sport.color } : null]} />
                  <Text style={styles.sportLabel}>{event?.sport?.labelFr?.toUpperCase() || 'RUNNING'}</Text>
                </View>

                {/* Status Pill on Top */}
                <View style={[styles.statusPill, isCheckedIn ? styles.statusCheckedIn : styles.statusValid]}>
                  <Ionicons
                    name={isCheckedIn ? 'checkmark-done-circle' : 'shield-checkmark'}
                    size={14}
                    color="#ffffff"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.statusPillText}>
                    {isCheckedIn ? 'Validé à l\'entrée' : 'Billet confirmé'}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketDetails}>
                <Text style={styles.title}>{event?.title || 'Sunset Run · Corniche'}</Text>

                <View style={styles.infoRow}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>QUAND</Text>
                    <Text style={styles.infoValue}>
                      {presentation ? `${presentation.dateDay} · ${presentation.dateTime}` : 'AUJ. · 18:30'}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>LIEU</Text>
                    <Text style={styles.infoValue}>{event?.venueName || event?.city || 'Dakar'}</Text>
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
              <Text style={styles.scanInstructionTitle}>Présente ce QR Code à l&apos;arrivée</Text>
              
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={rawTicketCode}
                  size={160}
                  color={Colors.light.text}
                  backgroundColor="#ffffff"
                />
              </View>

              <View style={styles.manualCodeBox}>
                <Text style={styles.manualCodeLabel}>CODE D&apos;ACCÈS MANUEL</Text>
                <Text style={styles.ticketCode}>{formattedTicketCode}</Text>
              </View>

              <Text style={styles.footerText}>
                À présenter à l&apos;organisateur pour le scan caméra ou pour la saisie manuelle.
              </Text>
            </View>

          </View>

          {/* BOTTOM ACTIONS */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={18} color={Colors.light.text} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryButtonText}>Partager</Text>
            </TouchableOpacity>
            <View style={{ width: Spacing.space16 }} />
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/agenda')}
            >
              <Ionicons name="calendar-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>Mon agenda</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.space32,
  },
  loadingText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.ink3,
    marginTop: Spacing.space16,
  },
  statusPill: {
    position: 'absolute',
    top: Spacing.space16,
    right: Spacing.space16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  statusValid: {
    backgroundColor: 'rgba(47, 107, 77, 0.9)',
  },
  statusCheckedIn: {
    backgroundColor: 'rgba(32, 99, 155, 0.9)',
  },
  statusPillText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: '#ffffff',
  },
  scanInstructionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Spacing.space16,
    textAlign: 'center',
  },
  manualCodeBox: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space16,
    width: '100%',
  },
  manualCodeLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    letterSpacing: 1,
    marginBottom: 4,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
});
