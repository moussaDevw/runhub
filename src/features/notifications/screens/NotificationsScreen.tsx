import { HStack, Screen, VStack } from '@/components/layout';
import { AccentColors, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { FormattedNotificationItem, useNotificationsScreen } from '@/features/notifications';
import { NotificationItem } from '@/features/notifications/components';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    notifications,
    hasUnread,
    isLoading,
    isRefetching,
    isMarkingAllAsRead,
    refetch,
    handleBack,
    handleMarkAllAsRead,
  } = useNotificationsScreen();

  const header = (
    <HStack
      align="center"
      justify="space-between"
      style={[
        styles.header,
        { backgroundColor: theme.background, borderBottomColor: theme.line },
      ]}
    >
      <HStack align="center">
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('common.back', { defaultValue: 'Retour' })}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('notifications.title', { defaultValue: 'Notifications' })}
        </Text>
      </HStack>

      {hasUnread && (
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          hitSlop={8}
          accessibilityRole="button"
          disabled={isMarkingAllAsRead}
        >
          <Text style={styles.headerActionText}>
            {t('notifications.readAll', { defaultValue: 'TOUT MARQUER COMME LU' })}
          </Text>
        </TouchableOpacity>
      )}
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      header={header}
      refreshing={isRefetching}
      onRefresh={refetch}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AccentColors.bissap} />
        </View>
      ) : notifications.length === 0 ? (
        <VStack align="center" justify="center" style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.light.ink3} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t('notifications.emptyTitle', { defaultValue: 'Aucune notification' })}
          </Text>
          <Text style={[styles.emptySubtitle, { color: Colors.light.ink3 }]}>
            {t('notifications.emptySubtitle', {
              defaultValue: 'Vous serez notifié des nouvelles inscriptions, messages et rappels.',
            })}
          </Text>
        </VStack>
      ) : (
        notifications.map((item: FormattedNotificationItem) => {
          const textElement = item.actorName ? (
            <Text style={{ color: theme.textSecondary }}>
              <Text style={[styles.boldText, { color: theme.text }]}>{item.actorName} </Text>
              {item.body}
            </Text>
          ) : (
            item.body
          );

          return (
            <NotificationItem
              key={item.id}
              type={item.type}
              isRead={item.isRead}
              time={item.time}
              text={textElement}
              iconName={item.iconName}
              iconBgColor={item.iconBgColor}
              userInitials={item.userInitials}
              userBgColor={item.userBgColor}
              subIconName={item.subIconName}
              subIconBgColor={item.subIconBgColor}
              onPress={item.onPress}
            />
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: Spacing.space12,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
  },
  headerActionText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: AccentColors.bissap,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  boldText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontWeight: '700',
  },
  centerContainer: {
    paddingVertical: Spacing.space32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingHorizontal: Spacing.space32,
    paddingVertical: Spacing.six,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space16,
  },
  emptyTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    marginBottom: Spacing.space8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
