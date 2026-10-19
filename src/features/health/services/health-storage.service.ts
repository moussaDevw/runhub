import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthSummary } from '../types/health.types';

const HEALTH_STORAGE_KEY = '@runhub_health_summary_v1';
const HEALTH_CONNECTED_KEY = '@runhub_health_connected_v1';

export class HealthStorageService {
  static async getSavedSummary(): Promise<HealthSummary | null> {
    try {
      const raw = await AsyncStorage.getItem(HEALTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static async saveSummary(summary: HealthSummary): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(summary));
    } catch {}
  }

  static async isConnected(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(HEALTH_CONNECTED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  }

  static async setConnected(connected: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_CONNECTED_KEY, connected ? 'true' : 'false');
    } catch {}
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([HEALTH_STORAGE_KEY, HEALTH_CONNECTED_KEY]);
    } catch {}
  }
}
