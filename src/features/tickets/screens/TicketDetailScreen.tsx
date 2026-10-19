import { Colors, AccentColors, Radius, Shadows, Spacing, Typography, NeutralColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';

import { HStack, Screen, Spacer } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useEventDetail, useRegistrationStatus } from '@/features/events/hooks/useEvents';
import { formatEventPresentation } from '@/features/events/utils/event.utils';
import { TicketDetailSkeleton } from '../components/ticket-detail-skeleton';

export function TicketDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
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
        message: t('ticket.shareMessage', {
          title: event?.title || 'l\'événement',
          code: rawTicketCode,
        }),
      });
    } catch (err) {
      console.log('Error sharing ticket:', err);
    }
  };

  const header = (
    <HStack align="center" justify="space-between" style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.back', { defaultValue: 'Retour' })}
      >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('ticket.title')}</Text>
      <View style={{ width: 40 }} />
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      header={header}
      contentContainerStyle={styles.scrollContent}
      backgroundColor={theme.backgroundElement}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? (
        <TicketDetailSkeleton />
      ) : (
        <>
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
                    {isCheckedIn ? t('ticket.statusCheckedIn') : t('ticket.statusValid')}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketDetails}>
                <Text style={styles.title}>{event?.title || 'Sunset Run · Corniche'}</Text>

                <View style={styles.infoRow}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>{t('ticket.when')}</Text>
                    <Text style={styles.infoValue}>
                      {presentation ? `${presentation.dateDay} · ${presentation.dateTime}` : 'AUJ. · 18:30'}
                    </Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>{t('ticket.location')}</Text>
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
              <Text style={styles.scanInstructionTitle}>{t('ticket.scanInstruction')}</Text>
              
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={rawTicketCode}
                  size={160}
                  color={Colors.light.text}
                  backgroundColor="#ffffff"
                />
              </View>

              <View style={styles.manualCodeBox}>
                <Text style={styles.manualCodeLabel}>{t('ticket.manualCodeLabel')}</Text>
                <Text style={styles.ticketCode}>{formattedTicketCode}</Text>
              </View>

              <Text style={styles.footerText}>
                {t('ticket.footerNotice')}
              </Text>
            </View>

          </View>

          {/* BOTTOM ACTIONS */}
          <HStack align="center" justify="space-between" style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={18} color={theme.text} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryButtonText}>{t('ticket.share')}</Text>
            </TouchableOpacity>
            <Spacer size="space16" horizontal />
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/agenda')}
            >
              <Ionicons name="calendar-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>{t('ticket.myAgenda')}</Text>
            </TouchableOpacity>
          </HStack>
          <Spacer size="space24" />
        </>
      )}
    </Screen>
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
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.cardBackground,
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
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
    marginBottom: Spacing.space24,
    overflow: 'hidden',
    ...Shadows.card,
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
    backgroundColor: NeutralColors.overlay40,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AccentColors.corailSunset,
    marginRight: 6,
  },
  sportLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: NeutralColors.white,
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
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  statusPill: {
    position: 'absolute',
    top: Spacing.space16,
    right: Spacing.space16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
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
    color: NeutralColors.white,
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
    borderRadius: Radius.md,
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
    borderRadius: Radius.sm,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: NeutralColors.white,
  },
});
