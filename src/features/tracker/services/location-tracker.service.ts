import * as Location from 'expo-location';
import { TrackerCoord } from '../types/tracker.types';

export class LocationTrackerService {
  private subscription: Location.LocationSubscription | null = null;

  /**
   * Checks and requests location permission.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      console.warn('Error requesting foreground location permission:', e);
      return false;
    }
  }

  /**
   * Starts listening to GPS updates with optimized battery thresholds.
   */
  async startWatching(onLocation: (coord: TrackerCoord) => void): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    // Clean any prior subscription
    this.stopWatching();

    try {
      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 4, // minimum 4 meters between updates
          timeInterval: 1000,  // minimum 1 second
        },
        (location) => {
          const coord: TrackerCoord = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
          };
          onLocation(coord);
        },
      );
      return true;
    } catch (err) {
      console.error('Failed to start location watching:', err);
      return false;
    }
  }

  /**
   * Stops listening to GPS updates.
   */
  stopWatching(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export const locationTrackerService = new LocationTrackerService();
