import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormInput } from '@/components/ui/form-input';
import { ImageUploadPlaceholder } from '@/components/ui/image-upload-placeholder';
import { MapLibreView } from '@/components/ui/map-libre-view';
import { Colors,  AccentColors, Radius, Spacing, Typography } from '@/constants/theme';
import { LocationApi, AutocompleteSuggestion } from '@/core/api/location.api';
import { formatDate, formatTime, isEnglish } from '@/core/utils/locale';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { useEventCreationStore } from '../store/useEventCreationStore';

const DAKAR_LOCATIONS = [
  { id: '1', name: 'Monument de la Renaissance', address: 'Monument de la Renaissance, Ouakam', coords: { lat: 14.7224, lng: -17.4898 } },
  { id: '2', name: 'Corniche Ouest', address: 'Corniche Ouest, Dakar', coords: { lat: 14.6937, lng: -17.4725 } },
  { id: '3', name: 'Plage de Yoff', address: 'Plage de Yoff, Dakar', coords: { lat: 14.7573, lng: -17.4398 } },
  { id: '4', name: 'Stade Iba Mar Diop', address: 'Stade Iba Mar Diop, Médina', coords: { lat: 14.6811, lng: -17.4475 } },
  { id: '5', name: 'Pointe des Almadies', address: 'Pointe des Almadies, Almadies', coords: { lat: 14.7454, lng: -17.5250 } },
  { id: '6', name: 'VDN (Parcours Sportif)', address: 'Parcours Sportif de la VDN, Dakar', coords: { lat: 14.7112, lng: -17.4610 } },
];

const DAKAR_DEFAULT_COORDS = {
  latitude: 14.7167,
  longitude: -17.4677,
};

