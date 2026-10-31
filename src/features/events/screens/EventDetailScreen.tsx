import { MapLibreView } from '@/components/ui/map-libre-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarGroup } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';
import { formatPrice } from '@/core/utils/locale';
import { EventBottomBar, EventDetailSkeleton, InfoSquareCard, OrganizerRow } from '@/features/events/components';
import { useEventDetailScreen } from '../hooks/useEventDetailScreen';

export function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    id,
    event,
    isLoading,
    error,
    liked,
    toggleLiked,
    isOrganizer,
    isRegistered,
    isMutating,
    registrationsCount,
    spotsLeft,
    placesText,
    capacityLabel,
    participantAvatars,
    imageSource,
    organizerFullName,
    organizerInitials,
    formattedDate,
    weekdaySubValue,
    handleParticipate,
    handleViewTicket,
    handleCancelRegistration,
    handleOpenDirections,
    goBack,
  } = useEventDetailScreen();

  const handleOpenWhatsApp = async () => {
    if (event?.whatsappGroupUrl) {
      try {
        const canOpen = await Linking.canOpenURL(event.whatsappGroupUrl);
        if (canOpen) {
          await Linking.openURL(event.whatsappGroupUrl);
          return;
        }
      } catch (e) {
        console.warn('Cannot open WhatsApp url:', e);
      }
      Linking.openURL(event.whatsappGroupUrl);
    } else {
      Alert.alert(
        'Groupe WhatsApp',
        "L'organisateur n'a pas encore renseigné de lien de groupe WhatsApp pour cet événement."
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <EventDetailSkeleton />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{t('eventDetail.errorLoad')}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={goBack}>
          <Text style={styles.retryBtnText}>{t('eventDetail.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* HEADER IMAGE SECTION */}
        <View style={styles.headerImageContainer}>
          <Image
            source={imageSource || undefined}
            style={styles.image}
            contentFit="cover"
          />

          {/* Top Navigation Buttons */}
          <View style={[styles.navButtons, { top: Math.max(insets.top, 20) }]}>
            <IconButton iconName="chevron-back" variant="outline" onPress={() => router.back()} />
            <View style={styles.rightNavButtons}>
              {isOrganizer && (
                <>
                  <IconButton
                    iconName="create-outline"
                    variant="outline"
                    onPress={() => id && router.push(`/event/create?id=${id}` as any)}
                  />
                  <View style={{ width: Spacing.space12 }} />
                </>
              )}
              <IconButton iconName="share-outline" variant="outline" />
              <View style={{ width: Spacing.space12 }} />
              <IconButton
                iconName={liked ? "heart" : "heart-outline"}
                variant={liked ? "liked" : "outline"}
                onPress={toggleLiked}
              />
            </View>
          </View>

          {/* Header Texts Overlay */}
          <View style={styles.headerTexts}>
            <View style={styles.sportBadge}>
              <View style={[styles.sportDot, { backgroundColor: event.sport.color }]} />
              <Text style={styles.sportLabel}>{event.sport.labelFr}</Text>
            </View>
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#e3e3e1" style={{ marginRight: 6 }} />
              <Text style={styles.locationText} numberOfLines={1}>{event.venueName || 'Dakar'}</Text>
            </View>
            <Text style={styles.subtitle}>{t('eventDetail.organizedBy')} {organizerFullName}</Text>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.contentSection}>
          {/* Info Squares */}
          <View style={styles.infoRow}>
            <InfoSquareCard
              label={t('eventDetail.whenLabel')}
              value={formattedDate}
              subValue={weekdaySubValue}
            />
            <View style={{ width: Spacing.space12 }} />
            <InfoSquareCard
              label={t('eventDetail.placesLabel')}
              value={placesText}
              subValue={capacityLabel}
            />
            <View style={{ width: Spacing.space12 }} />
            <InfoSquareCard
              label={t('eventDetail.priceLabel')}
              value={formatPrice(event.price)}
              subValue={event.price > 0 ? 'F CFA' : t('eventDetail.freeEntry')}
            />
          </View>

          <OrganizerRow
            name={organizerFullName}
            initials={organizerInitials}
            avatarColor={event.sport.color}
            meta={t('eventDetail.organizer')}
          />

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeading}>{t('eventDetail.sectionSession')}</Text>
          <Text style={styles.description}>
            {event.description || t('eventDetail.noDescription')}
          </Text>

          {/* Real Map Location Preview */}
          {event.coords && (
            <View style={styles.mapSection}>
              <Text style={styles.sectionHeading}>{t('eventDetail.sectionLocation')}</Text>
              <Text style={styles.mapAddress}>{event.venueName}</Text>

              <View style={styles.miniMapWrapper}>
                <MapLibreView
                  style={StyleSheet.absoluteFill}
                  centerCoords={{
                    latitude: event.coords.lat,
                    longitude: event.coords.lng,
                  }}
                  showUserLocation={false}
                  markers={[{
                    id: 'event-location',
                    latitude: event.coords.lat,
                    longitude: event.coords.lng,
                    color: event.sport.color,
                    label: event.sport.labelFr,
                  }]}
                  zoomLevel={14}
                />
              </View>

              <TouchableOpacity
                style={styles.directionBtn}
                activeOpacity={0.8}
                onPress={handleOpenDirections}
              >
                <Ionicons name="navigate-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.directionBtnText}>{t('eventDetail.openDirections')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Participants */}
          <View style={{ marginTop: Spacing.space32 }}>
            <Text style={[styles.sectionHeading, { marginBottom: Spacing.space16 }]}>
              {t('eventDetail.whosComing')} • {registrationsCount}
            </Text>
            {participantAvatars.length > 0 ? (
              <AvatarGroup users={participantAvatars} max={6} size={44} />
            ) : (
              <Text style={styles.noParticipantsText}>{t('eventDetail.noParticipants')}</Text>
            )}
          </View>

          {/* WhatsApp Community Card */}
          {event.whatsappGroupUrl && (
            <View style={{ marginTop: Spacing.space24 }}>
              <TouchableOpacity
                style={styles.whatsappCard}
                activeOpacity={0.85}
                onPress={handleOpenWhatsApp}
              >
                <View style={styles.whatsappCardLeft}>
                  <View style={styles.whatsappIconCircle}>
                    <Ionicons name="logo-whatsapp" size={22} color="#ffffff" />
                  </View>
                  <View style={styles.whatsappCardTexts}>
                    <Text style={styles.whatsappCardTitle}>Communauté WhatsApp</Text>
                    <Text style={styles.whatsappCardSubtitle}>Rejoindre le groupe officiel des coureurs</Text>
                  </View>
                </View>
                <Ionicons name="open-outline" size={20} color="#25D366" />
              </TouchableOpacity>
            </View>
          )}

          {/* Registration status card */}
          {isRegistered && (
            <View style={{ marginTop: Spacing.space24 }}>
              <TouchableOpacity
                style={styles.registeredCard}
                activeOpacity={0.85}
                onPress={handleViewTicket}
              >
                <View style={styles.registeredCardLeft}>
                  <View style={styles.qrIconCircle}>
                    <Ionicons name="qr-code" size={22} color="#ffffff" />
                  </View>
                  <View style={styles.registeredCardTexts}>
                    <Text style={styles.registeredCardTitle}>{t('eventDetail.myTicket')}</Text>
                    <Text style={styles.registeredCardSubtitle}>{t('eventDetail.scanInstruction')}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={AccentColors.vertTeranga} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelRegistrationBtn}
                activeOpacity={0.7}
                onPress={handleCancelRegistration}
              >
                <Ionicons name="close-circle-outline" size={16} color={Colors.light.ink3} style={{ marginRight: 6 }} />
                <Text style={styles.cancelRegistrationText}>{t('eventDetail.cancelRegistration')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM BAR */}
      <EventBottomBar
        price={formatPrice(event.price)}
        placesStatus={
          isOrganizer
            ? t('event.organizerLabel')
            : spotsLeft === 0
              ? t('eventDetail.statusFull')
              : isRegistered
                ? t('eventDetail.statusRegistered')
                : t('eventDetail.statusAvailable')
        }
        onParticipate={handleParticipate}
        onViewTicket={handleViewTicket}
        onChat={handleOpenWhatsApp}
        hasWhatsApp={!!event.whatsappGroupUrl}
        isRegistered={isRegistered}
        isLoading={isMutating}
        isOrganizer={isOrganizer}
        isFull={spotsLeft === 0}
        onManage={() => router.push(`/check-in/${id}` as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BackgroundThemes.Ivoire,
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: AccentColors.bissap,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
  headerImageContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: Colors.light.text,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  navButtons: {
    position: 'absolute',
    left: Spacing.space20,
    right: Spacing.space20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  rightNavButtons: {
    flexDirection: 'row',
  },
  headerTexts: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space32 + 24,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 22, 28, 0.4)',
    paddingHorizontal: Spacing.space12,
    paddingVertical: 6,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginBottom: Spacing.space12,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  sportLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 32,
    color: '#ffffff',
    marginBottom: Spacing.space12,
    lineHeight: 36,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#e3e3e1',
    flex: 1,
  },
  subtitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contentSection: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space32,
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.space12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.backgroundElement,
    width: '100%',
    marginVertical: 24,
  },
  sectionHeading: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: Spacing.space12,
  },
  description: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
    lineHeight: 24,
  },
  mapSection: {
    marginTop: Spacing.space32,
  },
  mapAddress: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
    marginBottom: 12,
  },
  miniMapWrapper: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    marginBottom: 12,
  },
  directionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.text,
    borderRadius: 12,
    height: 44,
  },
  directionBtnText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
  noParticipantsText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
  },
  whatsappCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  whatsappCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  whatsappIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whatsappCardTexts: {
    flex: 1,
  },
  whatsappCardTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  whatsappCardSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  registeredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: AccentColors.vertTeranga,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: Spacing.space24,
    shadowColor: AccentColors.vertTeranga,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  registeredCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  qrIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AccentColors.vertTeranga,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  registeredCardTexts: {
    flex: 1,
  },
  registeredCardTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  registeredCardSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  cancelRegistrationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  cancelRegistrationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    textDecorationLine: 'underline',
  },
});
