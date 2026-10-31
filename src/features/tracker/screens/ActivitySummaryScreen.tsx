import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MapLibreView } from '@/components/ui/map-libre-view';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { useTrackerStore } from '../stores/useTrackerStore';
import { TrackerMetricsService } from '../services/tracker-metrics.service';
import { PolylineService } from '../services/polyline.service';
import { TrackerApiService } from '../services/tracker-api.service';
import { SPORT_OPTIONS } from '../components/SportSelector';

export function ActivitySummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const mapHeight = Math.min(Math.max(Math.round(height * 0.22), 160), 220);

  const {
    sport,
    startedAt,
    endedAt,
    elapsedSeconds,
    distanceMeters,
    elevationGainMeters,
    coordinates,
    getDistanceKm,
    getAvgPaceSecPerKm,
    getCaloriesBurned,
    resetTracking,
  } = useTrackerStore();

  const distanceKm = getDistanceKm();
  const avgPace = getAvgPaceSecPerKm();
  const caloriesBurned = getCaloriesBurned();
  const sportMeta = SPORT_OPTIONS.find((s) => s.key === sport) || SPORT_OPTIONS[0];

  // Default title based on time of day
  const getDefaultTitle = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'de la journée';
    if (hour >= 5 && hour < 12) timeOfDay = 'matinale';
    else if (hour >= 12 && hour < 18) timeOfDay = "de l'après-midi";
    else if (hour >= 18 || hour < 5) timeOfDay = 'du soir';

    return `${sportMeta.labelFr} ${timeOfDay}`;
  };

  const [title, setTitle] = useState(getDefaultTitle());
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'FOLLOWERS' | 'PRIVATE'>('PUBLIC');
  const [syncHealth, setSyncHealth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour votre séance.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Encode route coordinates into polyline
      const encodedPolyline =
        coordinates.length > 0
          ? PolylineService.encode(
              coordinates.map((c) => ({
                latitude: c.latitude,
                longitude: c.longitude,
              }))
            )
          : undefined;

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        sport,
        startedAt: startedAt || new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        endedAt: endedAt || new Date().toISOString(),
        durationSeconds: Math.max(elapsedSeconds, 1),
        distanceMeters: Math.round(distanceMeters),
        distanceKm,
        avgPaceSecPerKm: avgPace || undefined,
        caloriesBurned,
        elevationGainMeters: elevationGainMeters || undefined,
        polyline: encodedPolyline,
        visibility,
        source: 'IN_APP_TRACKER' as const,
      };

      await TrackerApiService.saveActivity(payload);

      Alert.alert('Félicitations ! 🏃💨', 'Votre séance a été enregistrée avec succès.', [
        {
          text: 'Super !',
          onPress: () => {
            resetTracking();
            router.replace('/(tabs)/courir' as any);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Failed to save activity:', error);
      Alert.alert(
        'Erreur de sauvegarde',
        error?.message || "Impossible d'enregistrer la séance sur le serveur. Réessayez."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Supprimer la séance ?',
      'Cette action est irréversible. Les données de la séance seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            resetTracking();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDiscard}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Récapitulatif de séance</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.responsiveContainer}>
            {/* Map Preview */}
            <View style={[styles.mapContainer, { height: mapHeight }]}>
              <MapLibreView
                style={StyleSheet.absoluteFill}
                routeCoordinates={coordinates}
                routeColor={sportMeta.color}
                showUserLocation={false}
                zoomLevel={14}
              />
              <View style={styles.sportBadge}>
                <MaterialCommunityIcons
                  name={sportMeta.icon as any}
                  size={16}
                  color={sportMeta.color}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.sportBadgeText, { color: sportMeta.color }]}>
                  {sportMeta.labelFr}
                </Text>
              </View>
            </View>

            {/* Metrics Grid */}
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
                    {distanceKm.toFixed(2)}
                  </Text>
                  <Text style={styles.statUnit}>km</Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
                    {TrackerMetricsService.formatDuration(elapsedSeconds)}
                  </Text>
                  <Text style={styles.statUnit}>h:m:s</Text>
                  <Text style={styles.statLabel}>Durée</Text>
                </View>
              </View>

              <View style={styles.statHorizontalDivider} />

              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
                    {TrackerMetricsService.formatPace(avgPace)}
                  </Text>
                  <Text style={styles.statUnit}>/km</Text>
                  <Text style={styles.statLabel}>Allure moy.</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
                    {caloriesBurned}
                  </Text>
                  <Text style={styles.statUnit}>kcal</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>

                {elevationGainMeters > 0 && (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
                        +{Math.round(elevationGainMeters)}
                      </Text>
                      <Text style={styles.statUnit}>m</Text>
                      <Text style={styles.statLabel}>Dénivelé</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Form: Title & Notes */}
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Titre de la sortie</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Sortie matinale sur la Corniche"
                placeholderTextColor={Colors.light.ink3}
                maxLength={100}
              />

              <Text style={[styles.inputLabel, { marginTop: Spacing.space16 }]}>
                Notes & sensations (optionnel)
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Comment s'est passée votre séance ? Sensations, météo, etc."
                placeholderTextColor={Colors.light.ink3}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            {/* Visibility Options */}
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Visibilité de l'activité</Text>
              <View style={styles.visibilityContainer}>
                {(
                  [
                    { key: 'PUBLIC', label: 'Public', icon: 'earth' },
                    { key: 'FOLLOWERS', label: 'Abonnés', icon: 'people' },
                    { key: 'PRIVATE', label: 'Privé', icon: 'lock-closed' },
                  ] as const
                ).map((v) => {
                  const isSelected = visibility === v.key;
                  return (
                    <TouchableOpacity
                      key={v.key}
                      activeOpacity={0.8}
                      onPress={() => setVisibility(v.key)}
                      style={[
                        styles.visibilityOption,
                        isSelected && styles.visibilityOptionSelected,
                      ]}
                    >
                      <Ionicons
                        name={v.icon as any}
                        size={15}
                        color={isSelected ? '#ffffff' : Colors.light.textSecondary}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[
                          styles.visibilityLabel,
                          isSelected && styles.visibilityLabelSelected,
                        ]}
                      >
                        {v.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Apple Health / Health Connect Sync */}
            <View style={styles.healthSyncCard}>
              <View style={styles.healthIconWrapper}>
                <Ionicons name="heart" size={20} color="#e11d48" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.healthTitle}>Synchronisation Santé</Text>
                <Text style={styles.healthSubtitle}>
                  Partager avec Apple Santé ou Santé Connect
                </Text>
              </View>
              <Switch
                value={syncHealth}
                onValueChange={setSyncHealth}
                trackColor={{ false: '#e2e8f0', true: AccentColors.bissap }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={isSubmitting}
                style={styles.saveButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.saveButtonText}>Enregistrer l'activité</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleDiscard}
                style={styles.discardButton}
              >
                <Text style={styles.discardButtonText}>Supprimer cette séance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf9f5', // Ivoire light theme background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0ed',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundElement,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  scrollContent: {
    padding: Spacing.space16,
  },
  responsiveContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    gap: Spacing.space16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ecece9',
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  sportBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sportBadgeText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#ecece9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 26,
    lineHeight: 30,
    color: Colors.light.text,
  },
  statUnit: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    marginTop: -2,
  },
  statLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#f0f0ed',
  },
  statHorizontalDivider: {
    height: 1,
    backgroundColor: '#f0f0ed',
    marginVertical: Spacing.space12,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  inputLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: '#e8e8e4',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  visibilityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: '#e8e8e4',
  },
  visibilityOptionSelected: {
    backgroundColor: Colors.light.text,
    borderColor: Colors.light.text,
  },
  visibilityLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  visibilityLabelSelected: {
    color: '#ffffff',
  },
  healthSyncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  healthIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  healthSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  actionsContainer: {
    marginTop: Spacing.space8,
    gap: Spacing.space12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: '#ffffff',
  },
  discardButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  discardButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ef4444',
  },
});
