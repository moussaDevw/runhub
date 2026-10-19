export type HealthProvider = 'apple_health' | 'health_connect' | 'none';

export type HealthAuthStatus = 'authorized' | 'denied' | 'not_determined' | 'unavailable';

export interface WorkoutSession {
  id: string;
  startDate: string;
  endDate: string;
  distanceKm: number;
  durationMinutes: number;
  caloriesBurned?: number;
  averagePace?: string; // e.g. "5:12 /km"
  source: string;
}

export interface HealthSummary {
  isConnected: boolean;
  provider: HealthProvider;
  status: HealthAuthStatus;
  totalDistanceKm: number;
  weeklyDistanceKm: number;
  monthlyDistanceKm: number;
  todaySteps: number;
  totalWorkouts: number;
  lastSyncedAt: string | null;
  recentWorkouts: WorkoutSession[];
}
