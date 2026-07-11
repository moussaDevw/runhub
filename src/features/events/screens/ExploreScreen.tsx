import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { EventCard } from '@/components/ui/event-card';
import { FilterModalNative } from '@/components/ui/filter-modal-native';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { Colors,  AccentColors, BackgroundThemes, Radius, Spacing, Typography } from '@/constants/theme';
import { formatTime, getDayLabel, formatPrice } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEventsList } from '../hooks/useEvents';

const FILTERS = ['Tout', "Aujourd'hui", 'Running', 'Football', 'Yoga'];

export function ExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tout');
  const router = useRouter();
  const { user } = useAuth();

  const { data: events = [], isLoading, error, refetch, isRefetching } = useEventsList();

  // Filter events based on activeFilter
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'Tout') return true;

    if (activeFilter === "Aujourd'hui") {
      const eventDate = new Date(event.startsAt).toDateString();
      const todayDate = new Date().toDateString();
      return eventDate === todayDate;
    }

    return event.sport.slug.toLowerCase() === activeFilter.toLowerCase();
  });

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'TD';

  const defaultImage = require('@/assets/images/bg_home.jpeg');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* FIXED HEADER (Profile & Search) */}
      <View style={styles.fixedHeader}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#b8324f" />
              <Text style={styles.locationText}>DAKAR</Text>
            </View>
            <Text style={styles.mainTitle} numberOfLines={1}>Yallaa, on bouge ?</Text>
          </View>
          <View style={styles.topRightActions}>
            <IconButton iconName="heart-outline" variant="outline" onPress={() => router.push('/favorites' as any)} />
            <View style={{ width: 8 }} />
            <IconButton iconName="notifications-outline" variant="outline" hasBadge onPress={() => router.push('/notifications' as any)} />
            <View style={{ width: 12 }} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profil')}>
              <Avatar initials={userInitials} size={44} backgroundColor="#b78ad6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Filter Row */}
        <View style={styles.searchRow}>
          <SearchBar />
          <View style={{ width: Spacing.space12 }} />
          <IconButton
            iconName="options-outline"
            hasBadge
            onPress={() => setFilterVisible(true)}
          />
        </View>
      </View>

      {/* EVENTS FEED */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.light.ink3} />
          <Text style={styles.errorText}>Impossible de charger les événements</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
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
              {/* Filters Row */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
                {FILTERS.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    isActive={activeFilter === filter}
                    onPress={() => setActiveFilter(filter)}
                  />
                ))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={Colors.light.ink3} style={{ marginBottom: Spacing.space16 }} />
              <Text style={styles.emptyTitle}>Aucun événement trouvé</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'Tout'
                  ? "Sois le premier à organiser une session sportive à Dakar !"
                  : "Aucun événement ne correspond à ce filtre pour le moment."}
              </Text>
              {activeFilter === 'Tout' && (
                <TouchableOpacity
                  style={styles.createButton}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/creer' as any)}
                >
                  <Text style={styles.createButtonText}>Créer un event 🚀</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const { name: organizerName, initials: organizerInitials } = getOrganizerDisplay(item.organizer);
            const priceStr = formatPrice(item.price);

            // Prepare single participant card representation
            const participantsList = [
              {
                id: item.organizer.id,
                initials: organizerInitials,
                bgColor: item.sport.color || '#b78ad6',
              },
            ];

            return (
              <EventCard
                id={item.id}
                title={item.title}
                price={priceStr}
                time={formatTime(item.startsAt)}
                location={item.venueName || 'Dakar'}
                distance={undefined}
                participants={participantsList}
                totalPlaces={item.capacity || 0}
                sportLabel={item.sport.labelFr}
                sportColor={item.sport.color}
                badgeTime={`${getDayLabel(item.startsAt)} ${formatTime(item.startsAt)}`}
                imageSource={defaultImage}
                onPress={() => router.push(`/event/${item.id}` as any)}
              />
            );
          }}
        />
      )}

      <FilterModalNative isVisible={filterVisible} onDismiss={() => setFilterVisible(false)} />
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
    paddingTop: Spacing.space20,
    backgroundColor: BackgroundThemes.Ivoire,
    zIndex: 10,
    paddingBottom: Spacing.space12,
  },
  scrollHeaderSection: {
    marginBottom: Spacing.space20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  topLeft: {
    flex: 1,
    paddingRight: Spacing.space12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink3,
    letterSpacing: 1,
    marginLeft: 4,
  },
  mainTitle: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 28,
    color: Colors.light.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  filtersScroll: {
    marginHorizontal: -Spacing.space20,
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
