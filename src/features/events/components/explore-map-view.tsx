import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { MapLibreView } from '@/components/ui/map-libre-view';
import { DAKAR_COORDINATES } from '@/constants/map';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { formatPrice, formatTime, getDayLabel } from '@/core/utils/locale';
import { EventItemResponse } from '../api/events.api';
import { useExploreMap } from '../hooks/useExploreMap';
import { getEventImageSource } from '../utils/event.utils';

interface ExploreMapViewProps {
  events: EventItemResponse[];
  sportsList: { id: string; labelFr: string }[];
  activeSportId?: string;
  onSelectSport: (id?: string) => void;
  onNavigateEvent: (id: string) => void;
  cardBottomOffset?: number;
}

export function ExploreMapView({
  events,
  sportsList,
  activeSportId,
  onSelectSport,
  onNavigateEvent,
  cardBottomOffset = 85,
}: ExploreMapViewProps) {
  const { t } = useTranslation();
  const {
    selectedEvent,
    centerCoords,
    userLocation,
    mapEvents,
    handleRecenter,
    handleSelectMarker,
    handleClearSelection,
  } = useExploreMap(events);

  return (
    <View style={styles.container}>
      {/* Sports Filters overlay */}
      <View style={styles.filtersOverlay}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
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

      {/* Interactive Map */}
      <MapLibreView
        style={StyleSheet.absoluteFill}
        centerCoords={centerCoords || userLocation || DAKAR_COORDINATES}
        showUserLocation={true}
        onMarkerPress={(marker) => handleSelectMarker(marker.id)}
        markers={mapEvents.map((item) => ({
          id: item.id,
          latitude: item.coords!.lat,
          longitude: item.coords!.lng,
          color: item.sport.color,
          label: item.sport.labelFr,
        }))}
      />

      {/* Recenter button */}
      <TouchableOpacity
        style={styles.recenterBtn}
        activeOpacity={0.8}
        onPress={handleRecenter}
        accessibilityRole="button"
        accessibilityLabel="Recentrer sur ma position"
      >
        <Ionicons name="navigate" size={20} color={Colors.light.text} />
      </TouchableOpacity>

      {/* Selected Event Card Preview */}
      {selectedEvent && (
        <View style={[styles.selectedCardWrapper, { bottom: cardBottomOffset }]}>
          <TouchableOpacity
            style={styles.selectedCard}
            activeOpacity={0.9}
            onPress={() => onNavigateEvent(selectedEvent.id)}
          >
            <Image
              source={getEventImageSource(selectedEvent.coverUrl)}
              style={styles.selectedThumb}
              contentFit="cover"
            />
            <View style={styles.selectedDetails}>
              <View style={styles.selectedSportRow}>
                <View style={[styles.selectedDot, { backgroundColor: selectedEvent.sport.color }]} />
                <Text style={styles.selectedSport}>{selectedEvent.sport.labelFr}</Text>
                <Text style={styles.selectedPrice}>• {formatPrice(selectedEvent.price)}</Text>
              </View>
              <Text style={styles.selectedTitle} numberOfLines={1}>
                {selectedEvent.title}
              </Text>
              <View style={styles.selectedMeta}>
                <Ionicons name="time-outline" size={13} color={Colors.light.ink3} style={{ marginRight: 4 }} />
                <Text style={styles.selectedMetaText}>
                  {getDayLabel(selectedEvent.startsAt)} {formatTime(selectedEvent.startsAt)}
                </Text>
                <Text style={styles.selectedMetaDot}>•</Text>
                <Ionicons name="location-outline" size={13} color={Colors.light.ink3} style={{ marginRight: 2 }} />
                <Text style={styles.selectedMetaText} numberOfLines={1}>
                  {selectedEvent.venueName || 'Dakar'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.selectedClose}
              onPress={handleClearSelection}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={18} color={Colors.light.ink3} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  filtersOverlay: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  filtersContent: {
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space4,
    paddingTop: 0,
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    top: 60,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 20,
  },
  selectedCardWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 25,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  selectedDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  selectedSportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  selectedSport: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  selectedPrice: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  selectedTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMetaText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
  },
  selectedMetaDot: {
    marginHorizontal: 4,
    color: Colors.light.ink3,
    fontSize: 10,
  },
  selectedClose: {
    padding: 6,
  },
});
