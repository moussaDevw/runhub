import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapLibreView } from '@/components/ui/map-libre-view';

import { AvatarGroup } from '@/components/ui/avatar';
import { EventBottomBar } from '@/components/ui/event-bottom-bar';
import { IconButton } from '@/components/ui/icon-button';
import { InfoSquareCard } from '@/components/ui/info-square-card';
import { OrganizerRow } from '@/components/ui/organizer-row';
import { Colors,  BackgroundThemes, Spacing, Typography, AccentColors } from '@/constants/theme';
import { formatPrice } from '@/core/utils/locale';
import { useEventDetailScreen } from '../hooks/useEventDetailScreen';

export function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
    handleOpenDirections,
    goBack,
    t,
  } = useEventDetailScreen();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AccentColors.bissap} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Impossible de charger l&apos;événement.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={goBack}>
          <Text style={styles.retryBtnText}>Retour</Text>
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
            <IconButton iconName="chevron-back" variant="glass" onPress={() => router.back()} />
            <View style={styles.rightNavButtons}>
              {isOrganizer && (
                <>
                  <IconButton 
                    iconName="create-outline" 
                    variant="glass" 
                    onPress={() => id && router.push(`/(tabs)/creer?id=${id}` as any)} 
                  />
                  <View style={{ width: Spacing.space12 }} />
                </>
              )}
              <IconButton iconName="share-outline" variant="glass" />
              <View style={{ width: Spacing.space12 }} />
              <IconButton 
                iconName={liked ? "heart" : "heart-outline"} 
                variant={liked ? "liked" : "glass"} 
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
            <Text style={styles.subtitle}>Organisé par {organizerFullName}</Text>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.contentSection}>
          {/* Info Squares */}
          <View style={styles.infoRow}>
            <InfoSquareCard 
              label="QUAND" 
              value={formattedDate} 
              subValue={weekdaySubValue} 
            />
            <View style={{ width: Spacing.space12 }} />
            <InfoSquareCard 
              label="PLACES" 
              value={placesText} 
              subValue={capacityLabel} 
            />
            <View style={{ width: Spacing.space12 }} />
            <InfoSquareCard 
              label="PRIX" 
              value={formatPrice(event.price)} 
              subValue={event.price > 0 ? 'F CFA' : 'Entrée libre'} 
            />
          </View>

          <OrganizerRow
            name={organizerFullName}
            initials={organizerInitials}
            avatarColor={event.sport.color}
            meta="Organisateur"
          />

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeading}>La séance</Text>
          <Text style={styles.description}>
            {event.description || "Aucune description fournie pour cet événement. Rejoignez le groupe de discussion pour en savoir plus auprès de l'organisateur !"}
          </Text>

          {/* Real Map Location Preview */}
          {event.coords && (
            <View style={styles.mapSection}>
              <Text style={styles.sectionHeading}>Lieu de rendez-vous</Text>
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
                <Text style={styles.directionBtnText}>Ouvrir l&apos;itinéraire</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Participants */}
          <View style={{ marginTop: Spacing.space32 }}>
            <Text style={[styles.sectionHeading, { marginBottom: Spacing.space16 }]}>
              Qui vient • {registrationsCount}
            </Text>
            {participantAvatars.length > 0 ? (
              <AvatarGroup users={participantAvatars} max={6} size={44} />
            ) : (
              <Text style={styles.noParticipantsText}>Soyez le premier à rejoindre l&apos;événement !</Text>
            )}
          </View>

          {/* Registration status badge */}
          {isRegistered && (
            <View style={styles.registeredBadge}>
              <Ionicons name="checkmark-circle" size={18} color={AccentColors.vertTeranga} />
              <Text style={styles.registeredText}>Vous êtes inscrit(e) ✓</Text>
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
              ? "COMPLET"
              : isRegistered
                ? "INSCRIT"
                : "PLACES DISPONIBLES"
        }
        onParticipate={handleParticipate}
        onChat={() => router.push(`/chat/${id}` as any)}
        isRegistered={isRegistered}
        isLoading={isMutating}
        isOrganizer={isOrganizer}
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
    color: '#65625e',
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
    color: '#65625e',
    lineHeight: 24,
  },
  mapSection: {
    marginTop: Spacing.space32,
  },
  mapAddress: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
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
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: Spacing.space24,
    gap: 8,
  },
  registeredText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: AccentColors.vertTeranga,
  },
});
