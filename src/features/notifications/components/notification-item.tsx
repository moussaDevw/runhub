import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/avatar';
import { Colors, AccentColors, Spacing, Typography } from '@/constants/theme';

export type NotificationType = 'system' | 'user';

export interface NotificationItemProps {
  type: NotificationType;
  isRead: boolean;
  time: string;
  text: React.ReactNode;
  
  // For 'system' type
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBgColor?: string;

  // For 'user' type
  userInitials?: string;
  userBgColor?: string;
  subIconName?: keyof typeof Ionicons.glyphMap;
  subIconBgColor?: string;

  onPress?: () => void;
}

export function NotificationItem({
  type,
  isRead,
  time,
  text,
  iconName,
  iconBgColor,
  userInitials,
  userBgColor,
  subIconName,
  subIconBgColor,
  onPress
}: NotificationItemProps) {
  
  const renderLeftComponent = () => {
    if (type === 'system' && iconName) {
      return (
        <View style={[styles.systemIconContainer, { backgroundColor: iconBgColor || Colors.light.text }]}>
          <Ionicons name={iconName} size={22} color="#ffffff" />
        </View>
      );
    }

    if (type === 'user' && userInitials) {
      return (
        <View style={styles.userAvatarContainer}>
          <Avatar initials={userInitials} size={44} backgroundColor={userBgColor || '#f2784f'} />
          {subIconName && (
            <View style={[styles.subIconBadge, { backgroundColor: subIconBgColor || Colors.light.text }]}>
              <Ionicons name={subIconName} size={10} color="#ffffff" />
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        !isRead ? styles.containerUnread : styles.containerRead
      ]}
      accessibilityRole="button"
    >
      {renderLeftComponent()}
      
      <View style={styles.contentContainer}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.rightAction}>
        {!isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Spacing.space16,
    paddingHorizontal: Spacing.space20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  containerUnread: {
    backgroundColor: Colors.light.backgroundElement,
  },
  containerRead: {
    backgroundColor: '#ffffff',
  },
  systemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: Spacing.space16,
  },
  subIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Spacing.space12,
  },
  text: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
  },
  rightAction: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AccentColors.bissap,
  },
});
