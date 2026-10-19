import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationsApi } from '../api/notifications.api';

/**
 * Configure default foreground notification behavior (alert, sound, badge).
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Configure Android notification channels.
 */
export async function setupAndroidNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

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
}

/**
 * Requests push permissions, gets the ExpoPushToken, and registers it with the backend.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[Push] Push notifications only work on physical devices.');
    return null;
  }

  // Setup Android channels first
  await setupAndroidNotificationChannels();

  // 1. Check existing permissions
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

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const pushToken = tokenData.data;

    // 4. Send token to backend API
    const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    await notificationsApi.registerDevice({
      pushToken,
      platform,
    });

    console.log('[Push] Device registered with pushToken:', pushToken);
    return pushToken;
  } catch (error) {
    console.error('[Push] Error registering push notifications:', error);
    return null;
  }
}
