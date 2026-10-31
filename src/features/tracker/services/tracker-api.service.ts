import { apiClient } from '@/core/api/client';
import { SaveActivityPayload } from '../types/tracker.types';

export class TrackerApiService {
  /**
   * Saves completed activity to Jump-In backend API.
   */
  static async saveActivity(payload: SaveActivityPayload) {
    return apiClient<any>('/activities', {
      method: 'POST',
      body: payload,
    });
  }

  /**
   * Fetches user's activity history.
   */
  static async getMyActivities(limit: number = 20, cursor?: string) {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (cursor) params.set('cursor', cursor);

    return apiClient<any>(`/activities/me?${params.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Fetches user's activity statistics (weekly, monthly, total km).
   */
  static async getMyStats() {
    return apiClient<any>('/activities/me/stats', {
      method: 'GET',
    });
  }
}
