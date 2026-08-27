import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/avatar';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

export interface ChatMessageProps {
  id: string;
  isSender: boolean;
  text?: string;
  time?: string;
  isRead?: boolean;
  user?: {
    name: string;
    role?: string;
    initials: string;
    bgColor: string;
  };
  children?: React.ReactNode; // For attachments
}

export function ChatMessage({ isSender, text, time, isRead, user, children }: ChatMessageProps) {
  if (isSender) {
    return (
      <View style={styles.senderContainer}>
        <View style={styles.senderBubble}>
          {text && <Text style={styles.senderText}>{text}</Text>}
          {children}
        </View>
        {(time || isRead !== undefined) && (
          <Text style={styles.metaTextRight}>
            {time} {isRead && '• lu'}
          </Text>
        )}
      </View>
    );
  }

  // Receiver message
  return (
    <View style={styles.receiverContainer}>
      <View style={styles.avatarWrapper}>
        {user && <Avatar initials={user.initials} size={28} backgroundColor={user.bgColor} />}
      </View>
      <View style={styles.receiverContent}>
        {user && (
          <Text style={styles.nameRoleText}>
            <Text style={styles.nameText}>{user.name}</Text>
            {user.role ? ` • ${user.role}` : ''}
          </Text>
        )}
        <View style={styles.receiverBubble}>
          {text && <Text style={styles.receiverText}>{text}</Text>}
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // SENDER
  senderContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.space16,
    marginLeft: 60, // Limit width
  },
  senderBubble: {
    backgroundColor: AccentColors.bissap,
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4, // Sharp corner for sender
  },
  senderText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 20,
  },
  metaTextRight: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    marginTop: 4,
    marginRight: 4,
  },

  // RECEIVER
  receiverContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.space16,
    marginRight: 60, // Limit width
  },
  avatarWrapper: {
    marginRight: Spacing.space8,
    marginBottom: 4, // Align slightly to bottom
  },
  receiverContent: {
    flex: 1,
  },
  nameRoleText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: '#65625e',
    marginBottom: 4,
    marginLeft: 4,
  },
  nameText: {
    fontWeight: '700',
    color: Colors.light.text,
  },
  receiverBubble: {
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 4, // Sharp corner for receiver
    borderBottomRightRadius: 20,
    // Soft shadow like screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  receiverText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 20,
  },
});
