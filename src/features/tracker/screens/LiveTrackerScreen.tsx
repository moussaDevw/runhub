import { MapLibreView } from '@/components/ui/map-libre-view';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPORT_OPTIONS, SportSelector } from '../components/SportSelector';
import { TrackerControls } from '../components/TrackerControls';
import { TrackerHUD } from '../components/TrackerHUD';
import { useLiveTracker } from '../hooks/useLiveTracker';

export function LiveTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    sport,
    status,
    elapsedSeconds,
    distanceKm,
    avgPaceSecPerKm,
    caloriesBurned,
    elevationGainMeters,
    coordinates,
    setSport,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useLiveTracker();

  const currentSportOption = SPORT_OPTIONS.find((s) => s.key === sport) || SPORT_OPTIONS[0];

  const handleBack = () => {
    if (status === 'running' || status === 'paused') {
      Alert.alert(
        'Abandonner la séance ?',
        'Votre progression en cours ne sera pas enregistrée.',
        [
          { text: 'Continuer la séance', style: 'cancel' },
          {
            text: 'Abandonner',
            style: 'destructive',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]
      );
    } else {
      reset();
      router.back();
    }
  };

  const handleStopAndFinish = () => {
    Alert.alert(
      'Terminer la séance ?',
      'Voulez-vous clôturer cette activité et passer au récapitulatif ?',
      [
        { text: 'Reprendre', style: 'cancel' },
        {
          text: 'Terminer',
          style: 'default',
          onPress: () => {
            stop();
            router.push('/tracker/summary' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Fullscreen Map with Live Polyline */}
      <MapLibreView
        style={StyleSheet.absoluteFill}
        routeCoordinates={coordinates}
        routeColor={currentSportOption.color}
        followRoute={status === 'running'}
        showUserLocation={true}
        zoomLevel={15}
      />

      {/* Top Floating Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Retour"
        >
          <Ionicons name="close" size={22} color={Colors.light.text} />
        </TouchableOpacity>

        <View style={styles.headerStatusContainer}>
          <View
            style={[
              styles.statusDot,
              status === 'running' && styles.statusDotActive,
              status === 'paused' && styles.statusDotPaused,
            ]}
          />
          <Text style={styles.headerStatusText}>
            {status === 'running'
              ? 'En direct'
              : status === 'paused'
                ? 'En pause'
                : 'Prêt à partir'}
          </Text>
        </View>

        <View style={{ width: 42 }} />
      </View>

      {/* Sport Selector (Visible only when idle) */}
      {status === 'idle' && (
        <View style={[styles.sportSelectorOverlay, { top: insets.top + 56 }]}>
          <SportSelector selectedSport={sport} onSelect={setSport} />
        </View>
      )}

      {/* Floating Bottom Panel: HUD & Controls */}
      <View
        pointerEvents="box-none"
        style={[
          styles.bottomPanelWrapper,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.bottomPanelContent}>
          <TrackerHUD
            elapsedSeconds={elapsedSeconds}
            distanceKm={distanceKm}
            avgPaceSecPerKm={avgPaceSecPerKm}
            caloriesBurned={caloriesBurned}
            elevationGainMeters={elevationGainMeters}
          />

          <TrackerControls
            status={status}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={handleStopAndFinish}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  headerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  statusDotActive: {
    backgroundColor: '#ef4444',
  },
  statusDotPaused: {
    backgroundColor: '#f59e0b',
  },
  headerStatusText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
  },
  sportSelectorOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9,
  },
  bottomPanelWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.space16,
    paddingTop: Spacing.space8,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  bottomPanelContent: {
    width: '100%',
    maxWidth: 520,
  },
});
