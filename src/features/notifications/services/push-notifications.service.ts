import Constants from 'expo-constants';
import * as Device from 'expo-device';
import type * as NotificationsType from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationsApi } from '../api/notifications.api';
import i18next from '@/core/i18n/i18n';

// Safe dynamic require to prevent crash if native module is not linked in current build
let Notifications: typeof NotificationsType | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
} catch (e) {
  console.warn(
    '[Push] Module natif expo-notifications non détecté dans le build actuel. Un rebuild natif (Android Studio / npx expo run:android) est nécessaire pour activer les notifications push.'
  );
}

export function getNotificationsModule(): typeof NotificationsType | null {
  return Notifications;
}

/**
 * Configure default foreground notification behavior (alert, sound, badge).
 */
if (Notifications) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    console.warn('[Push] Error configuring notification handler:', error);
  }
}

/**
 * Configure Android notification channels.
 */
export async function setupAndroidNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android' || !Notifications) return;

  try {
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Événements & Rappels',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#e10600',
    });

    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages de discussion',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 200, 100, 200],
      lightColor: '#e10600',
    });

    await Notifications.setNotificationChannelAsync('payments', {
      name: 'Tickets & Paiements',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('default', {
      name: 'Général',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  } catch (error) {
    console.warn('[Push] Failed to setup notification channels:', error);
  }
}

/**
 * Requests push permissions, gets the ExpoPushToken, and registers it with the backend.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Notifications) {
    console.log('[Push] expo-notifications n\'est pas disponible dans ce build natif.');
    return null;
  }

  if (!Device.isDevice) {
    console.log('[Push] Push notifications only work on physical devices.');
    return null;
  }

  // Setup Android channels first
  await setupAndroidNotificationChannels();

  // 1. Check existing permissions
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 2. If not granted, request permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Push] Permission for push notifications not granted.');
      return null;
    }

    // 3. Resolve EAS Project ID
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const pushToken = tokenData.data;

    // 4. Send token to backend API
    const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    const locale = i18next.language.startsWith('en') ? 'en' : 'fr';
    await notificationsApi.registerDevice({
      pushToken,
      platform,
      locale,
    });

    console.log('[Push] Device registered with pushToken:', pushToken);
    return pushToken;
  } catch (error) {
    console.error('[Push] Error registering push notifications:', error);
    return null;
  }
}
