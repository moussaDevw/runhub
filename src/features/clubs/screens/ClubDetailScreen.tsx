import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { EventCard } from '@/features/events/components';
import { getEventImageSource } from '@/features/events/utils/event.utils';
import {
  ClubActionButtons,
  ClubAdminSection,
  ClubDetailSkeleton,
  ClubMembersPreview,
  ClubWhatsappCard,
} from '../components';
import { useClubDetailScreen } from '../hooks/useClubDetailScreen';

export function ClubDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    id,
    club,
    isLoading,
    isError,
    isAdminOrOwner,
    pendingCount,
    clubEvents,
    isLoadingEvents,
    members,
    isJoinPending,
    isFollowPending,
    handleJoinPress,
    handleFollowPress,
    handleOpenWhatsapp,
    handleCreateEvent,
    handleViewRequests,
    handleViewMembers,
    handleEventPress,
    goBack,
  } = useClubDetailScreen();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ClubDetailSkeleton />
      </View>
    );
  }

  if (isError || !club) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Ionicons name="alert-circle-outline" size={48} color={AccentColors.bissap} />
        <Text style={styles.errorText}>{t('club.errorLoad')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const defaultCover =
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800';

  const totalMembersCount = members.length || club._count?.members || 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* === HEADER COVER & BACK BUTTON === */}
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: club.coverUrl || defaultCover }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <View style={[styles.backButtonContainer, { top: insets.top + Spacing.space12 }]}>
            <IconButton
              iconName="chevron-back"
              variant="glass"
              onPress={goBack}
            />
          </View>
        </View>

        {/* === CONTENT CARD === */}
        <View style={styles.contentCard}>
          {/* Logo / Avatar */}
          <View style={styles.avatarWrapper}>
            {club.logoUrl ? (
              <Image source={{ uri: club.logoUrl }} style={styles.logoImage} />
            ) : (
              <Avatar
                initials={club.name.substring(0, 2).toUpperCase()}
                size={64}
                backgroundColor="#f2784f"
              />
            )}
          </View>

          {/* Club Info: Name + Verified Badge */}
          <View style={styles.titleRow}>
            <Text style={styles.clubName}>{club.name}</Text>
            {club.verified && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#3b82f6"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>

          {/* Bio / Description */}
          <Text style={styles.description}>{club.bio || t('club.noDescription')}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              activeOpacity={0.7}
              onPress={handleViewMembers}
            >
              <Text style={styles.statValue}>{totalMembersCount}</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel}>{t('club.members')}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={11}
                  color={Colors.light.ink3}
                  style={{ marginLeft: 2 }}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{club._count?.events || 0}</Text>
              <Text style={styles.statLabel}>{t('club.events')}</Text>
            </View>
          </View>

          {/* === ADMIN / OWNER PANEL === */}
          {isAdminOrOwner && (
            <ClubAdminSection
              pendingCount={pendingCount}
              membersCount={totalMembersCount}
              onPressRequests={handleViewRequests}
              onPressCreateEvent={handleCreateEvent}
              onPressMembers={handleViewMembers}
            />
          )}

          {/* === ACTION BUTTONS (MEMBER / NON-MEMBER) === */}
          {!isAdminOrOwner && (
            <ClubActionButtons
              club={club}
              isJoinPending={isJoinPending}
              isFollowPending={isFollowPending}
              onPressJoin={handleJoinPress}
              onPressFollow={handleFollowPress}
            />
          )}

          {/* === MEMBERS PREVIEW CARD === */}
          <ClubMembersPreview
            members={members}
            totalMembersCount={totalMembersCount}
            onPress={handleViewMembers}
          />

          {/* === WHATSAPP COMMUNITY CARD === */}
          {club.whatsappGroupUrl && <ClubWhatsappCard onPress={handleOpenWhatsapp} />}

          {/* === UPCOMING EVENTS OF THE CLUB === */}
          <View style={styles.eventsSection}>
            <View style={styles.eventsHeaderRow}>
              <Text style={styles.sectionTitle}>{t('club.eventsTitle')}</Text>
              <Text style={styles.eventsCountBadge}>{clubEvents.length}</Text>
            </View>

            {isLoadingEvents ? (
              <ActivityIndicator
                size="small"
                color={AccentColors.bissap}
                style={{ marginVertical: 20 }}
              />
            ) : clubEvents.length === 0 ? (
              <View style={styles.emptyEventsBox}>
                <Ionicons
                  name="calendar-outline"
                  size={36}
                  color={Colors.light.ink3}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.emptyEventsText}>{t('club.noEvents')}</Text>
                {isAdminOrOwner && (
                  <TouchableOpacity
                    style={styles.createEventLink}
                    onPress={handleCreateEvent}
                  >
                    <Text style={styles.createEventLinkText}>
                      {t('club.organizeFirstEvent')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              clubEvents.map((event) => {
                const { initials: organizerInitials } = getOrganizerDisplay(event.organizer);
                const priceStr = formatPrice(event.price);

                return (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    price={priceStr}
                    time={formatTime(event.startsAt)}
                    location={event.venueName || 'Dakar'}
                    participants={[
                      {
                        id: event.organizer.id,
                        initials: organizerInitials,
                        bgColor: event.sport.color || '#b78ad6',
                      },
                    ]}
                    totalPlaces={event.capacity || 0}
                    sportLabel={event.sport.labelFr}
                    sportColor={event.sport.color}
                    badgeTime={`${getDayLabel(event.startsAt)} ${formatTime(event.startsAt)}`}
                    imageSource={getEventImageSource(event.coverUrl)}
                    onPress={() => handleEventPress(event.id)}
                  />
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.space20,
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginTop: Spacing.space12,
    marginBottom: Spacing.space16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e5e0',
  },
  backButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  headerImageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    left: Spacing.space20,
    zIndex: 10,
  },
  contentCard: {
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.space20,
    paddingBottom: 40,
    marginTop: -24,
    position: 'relative',
  },
  avatarWrapper: {
    marginTop: -32,
    marginBottom: Spacing.space12,
    borderWidth: 4,
    borderColor: BackgroundThemes.Ivoire,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space8,
  },
  clubName: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 24,
    color: Colors.light.text,
  },
  description: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    lineHeight: 20,
    marginBottom: Spacing.space20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.space24,
  },
  statItem: {
    marginRight: Spacing.space32,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  eventsSection: {
    marginTop: Spacing.space8,
  },
  eventsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space16,
  },
  sectionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginRight: 8,
  },
  eventsCountBadge: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    backgroundColor: '#ebe7e1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyEventsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e5e0',
    borderStyle: 'dashed',
  },
  emptyEventsText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
  },
  createEventLink: {
    marginTop: Spacing.space12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fdf0f3',
    borderRadius: 99,
  },
  createEventLinkText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: AccentColors.bissap,
  },
});
