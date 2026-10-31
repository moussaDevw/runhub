import type * as NotificationsType from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  getNotificationsModule,
  registerForPushNotificationsAsync,
} from '../services/push-notifications.service';

interface UsePushNotificationsOptions {
  isAuthenticated?: boolean;
}

export function usePushNotifications({ isAuthenticated = false }: UsePushNotificationsOptions = {}) {
  const router = useRouter();
  const notificationListener = useRef<NotificationsType.Subscription | null>(null);
  const responseListener = useRef<NotificationsType.Subscription | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const Notifications = getNotificationsModule();
    if (!Notifications) return;

    // 1. Register device push token with backend
    registerForPushNotificationsAsync();

    // 2. Listener for incoming notifications while app is in foreground
    try {
      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        console.log('[Push] Notification received in foreground:', notification.request.content.title);
      });

      // 3. Listener for user interacting with (tapping) a notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log('[Push] Notification tapped with data:', data);

        if (data?.eventId) {
          router.push({ pathname: '/event/[id]', params: { id: String(data.eventId) } });
        } else if (data?.ticketId) {
          router.push({ pathname: '/ticket/[id]', params: { id: String(data.ticketId) } });
        } else if (data?.clubId) {
          if (data?.type === 'CLUB_JOIN_REQUEST') {
            router.push({ pathname: '/club/[id]/requests' as any, params: { id: String(data.clubId) } });
          } else {
            router.push({ pathname: '/club/[id]' as any, params: { id: String(data.clubId) } });
          }
        }
      });
    } catch (err) {
      console.warn('[Push] Error setting up notification listeners:', err);
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, router]);
}
