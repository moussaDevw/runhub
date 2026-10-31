import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HStack, Screen, Spacer } from '@/components/layout';
import { Avatar } from '@/components/ui/avatar';
import { FilterModalNative } from '@/components/ui/filter-modal-native';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { TabSwitcher } from '@/components/ui/strava-tabs';
import { AccentColors, Colors, Spacing, SportsColors, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ExploreListView, ExploreMapView, ExploreViewToggle } from '../components';
import { useExploreScreen } from '../hooks/useExploreScreen';

export function ExploreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

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
    userAvatarUrl,
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

  const availableNeighborhoods = Array.from(new Set(events.map((e) => e.city).filter(Boolean) as string[]));
  const availableSports = sportsList.map((s) => ({ id: s.id, labelFr: s.labelFr }));
  const hasSearchOrFilters = hasActiveFilters || searchQuery.length > 0 || !!activeSportId;

  const handleToggleView = () => {
    if (viewMode === 'list') {
      if (activeTab !== 'events') setActiveTab('events');
      setViewMode('map');
    } else {
      setViewMode('list');
    }
  };

  return (
    <Screen safeTop safeBottom={false}>
      <StatusBar style="dark" />

      {/* FIXED HEADER */}
      <View style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
        {/* Top Bar : Avatar | Titre | Favoris + Notifications */}
        <HStack align="center" justify="space-between" style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleNavigateProfile} accessibilityRole="button">
            <Avatar uri={userAvatarUrl} initials={userInitials} size={36} backgroundColor={SportsColors.yoga} />
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
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
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
          onChange={(index) => {
            const nextTab = index === 0 ? 'events' : 'clubs';
            setActiveTab(nextTab);
            if (nextTab === 'clubs' && viewMode === 'map') {
              setViewMode('list');
            }
          }}
        />
      </View>

      {/* VIEW : LIST OR MAP */}
      {viewMode === 'map' ? (
        <ExploreMapView
          events={events}
          sportsList={availableSports}
          activeSportId={activeSportId}
          onSelectSport={setActiveSportId}
          onNavigateEvent={handleNavigateEvent}
          cardBottomOffset={Math.max(insets.bottom + 70, 85)}
        />
      ) : (
        <ExploreListView
          activeTab={activeTab}
          events={events}
          clubs={clubs}
          sportsList={availableSports}
          activeSportId={activeSportId}
          onSelectSport={setActiveSportId}
          isLoading={isLoading}
          error={error}
          isRefetching={isRefetching}
          onRefetch={refetch}
          hasSearchOrFilters={hasSearchOrFilters}
          onResetFilters={() => {
            setSearchQuery('');
            handleResetFilters();
          }}
          onNavigateCreate={handleNavigateCreate}
          onNavigateEvent={handleNavigateEvent}
          onNavigateClub={handleNavigateClub}
        />
      )}

      {/* FLOATING TOGGLE BUTTON */}
      <ExploreViewToggle
        viewMode={viewMode}
        onToggle={handleToggleView}
        bottomInset={Math.max(insets.bottom + 12, 24)}
      />

      {/* FILTER MODAL */}
      <FilterModalNative
        isVisible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        activeDateFilter={activeDateFilter}
        activeSportId={activeSportId}
        activePriceFilter={activePriceFilter}
        activeNeighborhood={activeNeighborhood}
        onApplyFilters={handleApplyFilters}
        availableSports={sportsList.map((s) => ({ id: s.id, label: s.labelFr }))}
        availableNeighborhoods={availableNeighborhoods}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space8,
    backgroundColor: Colors.light.background,
    zIndex: 10,
    paddingBottom: 0,
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
});
