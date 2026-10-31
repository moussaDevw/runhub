import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { DAKAR_COORDINATES } from '@/constants/map';
import { EventItemResponse } from '../api/events.api';

export function useExploreMap(events: EventItemResponse[]) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapEvents = events.filter((e) => e.coords !== null && e.coords !== undefined);
  const selectedEvent = mapEvents.find((e) => e.id === selectedEventId) || null;

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted' && isMounted) {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setUserLocation(coords);
        }
      } catch (err) {
        console.log('Error getting user location in useExploreMap:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      setCenterCoords({ ...userLocation });
    } else {
      setCenterCoords({ ...DAKAR_COORDINATES });
    }
  }, [userLocation]);

  const handleSelectMarker = useCallback((markerId: string) => {
    const matched = mapEvents.find((e) => e.id === markerId);
    if (matched) {
      setSelectedEventId(matched.id);
      if (matched.coords) {
        setCenterCoords({
          latitude: matched.coords.lat,
          longitude: matched.coords.lng,
        });
      }
    }
  }, [mapEvents]);

  const handleClearSelection = useCallback(() => {
    setSelectedEventId(null);
  }, []);

  return {
    selectedEventId,
    selectedEvent,
    userLocation,
    centerCoords,
    mapEvents,
    handleRecenter,
    handleSelectMarker,
    handleClearSelection,
  };
}
