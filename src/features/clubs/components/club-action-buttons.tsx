import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { ClubResponse } from '../types/clubs.types';

interface ClubActionButtonsProps {
  club: ClubResponse;
  isJoinPending: boolean;
  isFollowPending: boolean;
  onPressJoin: () => void;
  onPressFollow: () => void;
}

export function ClubActionButtons({
  club,
  isJoinPending,
  isFollowPending,
  onPressJoin,
  onPressFollow,
}: ClubActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.actionRow}>
      {/* Join / Request / Leave button */}
      <TouchableOpacity
        style={[
          styles.joinButton,
          club.isMember && styles.leaveButton,
          club.joinRequestStatus === 'PENDING' && styles.pendingButton,
        ]}
        onPress={onPressJoin}
        disabled={isJoinPending}
      >
        {isJoinPending ? (
          <ActivityIndicator
            size="small"
            color={club.isMember || club.joinRequestStatus === 'PENDING' ? '#e06666' : '#ffffff'}
          />
        ) : club.isMember ? (
          <Text style={styles.leaveButtonText}>{t('club.leave')}</Text>
        ) : club.joinRequestStatus === 'PENDING' ? (
          <Text style={styles.pendingButtonText}>{t('club.cancelRequest')}</Text>
        ) : (
          <Text style={styles.joinButtonText}>{t('club.join')}</Text>
        )}
      </TouchableOpacity>

      <View style={{ width: Spacing.space12 }} />

      {/* Follow / Unfollow button */}
      <TouchableOpacity
        style={[styles.followButton, club.isFollower && styles.subscribedButton]}
        onPress={onPressFollow}
        disabled={isFollowPending}
      >
        {isFollowPending ? (
          <ActivityIndicator
            size="small"
            color={club.isFollower ? Colors.light.text : '#ffffff'}
          />
        ) : club.isFollower ? (
          <Text style={styles.subscribedText}>{t('club.subscribed')}</Text>
        ) : (
          <Text style={styles.followButtonText}>{t('club.follow')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space32,
  },
  joinButton: {
    flex: 1.2,
    backgroundColor: AccentColors.indigoWolof || '#2b3b8c',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  leaveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e06666',
  },
  leaveButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#e06666',
  },
  pendingButton: {
    backgroundColor: '#f5f2ee',
    borderWidth: 1,
    borderColor: '#d6d3ce',
  },
  pendingButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#8b8882',
  },
  followButton: {
    flex: 1,
    backgroundColor: AccentColors.bissap,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  subscribedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  subscribedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
});

