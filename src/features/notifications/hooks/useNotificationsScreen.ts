import { AccentColors, Colors, SportsColors } from '@/constants/theme';
import { formatRelativeTime } from '@/core/utils/locale';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { AppNotification } from '../api/notifications.api';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotificationsQuery,
} from './useNotifications';

export interface FormattedNotificationItem {
  id: string;
  type: 'system' | 'user';
  isRead: boolean;
  time: string;
  body: string;
  actorName?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBgColor?: string;
  userInitials?: string;
  userBgColor?: string;
  subIconName?: keyof typeof Ionicons.glyphMap;
  subIconBgColor?: string;
  onPress: () => void;
}

export function useNotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { data, isLoading, isRefetching, refetch } = useNotificationsQuery();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const rawNotifications = data?.notifications ?? [];
  const hasUnread = rawNotifications.some((n: AppNotification) => !n.readAt);

  const handleNotificationPress = useCallback(
    (notification: AppNotification) => {
      // 1. Mark as read if unread
      if (!notification.readAt) {
        markAsReadMutation.mutate(notification.id);
      }

      // 2. Navigate based on notification metadata
      if (notification.eventId) {
        router.push({ pathname: '/event/[id]', params: { id: notification.eventId } });
      }
    },
    [markAsReadMutation, router],
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (hasUnread) {
      markAllAsReadMutation.mutate();
    }
  }, [hasUnread, markAllAsReadMutation]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const formattedNotifications: FormattedNotificationItem[] = rawNotifications.map((notification) => {
    const isRead = !!notification.readAt;
    const time = formatRelativeTime(notification.createdAt);

    switch (notification.type) {
      case 'REMINDER':
        return {
          id: notification.id,
          type: 'system',
          isRead,
          time,
          body: notification.body,
          iconName: 'time-outline',
          iconBgColor: AccentColors.bissap,
          onPress: () => handleNotificationPress(notification),
        };

      case 'JOIN': {
        const actorName = notification.actor
          ? `${notification.actor.firstName || ''} ${notification.actor.lastName || ''}`.trim()
          : '';
        const initials = actorName
          ? actorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : 'U';

        return {
          id: notification.id,
          type: 'user',
          isRead,
          time,
          body: notification.body,
          actorName,
          userInitials: initials,
          userBgColor: SportsColors.running,
          subIconName: 'person-add',
          subIconBgColor: theme.text,
          onPress: () => handleNotificationPress(notification),
        };
      }

      case 'SPOT':
        return {
          id: notification.id,
          type: 'system',
          isRead,
          time,
          body: notification.body,
          iconName: 'sparkles',
          iconBgColor: SportsColors.foot,
          onPress: () => handleNotificationPress(notification),
        };

      case 'MESSAGE': {
        const actorName = notification.actor
          ? `${notification.actor.firstName || ''} ${notification.actor.lastName || ''}`.trim()
          : '';
        const initials = actorName
          ? actorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : 'M';

        return {
          id: notification.id,
          type: 'user',
          isRead,
          time,
          body: notification.body,
          actorName,
          userInitials: initials,
          userBgColor: SportsColors.fitness,
          subIconName: 'chatbubble',
          subIconBgColor: theme.text,
          onPress: () => handleNotificationPress(notification),
        };
      }

      case 'PAYMENT':
        return {
          id: notification.id,
          type: 'system',
          isRead,
          time,
          body: notification.body,
          iconName: 'card-outline',
          iconBgColor: AccentColors.verified,
          onPress: () => handleNotificationPress(notification),
        };

      case 'INVITE':
      default:
        return {
          id: notification.id,
          type: 'system',
          isRead,
          time,
          body: notification.body,
          iconName: 'notifications-outline',
          iconBgColor: Colors.light.ink3,
          onPress: () => handleNotificationPress(notification),
        };
    }
  });

  return {
    notifications: formattedNotifications,
    hasUnread,
    isLoading,
    isRefetching,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch,
    handleBack,
    handleMarkAllAsRead,
  };
}
