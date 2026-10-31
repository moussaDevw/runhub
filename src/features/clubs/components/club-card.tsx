import { Avatar } from '@/components/ui/avatar';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { ClubResponse } from '@/features/clubs/types/clubs.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ClubCardProps {
  club: ClubResponse;
  onPress: () => void;
}

export function ClubCard({ club, onPress }: ClubCardProps) {
  const { t } = useTranslation();
  const isOwner = Boolean(club.isOwner || club.myRole === 'OWNER');
  const membersCount = club._count?.members || 0;
  const eventsCount = club._count?.events || 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isOwner && styles.myClubCardBorder,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
    >
      {/* Cover background (with overlay gradient vibe) */}
      <View style={styles.coverContainer}>
        <Image
          source={club.coverUrl ? { uri: club.coverUrl } : require('@/assets/images/bg_home.jpeg')}
          style={styles.coverImage}
          contentFit="cover"
        />
        <View style={styles.badgesContainer}>
          {isOwner && (
            <View style={styles.myClubBadge}>
              <Ionicons name="sparkles" size={12} color="#ffffff" />
              <Text style={styles.myClubText}>{t('club.myClub', { defaultValue: 'Mon club' })}</Text>
            </View>
          )}
          {club.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#ffffff" />
              <Text style={styles.verifiedText}>{t('club.verified')}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Main Info */}
      <View style={styles.body}>
        {/* Logo overlapping the cover */}
        <View style={styles.logoWrapper}>
          {club.logoUrl ? (
            <Image source={{ uri: club.logoUrl }} style={styles.logo} />
          ) : (
            <Avatar initials={club.name.substring(0, 2).toUpperCase()} size={56} backgroundColor={AccentColors.bissap} />
          )}
        </View>

        {/* Text Details */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {club.name}
          </Text>
          <Text style={styles.handle} numberOfLines={1}>
            @{club.handle}
          </Text>
          {club.bio ? (
            <Text style={styles.bio} numberOfLines={2}>
              {club.bio}
            </Text>
          ) : (
            <Text style={styles.noBio}>{t('club.noDescription')}</Text>
          )}
        </View>

        {/* Stats & Sports */}
        <View style={styles.footer}>
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color={Colors.light.ink3} />
              <Text style={styles.statText}>{t('club.membersCount', { count: membersCount })}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.light.ink3} />
              <Text style={styles.statText}>{t('club.eventsCount', { count: eventsCount })}</Text>
            </View>
          </View>

          {/* Action chevron */}
          <View style={styles.actionIcon}>
            <Ionicons name="arrow-forward-outline" size={16} color={AccentColors.bissap} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: Spacing.space16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  myClubCardBorder: {
    borderWidth: 1.5,
    borderColor: '#fce7e7',
  },
  coverContainer: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e6e3da',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.space12,
    right: Spacing.space12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  myClubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AccentColors.bissap,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  myClubText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AccentColors.vertTeranga,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 4,
  },
  verifiedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  logoWrapper: {
    marginTop: -28,
    marginBottom: Spacing.space12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  info: {
    marginBottom: Spacing.space16,
  },
  name: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 2,
  },
  handle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: AccentColors.bissap,
    marginBottom: 8,
  },
  bio: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    lineHeight: 18,
  },
  noBio: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f0',
    paddingTop: Spacing.space12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e3e3e1',
    marginHorizontal: 12,
  },
  statText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f2f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
