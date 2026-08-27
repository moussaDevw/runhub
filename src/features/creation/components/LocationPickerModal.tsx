import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { MapLibreView } from '@/components/ui/map-libre-view';
import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';
import { LocationApi, AutocompleteSuggestion } from '@/core/api/location.api';

const DAKAR_DEFAULT_COORDS = {
  latitude: 14.7167,
  longitude: -17.4677,
};

interface LocationPickerModalProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSelectLocation: (
    venueName: string,
    coords: { lat: number; lng: number } | undefined,
    googlePlaceId?: string,
    city?: string,
    country?: string
  ) => void;
  initialVenueName?: string;
  initialCoords?: { lat: number; lng: number };
}

export function LocationPickerModal({
  isVisible,
  onDismiss,
  onSelectLocation,
  initialVenueName = '',
  initialCoords,
}: LocationPickerModalProps) {
  const insets = useSafeAreaInsets();

  // Local state for picked location
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(
    initialCoords ? { latitude: initialCoords.lat, longitude: initialCoords.lng } : null
  );
  const [resolvedAddressText, setResolvedAddressText] = useState(initialVenueName);
  const [resolvingAddress, setResolvingAddress] = useState(false);

  // Map controls
  const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(
    initialCoords ? { latitude: initialCoords.lat, longitude: initialCoords.lng } : DAKAR_DEFAULT_COORDS
  );

  // Search Autocomplete State
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Place metadata resolved via suggestion
  const [googlePlaceId, setGooglePlaceId] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [country, setCountry] = useState<string | undefined>();

  // Reset/sync local state when modal opens
  useEffect(() => {
    if (isVisible) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSelectedCoords(initialCoords ? { latitude: initialCoords.lat, longitude: initialCoords.lng } : null);
      setResolvedAddressText(initialVenueName);
      setCenterCoords(initialCoords ? { latitude: initialCoords.lat, longitude: initialCoords.lng } : DAKAR_DEFAULT_COORDS);
      setGooglePlaceId(undefined);
      setCity(undefined);
      setCountry(undefined);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isVisible, initialCoords, initialVenueName]);

  // Debounced Place Autocomplete suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- early-return guard for debounce
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const data = await LocationApi.autocomplete(searchQuery);
        setSuggestions(data);
      } catch (err) {
        console.log('Error fetching search results from backend:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleMapPress = async (coordsPressed: { latitude: number; longitude: number }) => {
    setSelectedCoords(coordsPressed);
    setResolvingAddress(true);
    try {
      const addressResult = await Location.reverseGeocodeAsync({
        latitude: coordsPressed.latitude,
        longitude: coordsPressed.longitude,
      });

      if (addressResult && addressResult.length > 0) {
        const addr = addressResult[0];
        const name = addr.name || addr.street || addr.district || 'Lieu sélectionné';
        const cityName = addr.city || 'Dakar';
        const formatted = `${name}, ${cityName}`;
        setResolvedAddressText(formatted);
      } else {
        const formatted = `${coordsPressed.latitude.toFixed(4)}, ${coordsPressed.longitude.toFixed(4)}`;
        setResolvedAddressText(formatted);
      }
      // Reset place metadata since it's a raw map press
      setGooglePlaceId(undefined);
      setCity(undefined);
      setCountry(undefined);
    } catch (err) {
      console.log('Error reverse geocoding:', err);
      const formatted = `${coordsPressed.latitude.toFixed(4)}, ${coordsPressed.longitude.toFixed(4)}`;
      setResolvedAddressText(formatted);
    } finally {
      setResolvingAddress(false);
    }
  };

  const handleSelectSuggestion = async (item: AutocompleteSuggestion) => {
    setResolvingAddress(true);
    setShowSearchOverlay(false);
    try {
      const details = await LocationApi.getDetails(item.placeId);
      const targetCoords = { latitude: details.latitude, longitude: details.longitude };

      setSelectedCoords(targetCoords);
      setResolvedAddressText(details.formattedAddress);
      setCenterCoords(targetCoords);

      setGooglePlaceId(details.placeId);
      setCity(details.city);
      setCountry(details.country);
    } catch (err) {
      console.log('Error fetching Google Places details:', err);
    } finally {
      setResolvingAddress(false);
      setSearchQuery('');
    }
  };

  const handleRecenterPicker = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        setCenterCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
    } catch (e) {
      console.log('Error getting current location for picker:', e);
    }
  };

  const handleClear = () => {
    setSelectedCoords(null);
    setResolvedAddressText('');
    setGooglePlaceId(undefined);
    setCity(undefined);
    setCountry(undefined);
    onSelectLocation('', undefined);
    onDismiss();
  };

  const handleConfirm = () => {
    if (selectedCoords && resolvedAddressText) {
      onSelectLocation(
        resolvedAddressText,
        { lat: selectedCoords.latitude, lng: selectedCoords.longitude },
        googlePlaceId,
        city,
        country
      );
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View style={styles.fullscreenModalContainer}>
        {/* Modal Header */}
        <View style={[styles.mapHeaderBar, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={handleClear} style={styles.mapHeaderAction}>
            <Text style={styles.mapHeaderActionCancel}>Effacer</Text>
          </TouchableOpacity>
          <Text style={styles.mapHeaderTitle}>Lieu</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selectedCoords || resolvingAddress}
            style={[styles.mapHeaderAction, (!selectedCoords || resolvingAddress) && { opacity: 0.4 }]}
          >
            <Text style={styles.mapHeaderActionOk}>OK</Text>
          </TouchableOpacity>
        </View>

        {/* Map View Area */}
        <View style={styles.modalMapWrapper}>
          <MapLibreView
            style={StyleSheet.absoluteFill}
            centerCoords={centerCoords}
            onMapPress={handleMapPress}
            markers={
              selectedCoords
                ? [
                    {
                      id: 'selected-point',
                      latitude: selectedCoords.latitude,
                      longitude: selectedCoords.longitude,
                      label: 'Point sélectionné',
                    },
                  ]
                : []
            }
            showUserLocation={true}
          />

          {/* GPS Floating Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRecenterPicker}
            style={styles.floatingCenterBtn}
          >
            <Ionicons name="locate" size={24} color={Colors.light.text} />
          </TouchableOpacity>

          {/* Bottom Search Bar Trigger */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSearchQuery('');
              setShowSearchOverlay(true);
            }}
            style={[styles.bottomSearchTrigger, { bottom: Math.max(insets.bottom, 24) }]}
          >
            <Text
              style={[
                styles.bottomSearchTriggerText,
                !resolvedAddressText && styles.bottomSearchTriggerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {resolvedAddressText || 'Choisir un lieu'}
            </Text>
            <Ionicons name="search" size={18} color={Colors.light.ink3} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH OVERLAY MODAL */}
      <Modal visible={showSearchOverlay} animationType="fade" transparent={false}>
        <View style={[styles.searchOverlayContainer, { paddingTop: Math.max(insets.top, 16) }]}>
          {/* Search Input Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={18} color="#8e8e93" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Choisir un lieu"
                placeholderTextColor="#8e8e93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#8e8e93" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setShowSearchOverlay(false)}>
              <Text style={styles.cancelSearchBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>

          {/* Suggestions list */}
          {loadingSuggestions ? (
            <View style={styles.suggestionsLoader}>
              <ActivityIndicator size="small" color="#f2784f" />
            </View>
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.placeId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectSuggestion(item)}
                  style={styles.suggestionItem}
                >
                  <View style={styles.suggestionIconWrapper}>
                    <Ionicons name="location-sharp" size={22} color="#f2784f" />
                  </View>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitle} numberOfLines={1}>
                      {item.mainText}
                    </Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                      {item.secondaryText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length >= 3 && !loadingSuggestions ? (
                  <View style={styles.emptySuggestionsContainer}>
                    <Text style={styles.emptySuggestionsText}>Aucun lieu trouvé à Dakar.</Text>
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mapHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.space20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
    backgroundColor: '#ffffff',
  },
  mapHeaderAction: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  mapHeaderActionCancel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
  },
  mapHeaderActionOk: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: AccentColors.bissap,
  },
  mapHeaderTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  modalMapWrapper: {
    flex: 1,
    backgroundColor: '#e6e3da',
  },
  floatingCenterBtn: {
    position: 'absolute',
    bottom: 96,
    right: 16,
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
  bottomSearchTrigger: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: Spacing.space16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  bottomSearchTriggerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  bottomSearchTriggerPlaceholder: {
    color: Colors.light.ink3,
  },
  searchOverlayContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: '#ffffff',
    marginLeft: 8,
    paddingVertical: 0,
  },
  cancelSearchBtnText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#f2784f',
    marginLeft: 12,
  },
  suggestionsLoader: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  suggestionIconWrapper: {
    marginRight: 14,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#8e8e93',
  },
  emptySuggestionsContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptySuggestionsText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#8e8e93',
  },
});
