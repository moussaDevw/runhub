import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { AccentColors, Colors, NeutralColors, Radius, Spacing, SportsColors, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { ClubCard, ClubCardSkeleton } from '@/features/clubs/components';
import { ClubResponse } from '@/features/clubs/types/clubs.types';
import { EventItemResponse } from '../api/events.api';
import { getEventImageSource } from '../utils/event.utils';
import { EventCard } from './event-card';
import { EventCardSkeleton } from './event-card-skeleton';

interface ExploreListViewProps {
  activeTab: 'events' | 'clubs';
  events: EventItemResponse[];
  clubs: ClubResponse[];
  sportsList: { id: string; labelFr: string }[];
  activeSportId?: string;
  onSelectSport: (id?: string) => void;
  isLoading: boolean;
  error: any;
  isRefetching: boolean;
  onRefetch: () => void;
  hasSearchOrFilters: boolean;
  onResetFilters: () => void;
  onNavigateCreate: () => void;
  onNavigateEvent: (id: string) => void;
  onNavigateClub: (id: string) => void;
}

export function ExploreListView({
  activeTab,
  events,
  clubs,
  sportsList,
  activeSportId,
  onSelectSport,
  isLoading,
  error,
  isRefetching,
  onRefetch,
  hasSearchOrFilters,
  onResetFilters,
  onNavigateCreate,
  onNavigateEvent,
  onNavigateClub,
}: ExploreListViewProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'events' ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          <>
            <ClubCardSkeleton />
            <ClubCardSkeleton />
          </>
        )}
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.light.ink3} />
        <Text style={styles.errorText}>
          {activeTab === 'events' ? t('exploreScreen.errorEvents') : t('exploreScreen.errorClubs')}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefetch}>
          <Text style={styles.retryText}>{t('exploreScreen.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={(activeTab === 'events' ? events : clubs) as any[]}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefetch}
          tintColor={AccentColors.bissap}
        />
      }
      ListHeaderComponent={
        <View style={styles.scrollHeaderSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
          >
            <Chip
              label={t('explore.filterAll', { defaultValue: 'Tout' })}
              isActive={!activeSportId}
              onPress={() => onSelectSport(undefined)}
            />
            {sportsList.map((sport) => (
              <Chip
                key={sport.id}
                label={sport.labelFr}
                isActive={activeSportId === sport.id}
                onPress={() => onSelectSport(activeSportId === sport.id ? undefined : sport.id)}
              />
            ))}
          </ScrollView>
        </View>
      }
      ListEmptyComponent={
        activeTab === 'events' ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={Colors.light.ink3} style={{ marginBottom: Spacing.space16 }} />
            <Text style={styles.emptyTitle}>
              {hasSearchOrFilters
                ? t('exploreScreen.noResultsTitle', { defaultValue: 'Aucun événement trouvé' })
                : t('exploreScreen.emptyEventsTitle')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasSearchOrFilters
                ? t('exploreScreen.noResultsSubtitle', { defaultValue: 'Essayez de modifier vos filtres ou termes de recherche.' })
                : t('exploreScreen.emptyEventsSubtitle')}
            </Text>
            {hasSearchOrFilters ? (
              <TouchableOpacity
                style={styles.resetFilterButton}
                activeOpacity={0.8}
                onPress={onResetFilters}
              >
                <Ionicons name="refresh-outline" size={18} color={AccentColors.bissap} style={{ marginRight: 6 }} />
                <Text style={styles.resetFilterButtonText}>{t('filter.reset', { defaultValue: 'Réinitialiser les filtres' })}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.8}
                onPress={onNavigateCreate}
              >
                <Text style={styles.createButtonText}>{t('exploreScreen.createEvent')}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.light.ink3} style={{ marginBottom: Spacing.space16 }} />
            <Text style={styles.emptyTitle}>
              {hasSearchOrFilters
                ? t('exploreScreen.noClubsFound', { defaultValue: 'Aucun club trouvé' })
                : t('exploreScreen.emptyClubsTitle')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasSearchOrFilters
                ? t('exploreScreen.noResultsSubtitle', { defaultValue: 'Essayez de modifier vos filtres ou termes de recherche.' })
                : t('exploreScreen.emptyClubsSubtitle')}
            </Text>
            {hasSearchOrFilters ? (
              <TouchableOpacity
                style={styles.resetFilterButton}
                activeOpacity={0.8}
                onPress={onResetFilters}
              >
                <Ionicons name="refresh-outline" size={18} color={AccentColors.bissap} style={{ marginRight: 6 }} />
                <Text style={styles.resetFilterButtonText}>{t('filter.reset', { defaultValue: 'Réinitialiser les filtres' })}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.8}
                onPress={onNavigateCreate}
              >
                <Text style={styles.createButtonText}>{t('exploreScreen.createClub')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      }
      renderItem={({ item }) => {
        if (activeTab === 'clubs') {
          const club = item as ClubResponse;
          return <ClubCard club={club} onPress={() => onNavigateClub(club.id)} />;
        }

        const event = item as EventItemResponse;
        const { initials: organizerInitials } = getOrganizerDisplay(event.organizer);
        const priceStr = formatPrice(event.price);

        const participantsList = [
          {
            id: event.organizer.id,
            initials: organizerInitials,
            bgColor: event.sport.color || SportsColors.yoga,
          },
        ];

        return (
          <EventCard
            id={event.id}
            title={event.title}
            price={priceStr}
            time={formatTime(event.startsAt)}
            location={event.venueName || 'Dakar'}
            distance={undefined}
            participants={participantsList}
            totalPlaces={event.capacity || 0}
            sportLabel={event.sport.labelFr}
            sportColor={event.sport.color}
            badgeTime={`${getDayLabel(event.startsAt)} ${formatTime(event.startsAt)}`}
            imageSource={getEventImageSource(event.coverUrl)}
            onPress={() => onNavigateEvent(event.id)}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.space20,
  },
  listContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  scrollHeaderSection: {
    marginTop: Spacing.space4,
    marginBottom: Spacing.space8,
  },
  filtersScroll: {
    marginHorizontal: -Spacing.space20,
  },
  filtersContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space4,
    paddingTop: 0,
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
    marginTop: Spacing.space12,
    marginBottom: Spacing.space20,
  },
  retryButton: {
    backgroundColor: AccentColors.bissap,
    borderRadius: Radius.btn,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: NeutralColors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.space20,
  },
  emptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.space24,
  },
  resetFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: AccentColors.bissap,
    borderRadius: Radius.btn,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: NeutralColors.white,
  },
  resetFilterButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: AccentColors.bissap,
  },
  createButton: {
    backgroundColor: AccentColors.bissap,
    borderRadius: Radius.btn,
    height: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: NeutralColors.white,
  },
});
