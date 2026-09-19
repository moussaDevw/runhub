import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/context/AuthContext';
import { IconButton } from '@/components/ui/icon-button';
import { EventCard } from '@/components/ui/event-card';
import { Colors, AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { getEventImageSource } from '@/features/events/utils/event.utils';
import { useClubDetails } from '../hooks/useClubDetails';
import { useJoinRequests } from '../hooks/useJoinRequests';
import { useEventsList } from '@/features/events/hooks/useEvents';
import { ClubsApi } from '../api/clubs.api';

export function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: club, isLoading, isError } = useClubDetails(id);

  // Fetch pending requests only if admin/owner (skip otherwise)
  const isAdminOrOwner = club?.myRole === 'OWNER' || club?.myRole === 'ADMIN';
  const { data: pendingRequests = [] } = useJoinRequests(isAdminOrOwner ? id : '');
  const pendingCount = pendingRequests.length;

  // Fetch upcoming events for this club
  const { data: clubEventsData, isLoading: isLoadingEvents } = useEventsList({ clubId: id });
  const clubEvents = clubEventsData?.data ?? [];

  const followMutation = useMutation({
    mutationFn: () => {
      if (club?.isFollower) {
        return ClubsApi.unfollowClub(id);
      } else {
        return ClubsApi.followClub(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => {
      if (club?.isMember) {
        if (!user?.id) throw new Error('Utilisateur non connecté');
        return ClubsApi.leaveClub(id, user.id);
      } else {
        return ClubsApi.joinClub(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={AccentColors.bissap} />
      </View>
    );
  }

  if (isError || !club) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.light.text, fontFamily: Typography.corps.fontFamily }}>Impossible de charger le club.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: AccentColors.bissap, fontFamily: Typography.corpsGras.fontFamily }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER IMAGE SECTION */}
        <View style={styles.headerImageContainer}>
          <Image
            source={club.coverUrl ? { uri: club.coverUrl } : require('@/assets/images/bg_home.jpeg')}
            style={styles.headerImage}
            contentFit="cover"
          />

          <View style={[styles.backButtonContainer, { top: Math.max(insets.top, 20) }]}>
            <IconButton iconName="chevron-back" variant="glass" onPress={() => router.back()} />
          </View>
        </View>

        {/* OVERLAPPING CONTENT CARD */}
        <View style={styles.contentCard}>
          {/* Avatar over the border */}
          <View style={styles.avatarWrapper}>
            {club.logoUrl ? (
              <Image source={{ uri: club.logoUrl }} style={{ width: 64, height: 64, borderRadius: 32 }} />
            ) : (
              <Avatar initials={club.name.substring(0, 2).toUpperCase()} size={64} backgroundColor="#f2784f" />
            )}
          </View>

          {/* Club Info */}
          <View style={styles.titleRow}>
            <Text style={styles.clubName}>{club.name}</Text>
            {club.verified && (
              <Ionicons name="checkmark-circle" size={18} color="#3b82f6" style={{ marginLeft: 4 }} />
            )}
          </View>

          <Text style={styles.description}>
            {club.bio || 'Aucune description fournie pour ce club.'}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{club._count?.members || 0}</Text>
              <Text style={styles.statLabel}>membres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{club._count?.events || 0}</Text>
              <Text style={styles.statLabel}>events</Text>
            </View>
          </View>

          {/* === ADMIN / OWNER PANEL === */}
          {isAdminOrOwner && (
            <View style={styles.adminSection}>
              <View style={styles.adminSectionHeader}>
                <Ionicons name="settings-outline" size={16} color={Colors.light.ink3} />
                <Text style={styles.adminSectionTitle}>Gestion du club</Text>
              </View>

              <View style={styles.adminCardsContainer}>
                {/* 1. Demandes d'adhésion */}
                <TouchableOpacity
                  style={styles.adminCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/club/${id}/requests` as any)}
                >
                  <View style={styles.adminCardLeft}>
                    <View style={styles.adminIconBox}>
                      <Ionicons name="people-outline" size={20} color={AccentColors.bissap} />
                    </View>
                    <View>
                      <Text style={styles.adminCardTitle}>Demandes d'adhésion</Text>
                      <Text style={styles.adminCardSub}>
                        {pendingCount > 0
                          ? `${pendingCount} demande${pendingCount > 1 ? 's' : ''} en attente`
                          : 'Aucune demande en attente'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminCardRight}>
                    {pendingCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingCount}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
                  </View>
                </TouchableOpacity>

                {/* 2. Créer un événement pour ce club */}
                <TouchableOpacity
                  style={[styles.adminCard, { marginTop: Spacing.space12 }]}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/event/create?clubId=${id}` as any)}
                >
                  <View style={styles.adminCardLeft}>
                    <View style={[styles.adminIconBox, { backgroundColor: '#f0f1f8' }]}>
                      <Ionicons name="calendar-outline" size={20} color={AccentColors.indigoWolof} />
                    </View>
                    <View>
                      <Text style={styles.adminCardTitle}>Créer un événement</Text>
                      <Text style={styles.adminCardSub}>Publier une sortie au nom du club</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons — hidden for owner/admin */}
          {!isAdminOrOwner && (
            <View style={styles.actionRow}>
              {/* Join / Request / Leave button */}
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  club.isMember && styles.leaveButton,
                  club.joinRequestStatus === 'PENDING' && styles.pendingButton,
                ]}
                onPress={() => joinMutation.mutate()}
                disabled={joinMutation.isPending || club.joinRequestStatus === 'PENDING'}
              >
                {joinMutation.isPending ? (
                  <ActivityIndicator size="small" color={club.isMember ? '#e06666' : '#ffffff'} />
                ) : club.isMember ? (
                  <Text style={styles.leaveButtonText}>Quitter le club</Text>
                ) : club.joinRequestStatus === 'PENDING' ? (
                  <Text style={styles.pendingButtonText}>Demande envoyée</Text>
                ) : (
                  <Text style={styles.joinButtonText}>Rejoindre le club</Text>
                )}
              </TouchableOpacity>

              <View style={{ width: Spacing.space12 }} />

              {/* Follow / Unfollow button */}
              <TouchableOpacity
                style={[styles.followButton, club.isFollower && styles.subscribedButton]}
                onPress={() => followMutation.mutate()}
                disabled={followMutation.isPending}
              >
                {followMutation.isPending ? (
                  <ActivityIndicator size="small" color={club.isFollower ? Colors.light.text : '#ffffff'} />
                ) : club.isFollower ? (
                  <Text style={styles.subscribedText}>✓ Abonné</Text>
                ) : (
                  <Text style={styles.followButtonText}>Suivre le club</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* === UPCOMING EVENTS OF THE CLUB === */}
          <View style={styles.eventsSection}>
            <View style={styles.eventsHeaderRow}>
              <Text style={styles.sectionTitle}>Événements du club</Text>
              <Text style={styles.eventsCountBadge}>{clubEvents.length}</Text>
            </View>

            {isLoadingEvents ? (
              <ActivityIndicator size="small" color={AccentColors.bissap} style={{ marginVertical: 20 }} />
            ) : clubEvents.length === 0 ? (
              <View style={styles.emptyEventsBox}>
                <Ionicons name="calendar-outline" size={36} color={Colors.light.ink3} style={{ marginBottom: 8 }} />
                <Text style={styles.emptyEventsText}>Aucun événement prévu pour le moment.</Text>
                {isAdminOrOwner && (
                  <TouchableOpacity
                    style={styles.createEventLink}
                    onPress={() => router.push(`/event/create?clubId=${id}` as any)}
                  >
                    <Text style={styles.createEventLinkText}>+ Organiser la première sortie</Text>
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
                    onPress={() => router.push(`/event/${event.id}` as any)}
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space32,
  },
  joinButton: {
    flex: 1.2,
    backgroundColor: AccentColors.indigoWolof || '#2b3b8c',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  leaveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e06666',
  },
  leaveButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#e06666',
  },
  pendingButton: {
    backgroundColor: '#f5f2ee',
    borderWidth: 1,
    borderColor: '#d6d3ce',
  },
  pendingButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#8b8882',
  },
  followButton: {
    flex: 1,
    backgroundColor: AccentColors.bissap,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  subscribedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  subscribedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Spacing.space16,
  },
  // Admin section
  adminSection: {
    marginBottom: Spacing.space24,
  },
  adminSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space12,
    gap: 6,
  },
  adminSectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#f0ede9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  adminCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space12,
    flex: 1,
  },
  adminIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fdf0f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminCardTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  adminCardSub: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  adminCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: AccentColors.bissap,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: '#ffffff',
  },
  adminCardsContainer: {
    gap: Spacing.space8,
  },
  eventsSection: {
    marginTop: Spacing.space12,
  },
  eventsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.space16,
  },
  eventsCountBadge: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    fontWeight: '700',
  },
  emptyEventsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0ede9',
  },
  emptyEventsText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
    textAlign: 'center',
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

