import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { AccentColors, Colors, Spacing, SportsColors, Typography } from '@/constants/theme';
import { ClubMember } from '../types/clubs.types';

interface ClubMembersPreviewProps {
  members: ClubMember[];
  totalMembersCount: number;
  onPress: () => void;
}

export function ClubMembersPreview({
  members,
  totalMembersCount,
  onPress,
}: ClubMembersPreviewProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.membersCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.membersCardHeader}>
        <View>
          <Text style={styles.membersCardTitle}>{t('club.membersTitle')}</Text>
          <Text style={styles.membersCardSub}>
            {t('club.membersCount', { count: totalMembersCount })}
          </Text>
        </View>
        <View style={styles.viewAllRow}>
          <Text style={styles.viewAllText}>{t('club.viewAll')}</Text>
          <Ionicons name="chevron-forward" size={16} color={AccentColors.bissap} />
        </View>
      </View>

      {members.length > 0 && (
        <View style={styles.avatarStackRow}>
          {members.slice(0, 6).map((m, idx) => {
            const firstName = m?.user?.firstName || '';
            const lastName = m?.user?.lastName || '';
            const initials =
              `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() ||
              m?.user?.username?.[0]?.toUpperCase() ||
              '?';

            return (
              <View
                key={`${m.clubId}_${m.userId}`}
                style={[
                  styles.avatarStackItem,
                  { marginLeft: idx === 0 ? 0 : -10, zIndex: 10 - idx },
                ]}
              >
                {m?.user?.avatarUrl ? (
                  <Image source={{ uri: m.user.avatarUrl }} style={styles.stackedAvatar} />
                ) : (
                  <Avatar initials={initials} size={34} backgroundColor={SportsColors.running} />
                )}
              </View>
            );
          })}

          {members.length > 6 && (
            <View
              style={[
                styles.avatarStackItem,
                styles.moreAvatarCircle,
                { marginLeft: -10, zIndex: 0 },
              ]}
            >
              <Text style={styles.moreAvatarText}>+{members.length - 6}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  membersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.space16,
    marginBottom: Spacing.space24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0ece6',
  },
  membersCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.space12,
  },
  membersCardTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  membersCardSub: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: AccentColors.bissap,
    marginRight: 2,
  },
  avatarStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.space4,
  },
  avatarStackItem: {
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 20,
  },
  stackedAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  moreAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreAvatarText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
    fontWeight: '700',
  },
});

