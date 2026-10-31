import { Colors, AccentColors } from '@/constants/theme';
import { Camera, CameraRef, Map, Marker, UserLocation, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';

import { DAKAR_CENTER_LNG_LAT, OSM_RASTER_STYLE } from '@/constants/map';

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
  routeCoordinates?: { latitude: number; longitude: number }[];
  routeColor?: string;
  followRoute?: boolean;
  onMapPress?: (coords: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  showUserLocation?: boolean;
  zoomLevel?: number;
  style?: StyleProp<ViewStyle>;
}

export const MapLibreView: React.FC<MapLibreViewProps> = ({
  markers = [],
  centerCoords,
  routeCoordinates,
  routeColor = AccentColors.bissap,
  followRoute = false,
  onMapPress,
  onMarkerPress,
  showUserLocation = true,
  zoomLevel = 13,
  style,
}) => {
  const cameraRef = useRef<CameraRef>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // GeoJSON LineString for live polyline / route
  const routeGeoJSON = React.useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: routeCoordinates.map((c) => [c.longitude, c.latitude]),
      },
    };
  }, [routeCoordinates]);

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

  const [hasLayout, setHasLayout] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Center camera when coordinates change (only after layout is complete to avoid fitBounds layout errors)
  useEffect(() => {
    if (!hasLayout || !cameraRef.current) return;

    try {
      if (followRoute && routeCoordinates && routeCoordinates.length > 0) {
        const last = routeCoordinates[routeCoordinates.length - 1];
        cameraRef.current.easeTo({
          center: [last.longitude, last.latitude],
          zoom: Math.max(zoomLevel, 15),
          duration: 600,
        });
        return;
      }

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

          const latDelta = Math.abs(maxLat - minLat);
          const lngDelta = Math.abs(maxLng - minLng);

          // If markers are essentially in the same spot, just center on them
          if (latDelta < 0.005 && lngDelta < 0.005) {
            cameraRef.current.easeTo({
              center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
              zoom: zoomLevel,
              duration: 1000,
            });
          } else {
            // Calculate safe padding based on view dimensions
            const safePadH = Math.min(30, Math.floor(dimensions.width * 0.1));
            const safePadV = Math.min(30, Math.floor(dimensions.height * 0.1));

            cameraRef.current.fitBounds(
              [minLng, minLat, maxLng, maxLat],
              {
                padding: { top: safePadV, bottom: safePadV, left: safePadH, right: safePadH },
                duration: 1000,
              }
            );
          }
        }
      } else if (routeCoordinates && routeCoordinates.length > 1) {
        // Fit camera to the full route if not actively following
        const lats = routeCoordinates.map((c) => c.latitude);
        const lngs = routeCoordinates.map((c) => c.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const safePadH = Math.min(40, Math.floor(dimensions.width * 0.12));
        const safePadV = Math.min(40, Math.floor(dimensions.height * 0.12));

        cameraRef.current.fitBounds(
          [minLng, minLat, maxLng, maxLat],
          {
            padding: { top: safePadV, bottom: safePadV, left: safePadH, right: safePadH },
            duration: 800,
          }
        );
      } else if (userLocation) {
        cameraRef.current.easeTo({
          center: userLocation,
          zoom: zoomLevel,
          duration: 1000,
        });
      }
    } catch (err) {
      console.warn('Map camera update warning:', err);
    }
  }, [centerCoords, markers, userLocation, routeCoordinates, followRoute, hasLayout, zoomLevel, dimensions]);

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
      : DAKAR_CENTER_LNG_LAT;

  return (
    <View style={[styles.container, style]}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle={OSM_RASTER_STYLE}
        onPress={handlePress}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 20 && height > 20) {
            setDimensions({ width, height });
            setHasLayout(true);
          }
        }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: initialCenter,
            zoom: zoomLevel,
          }}
        />

        {showUserLocation && <UserLocation />}

        {/* Live Route Polyline */}
        {routeGeoJSON && (
          <GeoJSONSource id="tracker-route-source" data={routeGeoJSON}>
            <Layer
              id="tracker-route-line-casing"
              type="line"
              style={{
                lineColor: '#ffffff',
                lineWidth: 7,
                lineCap: 'round',
                lineJoin: 'round',
                lineOpacity: 0.9,
              }}
            />
            <Layer
              id="tracker-route-line"
              type="line"
              style={{
                lineColor: routeColor,
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </GeoJSONSource>
        )}

        {/* Start Pin when route exists */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Marker
            id="tracker-start-pin"
            lngLat={[routeCoordinates[0].longitude, routeCoordinates[0].latitude]}
          >
            <View style={styles.startDot}>
              <View style={styles.startDotInner} />
            </View>
          </Marker>
        )}

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
  startDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  startDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981', // green start indicator
  },
});
