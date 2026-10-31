import { AccentColors, Colors, SportsColors } from '@/constants/theme';
import { formatRelativeTime } from '@/core/utils/locale';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch } = useNotificationsQuery();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const rawNotifications = data?.notifications ?? [];
  const hasUnread = rawNotifications.some((n: AppNotification) => !n.readAt);

  const translateNotificationBody = useCallback(
    (body: string, eventTitle?: string) => {
      if (!body) return '';

      // Demande d'adhésion club : "... souhaite rejoindre votre club « Club »" / "... wants to join your club « Club »"
      const joinClubMatch =
        body.match(/souhaite rejoindre votre club [«"]([^»"]+)[»"]/i) ||
        body.match(/wants to join your club [«"]([^»"]+)[»"]/i);
      if (joinClubMatch) {
        return t('notifications.clubJoinRequest', { clubName: joinClubMatch[1] });
      }

      // Adhésion acceptée : "Vous êtes maintenant membre du club « Club »" / "You are now a member of the club « Club »"
      const approvedMatch =
        body.match(/maintenant membre du club [«"]([^»"]+)[»"]/i) ||
        body.match(/now a member of(?: the club)? [«"]([^»"]+)[»"]/i);
      if (approvedMatch) {
        return t('notifications.clubJoinApproved', { clubName: approvedMatch[1] });
      }

      // Adhésion refusée : "Votre demande pour rejoindre le club « Club » a été refusée" / "Your request to join the club « Club » was declined"
      const rejectedMatch =
        body.match(/demande pour rejoindre le club [«"]([^»"]+)[»"] a [ée]t[ée] refus[ée]e/i) ||
        body.match(/request to join the club [«"]([^»"]+)[»"] was declined/i);
      if (rejectedMatch) {
        return t('notifications.clubJoinRejected', { clubName: rejectedMatch[1] });
      }

      // Événement de club : "Le club Club organise « Titre »" / "Club Club is hosting « Titre »"
      const clubEventMatch =
        body.match(/Le club (.+) organise [«"]([^»"]+)[»"]/i) ||
        body.match(/Club (.+) is hosting [«"]([^»"]+)[»"]/i) ||
        body.match(/Club (.+) organizes [«"]([^»"]+)[»"]/i);
      if (clubEventMatch) {
        return t('notifications.clubEventCreated', {
          clubName: clubEventMatch[1],
          eventTitle: clubEventMatch[2],
        });
      }

      // Événement de sport : "Nouvel événement Sport : « Titre »" / "New Sport event: « Titre »"
      const sportEventMatch =
        body.match(/Nouvel [ée]v[ée]nement ([^:«»]+)(?:\s*:\s*[«"]([^»"]+)[»"]|\s*organise\s*[«"]([^»"]+)[»"])/i) ||
        body.match(/New ([^:«»]+) event:\s*[«"]([^»"]+)[»"]/i);
      if (sportEventMatch) {
        const sport = sportEventMatch[1]?.trim();
        const evTitle = sportEventMatch[2] || sportEventMatch[3] || eventTitle || '';
        return t('notifications.sportEventCreated', {
          sportName: sport,
          eventTitle: evTitle,
        });
      }

      // Inscription : "... a rejoint votre événement « Titre »" / "... joined your event « Titre »"
      const joinedEventMatch =
        body.match(/a rejoint votre [ée]v[ée]nement [«"]([^»"]+)[»"]/i) ||
        body.match(/joined your event [«"]([^»"]+)[»"]/i);
      if (joinedEventMatch) {
        return t('notifications.eventRegistration', {
          eventTitle: joinedEventMatch[1] || eventTitle || '',
        });
      }

      // Désistement : "... a annulé sa participation à « Titre »" / "... cancelled their participation in « Titre »"
      const cancelEventMatch =
        body.match(/a annul[ée] sa participation [àa]\s*[«"]([^»"]+)[»"]/i) ||
        body.match(/cancelled (?:their|his|her) (?:participation in|registration for)\s*[«"]([^»"]+)[»"]/i);
      if (cancelEventMatch) {
        return t('notifications.eventCancellation', {
          eventTitle: cancelEventMatch[1] || eventTitle || '',
        });
      }

      // Place libérée : "Une place est de nouveau disponible pour « Titre »" / "A spot is available again for « Titre »"
      const spotMatch =
        body.match(/disponible pour [«"]([^»"]+)[»"]/i) ||
        body.match(/available (?:again )?for [«"]([^»"]+)[»"]/i);
      if (spotMatch) {
        return t('notifications.spotAvailable', {
          eventTitle: spotMatch[1] || eventTitle || '',
        });
      }

      return body;
    },
    [t]
  );

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
    const translatedBody = translateNotificationBody(notification.body, notification.event?.title);

    switch (notification.type) {
      case 'REMINDER':
        return {
          id: notification.id,
          type: 'system',
          isRead,
          time,
          body: translatedBody,
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
          body: translatedBody,
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
          body: translatedBody,
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
          body: translatedBody,
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
          body: translatedBody,
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
          body: translatedBody,
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