export function CreationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const isEn = isEnglish();

  // Zustand Store selectors
  const title = useEventCreationStore((state) => state.title);
  const description = useEventCreationStore((state) => state.description);
  const sportId = useEventCreationStore((state) => state.sportId);
  const startsAt = useEventCreationStore((state) => state.startsAt);
  const venueName = useEventCreationStore((state) => state.venueName);
  const capacity = useEventCreationStore((state) => state.capacity);
  const price = useEventCreationStore((state) => state.price);
  const coords = useEventCreationStore((state) => state.coords);
  const updateField = useEventCreationStore((state) => state.updateField);

  // Dynamic sports from backend
  const { data: sportsList = [], isLoading: isLoadingSports } = useAllSports();

  // Local state for modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);
  const [sportSearchQuery, setSportSearchQuery] = useState('');
  const [isPaid, setIsPaid] = useState(price > 0);

  // States for Map Location Picker
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [resolvedAddressText, setResolvedAddressText] = useState('');

  // Search Autocomplete inside Map Picker
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(DAKAR_DEFAULT_COORDS);

  // Auto-fetch suggestions on searchQuery change (Debounced Google Places API call via backend proxy)
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
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
        const city = addr.city || 'Dakar';
        const formatted = `${name}, ${city}`;
        setResolvedAddressText(formatted);
        updateField('venueName', formatted);
        updateField('coords', {
          lat: coordsPressed.latitude,
          lng: coordsPressed.longitude,
        });
      } else {
        const formatted = `${coordsPressed.latitude.toFixed(4)}, ${coordsPressed.longitude.toFixed(4)}`;
        setResolvedAddressText(formatted);
        updateField('venueName', formatted);
        updateField('coords', {
          lat: coordsPressed.latitude,
          lng: coordsPressed.longitude,
        });
      }
      // Direct map tap means no place ID associated
      updateField('googlePlaceId', undefined);
      updateField('city', undefined);
      updateField('country', undefined);
    } catch (err) {
      console.log('Error reverse geocoding:', err);
      const formatted = `${coordsPressed.latitude.toFixed(4)}, ${coordsPressed.longitude.toFixed(4)}`;
      setResolvedAddressText(formatted);
      updateField('venueName', formatted);
      updateField('coords', {
        lat: coordsPressed.latitude,
        lng: coordsPressed.longitude,
      });
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

      updateField('googlePlaceId', details.placeId);
      updateField('city', details.city);
      updateField('country', details.country);
      updateField('venueName', details.formattedAddress);
      updateField('coords', {
        lat: details.latitude,
        lng: details.longitude,
      });
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

  const handleClearLocation = () => {
    updateField('venueName', '');
    updateField('coords', undefined);
    updateField('googlePlaceId', undefined);
    updateField('city', undefined);
    updateField('country', undefined);
    setSelectedCoords(null);
    setResolvedAddressText('');
    setCenterCoords(null);
    setShowLocationModal(false);
  };

  const handleValidateLocation = () => {
    if (selectedCoords && resolvedAddressText) {
      setShowLocationModal(false);
    }
  };



  const selectedSport = sportsList.find((s) => s.id === sportId);

  // formatDate & formatTime are imported from @/core/utils/locale

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePickerModal(false);
    }
    if (selectedDate) {
      const newDate = new Date(startsAt);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      updateField('startsAt', newDate.toISOString());
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePickerModal(false);
    }
    if (selectedTime) {
      const newDate = new Date(startsAt);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      updateField('startsAt', newDate.toISOString());
    }
  };



  const handleSelectModalSport = (id: string) => {
    updateField('sportId', id);
    setShowSportModal(false);
  };

  // Filter full list of sports for modal search
  const filteredModalSports = sportsList.filter((s) =>
    s.labelFr.toLowerCase().includes(sportSearchQuery.toLowerCase())
  );

  // Validation checking
  const isFormValid =
    title.trim().length > 0 &&
    sportId.trim().length > 0 &&
    venueName.trim().length > 0 &&
    new Date(startsAt).getTime() > Date.now() &&
    (!isPaid || (price > 0));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nouvel event</Text>

        <Text style={styles.stepText}>1/2</Text>
      </View>

      {isLoadingSports ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
          showsVerticalScrollIndicator={false}
        >
          <ImageUploadPlaceholder badgeText="Sunset Run Dakar" />

          <FormInput
            label="TITRE"
            placeholder="Ex: Sunset Run"
            value={title}
            onChangeText={(val) => updateField('title', val)}
          />

          <FormInput
            label="DESCRIPTION"
            placeholder="Décrivez l'événement..."
            value={description}
            onChangeText={(val) => updateField('description', val)}
            multiline
          />

          <Text style={[styles.label, { marginTop: Spacing.space16 }]}>SPORT</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSportSearchQuery('');
              setShowSportModal(true);
            }}
            style={styles.sportDropdownTrigger}
          >
            {selectedSport ? (
              <View style={styles.selectedSportContainer}>
                <View style={[styles.sportDot, { backgroundColor: selectedSport.color }]} />
                <Text style={styles.selectedSportText}>{selectedSport.labelFr}</Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>Sélectionner un sport...</Text>
            )}
            <Ionicons name="chevron-down" size={20} color={Colors.light.ink3} />
          </TouchableOpacity>

          <Text style={styles.label}>{isEn ? 'WHEN' : 'QUAND'}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDatePickerModal(true)}
              style={styles.datePickerTrigger}
            >
              <Text style={styles.datePickerText}>{formatDate(startsAt) || 'Date'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowTimePickerModal(true)}
              style={styles.timePickerTrigger}
            >
              <Text style={styles.datePickerText}>{formatTime(startsAt) || (isEn ? 'Time' : 'Heure')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: Spacing.space24 }} />

          <View style={styles.labelRow}>
            <Text style={styles.label}>Lieu de départ</Text>
            <Text style={styles.rightLabel}>Obligatoire</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowLocationModal(true)}
            style={[styles.locationSelectorField, venueName ? styles.locationSelectorFieldSelected : null]}
          >
            <View style={{ flex: 1, marginRight: 8, justifyContent: 'center' }}>
              {venueName ? (
                <>
                  <Text style={styles.locationSelectorText} numberOfLines={1}>
                    {venueName.includes(',') ? venueName.substring(0, venueName.indexOf(',')) : venueName}
                  </Text>
                  <Text style={styles.locationSelectorSubtext} numberOfLines={1}>
                    {venueName.includes(',') ? venueName.substring(venueName.indexOf(',') + 1).trim() : ''}
                  </Text>
                </>
              ) : (
                <Text style={styles.locationSelectorPlaceholder}>Choisir un lieu</Text>
              )}
            </View>
            <Ionicons name="search" size={18} color={Colors.light.ink3} />
          </TouchableOpacity>

          <Text style={styles.label}>TARIF</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsPaid(false);
                updateField('price', 0);
              }}
              style={[styles.toggleButton, !isPaid && styles.toggleButtonActive]}
            >
              <Text style={[styles.toggleButtonText, !isPaid && styles.toggleButtonTextActive]}>Gratuit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsPaid(true);
                updateField('price', 2000); // Default to a standard price
              }}
              style={[styles.toggleButton, isPaid && styles.toggleButtonActive]}
            >
              <Text style={[styles.toggleButtonText, isPaid && styles.toggleButtonTextActive]}>Payant</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <FormInput
              label="PLACES"
              placeholder="Illimité"
              value={capacity ? capacity.toString() : ''}
              onChangeText={(val) => updateField('capacity', val ? parseInt(val, 10) : undefined)}
              rightSuffix="MAX"
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            {isPaid && (
              <FormInput
                label="PRIX (FCFA)"
                placeholder="Ex: 2000"
                value={price ? price.toString() : ''}
                onChangeText={(val) => updateField('price', val ? parseInt(val, 10) : 0)}
                keyboardType="numeric"
                containerStyle={{ flex: 1, marginLeft: Spacing.space12 }}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* BOTTOM BUTTON */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
          activeOpacity={0.8}
          disabled={!isFormValid}
          onPress={() => router.push('/apercu')}
        >
          <Text style={styles.primaryButtonText}>Aperçu & publier</Text>
        </TouchableOpacity>
      </View>

      {/* LOCATION PICKER MODAL */}
      <Modal visible={showLocationModal} animationType="slide" transparent={false}>
        <View style={styles.fullscreenModalContainer}>
          {/* Modal Header */}
          <View style={[styles.mapHeaderBar, { paddingTop: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={handleClearLocation} style={styles.mapHeaderAction}>
              <Text style={styles.mapHeaderActionCancel}>Effacer</Text>
            </TouchableOpacity>
            <Text style={styles.mapHeaderTitle}>Lieu</Text>
            <TouchableOpacity
              onPress={handleValidateLocation}
              disabled={!selectedCoords}
              style={[styles.mapHeaderAction, !selectedCoords && { opacity: 0.4 }]}
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
              markers={selectedCoords ? [{
                id: 'selected-point',
                latitude: selectedCoords.latitude,
                longitude: selectedCoords.longitude,
                label: 'Point sélectionné'
              }] : []}
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
              <Text style={[styles.bottomSearchTriggerText, !resolvedAddressText && styles.bottomSearchTriggerPlaceholder]} numberOfLines={1}>
                {resolvedAddressText || "Choisir un lieu"}
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

      {/* ALL SPORTS PICKER MODAL */}
      <Modal visible={showSportModal} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir un sport</Text>
              <TouchableOpacity onPress={() => setShowSportModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            {/* Search Input inside Modal */}
            <View style={styles.modalSearchContainer}>
              <Ionicons name="search-outline" size={20} color={Colors.light.ink3} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Rechercher un sport..."
                value={sportSearchQuery}
                onChangeText={setSportSearchQuery}
                placeholderTextColor={Colors.light.ink3}
              />
              {sportSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSportSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={Colors.light.ink3} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredModalSports}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectModalSport(item.id)}
                  style={styles.locationItem}
                >
                  <View style={[styles.sportModalDot, { backgroundColor: item.color }]} />
                  <Text style={styles.locationName}>{item.labelFr}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.modalEmptyState}>
                  <Ionicons name="search-outline" size={40} color={Colors.light.ink3} style={{ marginBottom: Spacing.space12 }} />
                  <Text style={styles.modalEmptyTitle}>Aucun sport trouvé</Text>
                  <Text style={styles.modalEmptySubtitle}>Essayez de rechercher un autre mot-clé ou vérifiez l'orthographe.</Text>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* DATE PICKER (iOS only in modal) */}
      {Platform.OS === 'ios' && (
        <Modal visible={showDatePickerModal} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCompact}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isEn ? 'Choose a date' : 'Choisir une date'}</Text>
                <TouchableOpacity onPress={() => setShowDatePickerModal(false)}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={new Date(startsAt)}
                mode="date"
                display="inline"
                minimumDate={new Date()}
                accentColor={AccentColors.bissap}
                themeVariant="light"
                textColor={Colors.light.text}
                onChange={handleDateChange}
              />
              <View style={{ marginTop: Spacing.space16 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDatePickerModal(false)}
                  style={[styles.primaryButton, { width: '100%' }]}
                >
                  <Text style={styles.primaryButtonText}>{isEn ? 'Confirm Date' : 'Confirmer la date'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* TIME PICKER (iOS only in modal) */}
      {Platform.OS === 'ios' && (
        <Modal visible={showTimePickerModal} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentCompact}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isEn ? 'Choose time' : "Choisir l'heure"}</Text>
                <TouchableOpacity onPress={() => setShowTimePickerModal(false)}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={new Date(startsAt)}
                mode="time"
                display="spinner"
                accentColor={AccentColors.bissap}
                themeVariant="light"
                textColor={Colors.light.text}
                onChange={handleTimeChange}
              />
              <View style={{ marginTop: Spacing.space16 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowTimePickerModal(false)}
                  style={[styles.primaryButton, { width: '100%' }]}
                >
                  <Text style={styles.primaryButtonText}>{isEn ? 'Confirm Time' : "Confirmer l'heure"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Native Dialogs */}
      {Platform.OS === 'android' && showDatePickerModal && (
        <DateTimePicker
          value={new Date(startsAt)}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === 'android' && showTimePickerModal && (
        <DateTimePicker
          value={new Date(startsAt)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
    backgroundColor: '#ffffff',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  stepText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  scrollContent: {
    padding: Spacing.space20,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  datePickerTrigger: {
    flex: 1.5,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    justifyContent: 'center',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  timePickerTrigger: {
    flex: 1,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    justifyContent: 'center',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  datePickerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  label: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space8,
    marginLeft: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space8,
    marginLeft: 4,
  },
  rightLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: '#65625e',
  },
  sportDropdownTrigger: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    marginBottom: Spacing.space24,
  },
  selectedSportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSportText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  dropdownPlaceholder: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.ink3,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: Radius.btn,
    padding: 4,
    marginBottom: Spacing.space24,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  toggleButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.btn - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.text,
  },
  toggleButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#65625e',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    backgroundColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: Colors.light.ink3,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.space20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '70%',
    padding: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalContentCompact: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '70%',
    padding: Spacing.space20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  modalTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
    borderRadius: Radius.btn,
    paddingHorizontal: Spacing.space12,
    height: 48,
    marginBottom: Spacing.space16,
  },
  modalSearchInput: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
  },
  sportModalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  locationName: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  locationAddress: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    marginTop: 2,
  },
  pickerItem: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
  },
  pickerItemText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  modalEmptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: Spacing.space24,
  },
  modalEmptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
  },
  modalEmptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    textAlign: 'center',
    lineHeight: 18,
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalMapWrapper: {
    flex: 1,
    backgroundColor: '#e6e3da',
  },
  modalBottomPanel: {
    padding: Spacing.space20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f0',
  },
  modalAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
    borderRadius: 12,
    padding: Spacing.space12,
    marginBottom: Spacing.space16,
  },
  modalAddressText: {
    flex: 1,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  modalAddressPlaceholder: {
    flex: 1,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
    textAlign: 'center',
  },
  locationSelectorField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: Spacing.space16,
    height: 52,
    marginBottom: Spacing.space24,
  },
  locationSelectorText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  locationSelectorPlaceholder: {
    color: Colors.light.ink3,
    fontFamily: Typography.corps.fontFamily,
  },
  locationSelectorFieldSelected: {
    height: 64,
  },
  locationSelectorSubtext: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  mapHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.space20,
    paddingVertical: 14,
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
  // Dark Search Overlay
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
  // Calendar Styles
  calendarContainer: {
    padding: Spacing.space12,
    backgroundColor: '#ffffff',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.space16,
    paddingHorizontal: Spacing.space8,
  },
  monthNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.space8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f0',
    paddingBottom: Spacing.space8,
  },
  weekdayText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    width: 36,
    textAlign: 'center',
  },
  daysGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space4,
    borderRadius: 20,
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 40,
  },
  dayCellSelected: {
    backgroundColor: AccentColors.bissap,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: AccentColors.bissap,
  },
  dayText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  dayTextSelected: {
    color: '#ffffff',
  },
  dayTextPast: {
    color: '#d1cfc9',
  },
});
