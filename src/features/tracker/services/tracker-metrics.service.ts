import { ActivitySport } from '../types/tracker.types';

export class TrackerMetricsService {
  /**
   * Formats seconds into "MM:SS" or "HH:MM:SS".
   */
  static formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  /**
   * Formats seconds per km into "M:SS /km" or "-:-- /km".
   */
  static formatPace(secPerKm: number | null): string {
    if (!secPerKm || secPerKm <= 0 || secPerKm > 3600) {
      return '--:-- /km';
    }
    const minutes = Math.floor(secPerKm / 60);
    const seconds = Math.floor(secPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  }

  /**
   * Calculates pace in seconds per km from distance in meters and duration in seconds.
   */
  static calculatePace(distanceMeters: number, durationSeconds: number): number | null {
    if (distanceMeters < 10 || durationSeconds <= 0) return null;
    const distanceKm = distanceMeters / 1000;
    return Math.round(durationSeconds / distanceKm);
  }

  /**
   * Estimates calories burned based on sport type, distance (km) and user weight (default 70kg).
   */
  static estimateCalories(
    sport: ActivitySport,
    distanceKm: number,
    weightKg: number = 70,
  ): number {
    if (distanceKm <= 0) return 0;

    // Multiplier per kg per km
    let factor = 1.0; // running default ~1 kcal/kg/km
    switch (sport) {
      case 'running':
      case 'trail':
        factor = 1.05;
        break;
      case 'walking':
        factor = 0.75;
        break;
      case 'cycling':
        factor = 0.45;
        break;
    }

    return Math.round(distanceKm * weightKg * factor);
  }
}
