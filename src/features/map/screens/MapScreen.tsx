import { MapLibreView } from '@/components/ui/map-libre-view';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClubEventRow } from '@/components/ui/club-event-row';
import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';
import { formatTime, getDayLabel } from '@/core/utils/locale';
import { getOrganizerDisplay } from '@/core/utils/user';
import { useAuth } from '@/features/auth/context/AuthContext';
import { EventItemResponse } from '@/features/events/api/events.api';
import { useEventsList } from '@/features/events/hooks/useEvents';
import { ProfileApi } from '@/features/profile/api/profile.api';

const { height } = Dimensions.get('window');

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Fetch real events from database
  const { data: eventsResponse, isLoading: isLoadingEvents } = useEventsList();
  const events = eventsResponse?.data ?? [];

  // Filter events that have valid coordinates
  const mapEvents = events.filter((e) => e.coords !== null && e.coords !== undefined);

  // Request location permissions and get user position
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // permission granted — proceed to get location
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const lat = loc.coords.latitude;
          const lng = loc.coords.longitude;

          const coords = { latitude: lat, longitude: lng };
          setUserLocation(coords);
          setCenterCoords(coords);

          // Send location update to NestJS backend
          try {
            await ProfileApi.updateLocation(lat, lng);
            refreshUser(); // sync local auth context coords
          } catch (apiErr) {
            console.log('Error updating location on server:', apiErr);
          }
        } else {
          // permission denied — loadingLocation will be set false in finally
        }
      } catch (err) {
        console.log('Error getting user location:', err);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, [refreshUser]);

  const handleRecenter = () => {
    if (userLocation) {
      setCenterCoords({ ...userLocation });
    }
  };

  const handleSelectMarker = (item: EventItemResponse) => {
    setActiveEventId(item.id);
    if (item.coords) {
      setCenterCoords({
        latitude: item.coords.lat,
        longitude: item.coords.lng,
      });
    }
  };

  // formatTime & getDayLabel are imported from @/core/utils/locale

  // Reorder events to put the selected/active event at the top of the list
  const displayEventsList = [...events];
  if (activeEventId) {
    const activeIdx = displayEventsList.findIndex((e) => e.id === activeEventId);
    if (activeIdx > -1) {
      const [activeEvent] = displayEventsList.splice(activeIdx, 1);
      displayEventsList.unshift(activeEvent);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* MAP AREA */}
      <View style={styles.mapArea}>
        <MapLibreView
          style={StyleSheet.absoluteFill}
          centerCoords={centerCoords}
          showUserLocation={true}
          onMarkerPress={(marker) => {
            const matchedEvent = mapEvents.find((e) => e.id === marker.id);
            if (matchedEvent) {
              handleSelectMarker(matchedEvent);
            }
          }}
          markers={mapEvents.map((item) => ({
            id: item.id,
            latitude: item.coords!.lat,
            longitude: item.coords!.lng,
            color: item.sport.color,
            label: item.sport.labelFr,
          }))}
        />

        {/* Center My Location Floating Button */}
        {userLocation && (
          <TouchableOpacity
            style={[styles.floatingLocationBtn, { top: insets.top + 16 }]}
            activeOpacity={0.8}
            onPress={handleRecenter}
          >
            <Ionicons name="navigate" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        )}

        {(isLoadingEvents || loadingLocation) && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={AccentColors.bissap} />
          </View>
        )}
      </View>

      {/* BOTTOM SHEET (Panel) */}
      <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 100) }]}>
        <View style={styles.dragHandle} />

        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>
              {activeEventId ? 'Événement sélectionné' : 'Autour de toi'}
            </Text>
            {activeEventId && (
              <TouchableOpacity onPress={() => setActiveEventId(null)} style={styles.clearSelectionBtn}>
                <Text style={styles.clearSelectionText}>Afficher tout</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.sheetCount}>
            {events.length} {events.length > 1 ? 'ÉVÉNEMENTS' : 'ÉVÉNEMENT'}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {displayEventsList.map((item) => {
            const { initials: organizerInitials } = getOrganizerDisplay(item.organizer);

            return (
              <View
                key={item.id}
                style={[
                  styles.eventRowWrapper,
                  activeEventId === item.id && styles.activeEventRow,
                ]}
              >
                <ClubEventRow
                  day={getDayLabel(item.startsAt)}
                  time={formatTime(item.startsAt)}
                  title={item.title}
                  location={item.venueName || 'Dakar'}
                  participants={[organizerInitials]}
                  onPress={() => router.push(`/event/${item.id}` as any)}
                />
              </View>
            );
          })}

          {events.length === 0 && !isLoadingEvents && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={Colors.light.ink3} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Aucun événement sportif disponible.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e3da',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 10,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  customMarker: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  customMarkerActive: {
    borderColor: Colors.light.text,
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
    elevation: 6,
  },
  customMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  customMarkerLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: Colors.light.text,
  },
  floatingLocationBtn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.space12,
    paddingHorizontal: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: height * 0.45,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e3e3e1',
    alignSelf: 'center',
    marginBottom: Spacing.space24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.space16,
  },
  sheetTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
  },
  sheetCount: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    letterSpacing: 1,
  },
  clearSelectionBtn: {
    marginTop: 4,
  },
  clearSelectionText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: AccentColors.bissap,
  },
  scrollContent: {
    paddingBottom: Spacing.space20,
  },
  eventRowWrapper: {
    borderRadius: 12,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  activeEventRow: {
    backgroundColor: '#f2f2f0',
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    textAlign: 'center',
  },
  fakeRoad: {
    display: 'none',
  },
  errorText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
  },
});
