export type ActivitySport = 'running' | 'walking' | 'trail' | 'cycling';

export type TrackerStatus = 'idle' | 'running' | 'paused' | 'stopped';

export interface TrackerCoord {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude?: number | null;
  speed?: number | null; // meters per second
}

export interface LiveMetrics {
  durationSeconds: number;
  distanceMeters: number;
  distanceKm: number;
  currentPaceSecPerKm: number | null;
  avgPaceSecPerKm: number | null;
  caloriesBurned: number;
  elevationGainMeters: number;
}

export interface SaveActivityPayload {
  title: string;
  description?: string;
  sportId?: string;
  sport: ActivitySport;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceMeters: number;
  distanceKm: number;
  avgPaceSecPerKm?: number;
  caloriesBurned?: number;
  elevationGainMeters?: number;
  polyline?: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  source?: 'IN_APP_TRACKER';
}

export interface SportOption {
  key: ActivitySport;
  labelFr: string;
  icon: string;
  color: string;
  caloriesFactor: number; // approximate kcal per kg per km
}
