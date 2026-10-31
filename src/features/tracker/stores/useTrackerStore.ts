import { create } from 'zustand';
import { HaversineService } from '../services/haversine.service';
import { TrackerMetricsService } from '../services/tracker-metrics.service';
import { ActivitySport, TrackerCoord, TrackerStatus } from '../types/tracker.types';

interface TrackerState {
  sport: ActivitySport;
  status: TrackerStatus;
  startedAt: string | null;
  endedAt: string | null;
  elapsedSeconds: number;
  distanceMeters: number;
  coordinates: TrackerCoord[];
  elevationGainMeters: number;
  currentSpeedMps: number | null;

  // Actions
  setSport: (sport: ActivitySport) => void;
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => void;
  resetTracking: () => void;
  tick: () => void;
  addLocation: (coord: TrackerCoord) => void;

  // Computed helpers
  getDistanceKm: () => number;
  getAvgPaceSecPerKm: () => number | null;
  getCurrentPaceSecPerKm: () => number | null;
  getCaloriesBurned: () => number;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  sport: 'running',
  status: 'idle',
  startedAt: null,
  endedAt: null,
  elapsedSeconds: 0,
  distanceMeters: 0,
  coordinates: [],
  elevationGainMeters: 0,
  currentSpeedMps: null,

  setSport: (sport: ActivitySport) => set({ sport }),

  startTracking: () =>
    set({
      status: 'running',
      startedAt: new Date().toISOString(),
      endedAt: null,
      elapsedSeconds: 0,
      distanceMeters: 0,
      coordinates: [],
      elevationGainMeters: 0,
      currentSpeedMps: null,
    }),

  pauseTracking: () => {
    const { status } = get();
    if (status === 'running') {
      set({ status: 'paused', currentSpeedMps: 0 });
    }
  },

  resumeTracking: () => {
    const { status } = get();
    if (status === 'paused') {
      set({ status: 'running' });
    }
  },

  stopTracking: () => {
    const { status } = get();
    if (status === 'running' || status === 'paused') {
      set({
        status: 'stopped',
        endedAt: new Date().toISOString(),
        currentSpeedMps: 0,
      });
    }
  },

  resetTracking: () =>
    set({
      status: 'idle',
      startedAt: null,
      endedAt: null,
      elapsedSeconds: 0,
      distanceMeters: 0,
      coordinates: [],
      elevationGainMeters: 0,
      currentSpeedMps: null,
    }),

  tick: () => {
    const { status, elapsedSeconds } = get();
    if (status === 'running') {
      set({ elapsedSeconds: elapsedSeconds + 1 });
    }
  },

  addLocation: (coord: TrackerCoord) => {
    const { status, coordinates, distanceMeters, elevationGainMeters } = get();
    if (status !== 'running') return;

    if (coordinates.length === 0) {
      set({
        coordinates: [coord],
        currentSpeedMps: coord.speed ?? null,
      });
      return;
    }

    const prevCoord = coordinates[coordinates.length - 1];
    const segmentMeters = HaversineService.getDistanceMeters(
      prevCoord.latitude,
      prevCoord.longitude,
      coord.latitude,
      coord.longitude,
    );

    // Ignore tiny GPS jitter (< 2.5 meters)
    if (segmentMeters < 2.5) {
      return;
    }

    // Calculate elevation gain if altitude is provided
    let newElevationGain = elevationGainMeters;
    if (
      coord.altitude !== null &&
      coord.altitude !== undefined &&
      prevCoord.altitude !== null &&
      prevCoord.altitude !== undefined
    ) {
      const diff = coord.altitude - prevCoord.altitude;
      if (diff > 0.5 && diff < 50) {
        newElevationGain += diff;
      }
    }

    set({
      coordinates: [...coordinates, coord],
      distanceMeters: distanceMeters + segmentMeters,
      elevationGainMeters: Math.round(newElevationGain * 10) / 10,
      currentSpeedMps: coord.speed ?? null,
    });
  },

  getDistanceKm: () => {
    const { distanceMeters } = get();
    return Number((distanceMeters / 1000).toFixed(2));
  },

  getAvgPaceSecPerKm: () => {
    const { distanceMeters, elapsedSeconds } = get();
    return TrackerMetricsService.calculatePace(distanceMeters, elapsedSeconds);
  },

  getCurrentPaceSecPerKm: () => {
    const { currentSpeedMps } = get();
    if (!currentSpeedMps || currentSpeedMps < 0.5) return null;
    // Speed is m/s. 1 km = 1000 m. Pace in sec/km = 1000 / speed
    return Math.round(1000 / currentSpeedMps);
  },

  getCaloriesBurned: () => {
    const { sport, distanceMeters } = get();
    const distanceKm = distanceMeters / 1000;
    return TrackerMetricsService.estimateCalories(sport, distanceKm);
  },
}));
