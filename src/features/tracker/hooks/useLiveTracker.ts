import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { locationTrackerService } from '../services/location-tracker.service';
import { useTrackerStore } from '../stores/useTrackerStore';

export function useLiveTracker() {
  const {
    sport,
    status,
    startedAt,
    endedAt,
    elapsedSeconds,
    distanceMeters,
    coordinates,
    elevationGainMeters,
    setSport,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    resetTracking,
    addLocation,
    tick,
    getDistanceKm,
    getAvgPaceSecPerKm,
    getCurrentPaceSecPerKm,
    getCaloriesBurned,
  } = useTrackerStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Timer ticker effect
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, tick]);

  // 2. Location watching effect
  useEffect(() => {
    if (status === 'running') {
      locationTrackerService.startWatching((coord) => {
        addLocation(coord);
      });
    } else if (status === 'paused' || status === 'stopped' || status === 'idle') {
      locationTrackerService.stopWatching();
    }

    return () => {
      locationTrackerService.stopWatching();
    };
  }, [status, addLocation]);

  // Haptic-enabled controls
  const handleStart = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startTracking();
  };

  const handlePause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pauseTracking();
  };

  const handleResume = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resumeTracking();
  };

  const handleStop = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    stopTracking();
  };

  return {
    sport,
    status,
    startedAt,
    endedAt,
    elapsedSeconds,
    distanceMeters,
    distanceKm: getDistanceKm(),
    avgPaceSecPerKm: getAvgPaceSecPerKm(),
    currentPaceSecPerKm: getCurrentPaceSecPerKm(),
    caloriesBurned: getCaloriesBurned(),
    elevationGainMeters,
    coordinates,
    setSport,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
    reset: resetTracking,
  };
}
