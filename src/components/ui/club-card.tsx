import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { ClubResponse } from '@/features/clubs/types/clubs.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from './avatar';

interface ClubCardProps {
  club: ClubResponse;
  onPress: () => void;
}

export function ClubCard({ club, onPress }: ClubCardProps) {
  const membersCount = club._count?.members || 0;
  const eventsCount = club._count?.events || 0;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {/* Cover background (with overlay gradient vibe) */}
      <View style={styles.coverContainer}>
        <Image
          source={club.coverUrl ? { uri: club.coverUrl } : require('@/assets/images/bg_home.jpeg')}
          style={styles.coverImage}
          contentFit="cover"
        />
        <View style={styles.verifiedBadgeContainer}>
          {club.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#ffffff" />
              <Text style={styles.verifiedText}>Vérifié</Text>
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
            <Text style={styles.noBio}>Aucune description pour ce club.</Text>
          )}
        </View>

        {/* Stats & Sports */}
        <View style={styles.footer}>
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color={Colors.light.ink3} />
              <Text style={styles.statText}>{membersCount} membres</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.light.ink3} />
              <Text style={styles.statText}>{eventsCount} events</Text>
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
    borderWidth: 1,
    borderColor: '#f0ede9',
  },
  coverContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e6e3de',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
    gap: 4,
  },
  verifiedText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  body: {
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
    paddingTop: 8,
  },
  logoWrapper: {
    marginTop: -36,
    marginBottom: 8,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 99,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    marginBottom: Spacing.space12,
  },
  name: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 2,
  },
  handle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginBottom: Spacing.space8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5f2ee',
    paddingTop: Spacing.space12,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: '#65625e',
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d6d3ce',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fdf0f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
