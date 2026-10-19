import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HStack, Screen, Spacer } from '@/components/layout';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { FilterModalNative } from '@/components/ui/filter-modal-native';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { TabSwitcher } from '@/components/ui/strava-tabs';
import { AccentColors, BackgroundThemes, Colors, NeutralColors, Radius, Spacing, SportsColors, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { ClubCard, ClubCardSkeleton } from '@/features/clubs/components';
import { ClubResponse } from '@/features/clubs/types/clubs.types';
import { EventItemResponse } from '@/features/events/api/events.api';
import { EventCard, EventCardSkeleton } from '@/features/events/components';
import { useTheme } from '@/hooks/use-theme';
import { useExploreScreen } from '../hooks/useExploreScreen';
import { getEventImageSource } from '../utils/event.utils';

export function ExploreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    filterVisible,
    setFilterVisible,
    activeSportId,
    setActiveSportId,
    activeDateFilter,
    activePriceFilter,
    activeNeighborhood,
    hasActiveFilters,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    userInitials,
    unreadNotificationsCount,
    sportsList,
    events,
    clubs,
    isLoading,
    error,
    isRefetching,
    refetch,
    handleApplyFilters,
    handleResetFilters,
    handleNavigateProfile,
    handleNavigateFavorites,
    handleNavigateNotifications,
    handleNavigateCreate,
    handleNavigateEvent,
    handleNavigateClub,
  } = useExploreScreen();

  const availableNeighborhoods = Array.from(new Set(events.map(e => e.city).filter(Boolean) as string[]));
  const availableSports = sportsList.map(s => ({ id: s.id, label: s.labelFr }));

  const hasSearchOrFilters = hasActiveFilters || searchQuery.length > 0 || !!activeSportId;

  return (
    <Screen safeTop safeBottom={false}>
      <StatusBar style="dark" />

      {/* FIXED HEADER */}
      <View style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
        {/* Top Bar : Avatar | Titre | Favoris + Notifications */}
        <HStack align="center" justify="space-between" style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleNavigateProfile} accessibilityRole="button">
            <Avatar initials={userInitials} size={36} backgroundColor={SportsColors.yoga} />
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <HStack align="center" justify="center" style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={AccentColors.bissap} />
              <Text style={styles.locationText}>DAKAR</Text>
            </HStack>
            <Text style={[styles.mainTitle, { color: theme.text }]}>{t('exploreScreen.title')}</Text>
          </View>

          <HStack align="center" style={styles.topRightActions}>
            <IconButton iconName="heart-outline" variant="ghost" onPress={handleNavigateFavorites} />
            <IconButton
              iconName="notifications-outline"
              variant="ghost"
              hasBadge={unreadNotificationsCount > 0}
              onPress={handleNavigateNotifications}
            />
          </HStack>
        </HStack>

        {/* Search & Filter Row */}
        <HStack align="center" style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Spacer size="space12" horizontal />
          <IconButton
            iconName="options-outline"
            hasBadge={hasActiveFilters}
            onPress={() => setFilterVisible(true)}
          />
        </HStack>

        {/* Tab Switcher */}
        <TabSwitcher
          options={[t('exploreScreen.tabEvents'), t('exploreScreen.tabClubs')]}
          selectedIndex={activeTab === 'events' ? 0 : 1}
          onChange={(index) => setActiveTab(index === 0 ? 'events' : 'clubs')}
        />
      </View>

      {/* FEED (EVENTS / CLUBS) */}
      {isLoading ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
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
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.light.ink3} />
          <Text style={styles.errorText}>
            {activeTab === 'events' ? t('exploreScreen.errorEvents') : t('exploreScreen.errorClubs')}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>{t('exploreScreen.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={(activeTab === 'events' ? events : clubs) as any[]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={AccentColors.bissap}
            />
          }
          ListHeaderComponent={
            <View style={styles.scrollHeaderSection}>
              {/* Sports Filters */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
                <Chip
                  label={t('explore.filterAll')}
                  isActive={!activeSportId}
                  onPress={() => setActiveSportId(undefined)}
                />
                {sportsList.map((sport) => (
                  <Chip
                    key={sport.id}
                    label={sport.labelFr}
                    isActive={activeSportId === sport.id}
                    onPress={() => setActiveSportId(
                      activeSportId === sport.id ? undefined : sport.id,
                    )}
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
                  {hasSearchOrFilters ? t('exploreScreen.noResultsTitle', { defaultValue: 'Aucun événement trouvé' }) : t('exploreScreen.emptyEventsTitle')}
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
                    onPress={() => {
                      setSearchQuery('');
                      handleResetFilters();
                    }}
                  >
                    <Ionicons name="refresh-outline" size={18} color={AccentColors.bissap} style={{ marginRight: 6 }} />
                    <Text style={styles.resetFilterButtonText}>{t('filter.reset', { defaultValue: 'Réinitialiser les filtres' })}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={handleNavigateCreate}
                  >
                    <Text style={styles.createButtonText}>{t('exploreScreen.createEvent')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color={Colors.light.ink3} style={{ marginBottom: Spacing.space16 }} />
                <Text style={styles.emptyTitle}>
                  {hasSearchOrFilters ? t('exploreScreen.noClubsFound', { defaultValue: 'Aucun club trouvé' }) : t('exploreScreen.emptyClubsTitle')}
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
                    onPress={() => {
                      setSearchQuery('');
                      handleResetFilters();
                    }}
                  >
                    <Ionicons name="refresh-outline" size={18} color={AccentColors.bissap} style={{ marginRight: 6 }} />
                    <Text style={styles.resetFilterButtonText}>{t('filter.reset', { defaultValue: 'Réinitialiser les filtres' })}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={handleNavigateCreate}
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
              return (
                <ClubCard
                  club={club}
                  onPress={() => handleNavigateClub(club.id)}
                />
              );
            }

            const event = item as EventItemResponse;
            const { name: _organizerName, initials: organizerInitials } = getOrganizerDisplay(event.organizer);
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
                onPress={() => handleNavigateEvent(event.id)}
              />
            );
          }}
        />
      )}

      <FilterModalNative
        isVisible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        activeDateFilter={activeDateFilter}
        activeSportId={activeSportId}
        activePriceFilter={activePriceFilter}
        activeNeighborhood={activeNeighborhood}
        onApplyFilters={handleApplyFilters}
        availableSports={availableSports}
        availableNeighborhoods={availableNeighborhoods}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.space20,
  },
  listContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: 100, // Space for bottom tab bar
    flexGrow: 1,
  },
  fixedHeader: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space8,
    backgroundColor: Colors.light.background,
    zIndex: 10,
    paddingBottom: 0,
  },
  scrollHeaderSection: {
    marginTop: Spacing.space4,
    marginBottom: Spacing.space8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space8,
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.space8,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  locationText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.ink3,
    letterSpacing: 1,
    marginLeft: 2,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space8,
  },
  filtersScroll: {
    marginHorizontal: -Spacing.space20,
  },
  dateFiltersScroll: {
    marginHorizontal: -Spacing.space20,
    marginTop: Spacing.space4,
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
