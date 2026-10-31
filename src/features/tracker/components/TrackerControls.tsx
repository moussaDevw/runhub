import { AccentColors, Colors, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { TrackerStatus } from '../types/tracker.types';

interface TrackerControlsProps {
  status: TrackerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TrackerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
}: TrackerControlsProps) {
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720 || width < 375;

  if (status === 'idle') {
    return (
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onStart}
          style={[styles.bigStartButton, isCompact && styles.bigStartButtonCompact]}
          accessibilityRole="button"
          accessibilityLabel="Démarrer la séance"
        >
          <Ionicons
            name="play"
            size={isCompact ? 28 : 32}
            color="#ffffff"
            style={{ marginLeft: 3 }}
          />
          <Text style={[styles.bigStartText, isCompact && styles.bigStartTextCompact]}>
            DÉMARRER
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'running') {
    return (
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPause}
          style={[styles.pauseButton, isCompact && styles.pauseButtonCompact]}
          accessibilityRole="button"
          accessibilityLabel="Mettre en pause"
        >
          <Ionicons name="pause" size={isCompact ? 28 : 34} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'paused') {
    return (
      <View style={[styles.pausedContainer, isCompact && styles.pausedContainerCompact]}>
        {/* Reprendre */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onResume}
          style={[styles.resumeButton, isCompact && styles.resumeButtonCompact]}
          accessibilityRole="button"
          accessibilityLabel="Reprendre la séance"
        >
          <Ionicons
            name="play"
            size={isCompact ? 24 : 28}
            color="#ffffff"
            style={{ marginLeft: 2 }}
          />
          <Text style={[styles.controlText, isCompact && styles.controlTextCompact]}>
            Reprendre
          </Text>
        </TouchableOpacity>

        {/* Terminer */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onStop}
          style={[styles.stopButton, isCompact && styles.stopButtonCompact]}
          accessibilityRole="button"
          accessibilityLabel="Terminer la séance"
        >
          <Ionicons name="flag" size={isCompact ? 22 : 26} color="#ffffff" />
          <Text style={[styles.controlText, isCompact && styles.controlTextCompact]}>
            Terminer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bigStartButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  bigStartText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: 1,
    marginTop: 6,
  },
  pauseButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eab308', // Amber warning color
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  pausedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  resumeButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#16a34a', // Emerald green
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  stopButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  controlText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
  },
  // Responsive compact styles
  containerCompact: {
    paddingVertical: 10,
  },
  bigStartButtonCompact: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  bigStartTextCompact: {
    fontSize: 12,
    marginTop: 4,
  },
  pauseButtonCompact: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  pausedContainerCompact: {
    gap: 16,
    paddingVertical: 10,
  },
  resumeButtonCompact: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  stopButtonCompact: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  controlTextCompact: {
    fontSize: 11,
    marginTop: 2,
  },
});
