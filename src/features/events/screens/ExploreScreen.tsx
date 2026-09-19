import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { ClubCard } from '@/components/ui/club-card';
import { EventCard } from '@/components/ui/event-card';
import { FilterModalNative } from '@/components/ui/filter-modal-native';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { TabSwitcher } from '@/components/ui/strava-tabs';
import { AccentColors, BackgroundThemes, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { ClubResponse } from '@/features/clubs/types/clubs.types';
import { EventItemResponse } from '@/features/events/api/events.api';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useExploreScreen } from '../hooks/useExploreScreen';
import { getEventImageSource } from '../utils/event.utils';

export function ExploreScreen() {
  const { t } = useTranslation();
  const {
    filterVisible,
    setFilterVisible,
    activeSportId,
    setActiveSportId,
    activeDateFilter,
    setActiveDateFilter,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    userInitials,
    sportsList,
    events,
    clubs,
    isLoading,
    error,
    isRefetching,
    refetch,
    handleNavigateProfile,
    handleNavigateFavorites,
    handleNavigateNotifications,
    handleNavigateCreate,
    handleNavigateEvent,
    handleNavigateClub,
  } = useExploreScreen();

  const availableNeighborhoods = Array.from(new Set(events.map(e => e.city).filter(Boolean) as string[]));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* FIXED HEADER — compact 1-line */}
      <View style={styles.fixedHeader}>
        {/* Top Bar : Avatar | Titre | Favoris + Notifications */}
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleNavigateProfile}>
            <Avatar initials={userInitials} size={36} backgroundColor="#b78ad6" />
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="#b8324f" />
              <Text style={styles.locationText}>DAKAR</Text>
            </View>
            <Text style={styles.mainTitle}>Explorer</Text>
          </View>

          <View style={styles.topRightActions}>
            <IconButton iconName="heart-outline" variant="ghost" onPress={handleNavigateFavorites} />
            <IconButton iconName="notifications-outline" variant="ghost" hasBadge onPress={handleNavigateNotifications} />
          </View>
        </View>

        {/* Search & Filter Row */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={{ width: Spacing.space12 }} />
          <IconButton
            iconName="options-outline"
            hasBadge={!!activeDateFilter}
            onPress={() => setFilterVisible(true)}
          />
        </View>

        {/* Tab Switcher */}
        <TabSwitcher
          options={['Événements', 'Clubs']}
          selectedIndex={activeTab === 'events' ? 0 : 1}
          onChange={(index) => setActiveTab(index === 0 ? 'events' : 'clubs')}
        />
      </View>

      {/* FEED (EVENTS / CLUBS) */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.light.ink3} />
          <Text style={styles.errorText}>
            {activeTab === 'events' ? 'Impossible de charger les événements' : 'Impossible de charger les clubs'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Réessayer</Text>
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
                <Text style={styles.emptyTitle}>Aucun événement trouvé</Text>
                <Text style={styles.emptySubtitle}>
                  {!activeSportId
                    ? "Sois le premier à organiser une session sportive à Dakar !"
                    : "Aucun événement ne correspond à ce filtre pour le moment."}
                </Text>
                {!activeSportId && (
                  <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={handleNavigateCreate}
                  >
                    <Text style={styles.createButtonText}>Créer un event 🚀</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color={Colors.light.ink3} style={{ marginBottom: Spacing.space16 }} />
                <Text style={styles.emptyTitle}>Aucun club trouvé</Text>
                <Text style={styles.emptySubtitle}>
                  {!activeSportId
                    ? "Aucun club n'a encore été créé sur la plateforme."
                    : "Aucun club ne correspond à ce filtre pour le moment."}
                </Text>
                {!activeSportId && (
                  <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={handleNavigateCreate}
                  >
                    <Text style={styles.createButtonText}>Créer un club 🤝</Text>
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
                bgColor: event.sport.color || '#b78ad6',
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
        onApplyDateFilter={setActiveDateFilter}
        availableNeighborhoods={availableNeighborhoods}
      />
    </SafeAreaView>
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
    paddingTop: Spacing.space12,
    backgroundColor: BackgroundThemes.Ivoire,
    zIndex: 10,
    paddingBottom: 0,
  },
  scrollHeaderSection: {
    marginBottom: Spacing.space12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space12,
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
    marginBottom: Spacing.space12,
  },
  filtersScroll: {
    marginHorizontal: -Spacing.space20,
  },
  dateFiltersScroll: {
    marginHorizontal: -Spacing.space20,
    marginTop: Spacing.space8,
  },
  filtersContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space8,
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: '#65625e',
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
    color: '#ffffff',
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
    color: '#65625e',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.space24,
  },
  createButton: {
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
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
    color: '#ffffff',
  },
});
