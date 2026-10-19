import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { registerForPushNotificationsAsync } from '../services/push-notifications.service';

interface UsePushNotificationsOptions {
  isAuthenticated?: boolean;
}

export function usePushNotifications({ isAuthenticated = false }: UsePushNotificationsOptions = {}) {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Register device push token with backend
    registerForPushNotificationsAsync();

    // 2. Listener for incoming notifications while app is in foreground
    // gére les notifications lorsque l'application est en cours d'utilisation
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Push] Notification received in foreground:', notification.request.content.title);
    });

    // 3. Listener for user interacting with (tapping) a notification
    // géré les notifications lorsque l'application est en arrière-plan ou fermée
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('[Push] Notification tapped with data:', data);

      if (data?.eventId) {
        // Navigate to event details
        router.push({ pathname: '/event/[id]', params: { id: String(data.eventId) } });
      } else if (data?.ticketId) {
        // Navigate to ticket
        router.push({ pathname: '/ticket/[id]', params: { id: String(data.ticketId) } });
      }
    });

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
