import { Colors } from '@/constants/theme';
import { Camera, CameraRef, Map, Marker, UserLocation } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

// OpenStreetMap style configuration
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster' as const,
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// Dakar coordinates fallback
const DAKAR_CENTER: [number, number] = [-17.4677, 14.7167]; // [lng, lat]

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
  label?: string;
}

interface MapLibreViewProps {
  markers?: MapMarker[];
  centerCoords?: { latitude: number; longitude: number } | null;
  onMapPress?: (coords: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  showUserLocation?: boolean;
  zoomLevel?: number;
  style?: StyleProp<ViewStyle>;
}

export const MapLibreView: React.FC<MapLibreViewProps> = ({
  markers = [],
  centerCoords,
  onMapPress,
  onMarkerPress,
  showUserLocation = true,
  zoomLevel = 13,
  style,
}) => {
  const cameraRef = useRef<CameraRef>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Request coordinates on load to get user position for camera centering
  useEffect(() => {
    if (showUserLocation) {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            setUserLocation([loc.coords.longitude, loc.coords.latitude]);
          }
        } catch (e) {
          console.warn('Could not retrieve location for MapLibre:', e);
        }
      })();
    }
  }, [showUserLocation]);

  // Center camera when coordinates change
  useEffect(() => {
    if (cameraRef.current) {
      if (centerCoords) {
        cameraRef.current.easeTo({
          center: [centerCoords.longitude, centerCoords.latitude],
          zoom: zoomLevel,
          duration: 1000,
        });
      } else if (markers.length > 0) {
        if (markers.length === 1) {
          cameraRef.current.easeTo({
            center: [markers[0].longitude, markers[0].latitude],
            zoom: zoomLevel,
            duration: 1000,
          });
        } else {
          // Calculate bounds
          const lats = markers.map((m) => m.latitude);
          const lngs = markers.map((m) => m.longitude);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);

          cameraRef.current.fitBounds(
            [minLng, minLat, maxLng, maxLat],
            {
              padding: { top: 50, bottom: 50, left: 50, right: 50 },
              duration: 1000,
            }
          );
        }
      } else if (userLocation) {
        cameraRef.current.easeTo({
          center: userLocation,
          zoom: zoomLevel,
          duration: 1000,
        });
      }
    }
  }, [centerCoords, markers, userLocation]);

  const handlePress = (e: any) => {
    if (onMapPress && e.geometry?.coordinates) {
      const [lng, lat] = e.geometry.coordinates;
      onMapPress({ latitude: lat, longitude: lng });
    }
  };

  const handleRecenter = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
        setUserLocation(coords);
        if (cameraRef.current) {
          cameraRef.current.easeTo({
            center: coords,
            zoom: 15,
            duration: 800,
          });
        }
      }
    } catch (e) {
      console.log('Error requesting location:', e);
    } finally {
      setLoadingLocation(false);
    }
  };

  const initialCenter: [number, number] = centerCoords
    ? [centerCoords.longitude, centerCoords.latitude]
    : markers.length > 0
      ? [markers[0].longitude, markers[0].latitude]
      : DAKAR_CENTER;

  return (
    <View style={[styles.container, style]}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle={OSM_STYLE}
        onPress={handlePress}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: initialCenter,
            zoom: zoomLevel,
          }}
        />

        {showUserLocation && <UserLocation />}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            id={marker.id}
            lngLat={[marker.longitude, marker.latitude]}
            onPress={() => onMarkerPress?.(marker)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerDot, { backgroundColor: marker.color || '#f2784f' }]} />
              {marker.label && (
                <View style={styles.markerBubble}>
                  <Text style={styles.markerText} numberOfLines={1}>
                    {marker.label}
                  </Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </Map>

      {/* Recenter Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleRecenter}
        style={styles.recenterBtn}
      >
        {loadingLocation ? (
          <ActivityIndicator size="small" color={Colors.light.text} />
        ) : (
          <Text style={styles.recenterIcon}>🎯</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f2f2f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 10,
    color: Colors.light.text,
    fontWeight: '600',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  recenterIcon: {
    fontSize: 20,
  },
});
