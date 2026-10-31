import { apiClient } from '@/core/api/client';

export type NotificationType =
  | 'REMINDER'
  | 'JOIN'
  | 'SPOT'
  | 'MESSAGE'
  | 'PAYMENT'
  | 'INVITE';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  body: string;
  actorId?: string;
  eventId?: string;
  readAt?: string | null;
  createdAt: string;
  actor?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
  event?: {
    id: string;
    title: string;
    coverUrl: string | null;
    startsAt: string;
  };
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  nextCursor: string | null;
}

export interface RegisterDeviceDto {
  pushToken: string;
  platform: 'IOS' | 'ANDROID';
  locale?: string;
}

export const notificationsApi = {
  /**
   * Registers a device push token with the backend.
   */
  registerDevice: (data: RegisterDeviceDto) => {
    return apiClient<void>('/devices', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Revokes a push token on logout or permission revocation.
   */
  revokeDevice: (pushToken: string) => {
    return apiClient<void>(`/devices/${encodeURIComponent(pushToken)}`, {
      method: 'DELETE',
    });
  },

  /**
   * Retrieves user's in-app notifications.
   */
  getNotifications: (params?: { limit?: number; cursor?: string; unreadOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.cursor) searchParams.append('cursor', params.cursor);
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');

    const query = searchParams.toString();
    return apiClient<NotificationsResponse>(`/notifications${query ? `?${query}` : ''}`);
  },

  /**
   * Retrieves the unread notification count.
   */
  getUnreadCount: () => {
    return apiClient<{ unreadCount: number }>('/notifications/unread-count');
  },

  /**
   * Marks a single notification as read.
   */
  markAsRead: (notificationId: string) => {
    return apiClient<AppNotification>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Marks all unread notifications as read.
   */
  markAllAsRead: () => {
    return apiClient<{ count: number }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
