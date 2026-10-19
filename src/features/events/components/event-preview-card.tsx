import { Colors, NeutralColors, Radius, Shadows, Spacing, SportsColors, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface EventPreviewCardProps {
  title: string;
  price: string;
  time: string;
  location: string;
  organizerInitials: string;
  organizerName: string;
  places: string;
  sportLabel?: string;
  sportColor?: string;
  dateLabel?: string;
  timeLabel?: string;
  coverUrl?: string;
}

export function EventPreviewCard({
  title,
  price,
  time,
  location,
  organizerInitials,
  organizerName,
  places,
  sportLabel = 'RUNNING',
  sportColor = SportsColors.running,
  dateLabel = 'MAR',
  timeLabel = '18:30',
  coverUrl,
}: EventPreviewCardProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      {/* HEADER IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={coverUrl ? { uri: coverUrl } : require('@/assets/images/onboarding_bg.png')}
          style={styles.image}
          contentFit="cover"
        />

        {/* Top Left Badge */}
        <View style={styles.sportBadge}>
          <View style={[styles.sportDot, { backgroundColor: sportColor }]} />
          <Text style={styles.sportText}>{sportLabel.toUpperCase()}</Text>
        </View>

        {/* Top Right Heart */}
        <View style={styles.heartIcon}>
          <Ionicons name="heart-outline" size={20} color={NeutralColors.white} />
        </View>

        {/* Bottom Left Date/Time Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{dateLabel.toUpperCase()}</Text>
          <Text style={styles.timeText}>{timeLabel}</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={Colors.light.ink3} />
          <Text style={styles.infoText}>{time}</Text>
          <Text style={styles.infoDot}>·</Text>
          <Ionicons name="location-outline" size={14} color={Colors.light.ink3} />
          <Text style={[styles.infoText, { flexShrink: 1 }]} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.organizerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{organizerInitials}</Text>
          </View>
          <Text style={styles.organizerText}>
            {t('creation.organizedBy')} <Text style={styles.organizerName}>{organizerName}</Text> · {places} {t('creation.places')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
    padding: Spacing.space16,
    marginBottom: Spacing.space24,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.card,
  },
  imageContainer: {
    height: 180,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.space16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sportBadge: {
    position: 'absolute',
    top: Spacing.space12,
    left: Spacing.space12,
    backgroundColor: NeutralColors.overlay30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: SportsColors.running,
    marginRight: 6,
  },
  sportText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: NeutralColors.white,
    letterSpacing: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: Spacing.space12,
    right: Spacing.space12,
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: NeutralColors.overlay30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadge: {
    position: 'absolute',
    bottom: Spacing.space12,
    left: Spacing.space12,
    backgroundColor: NeutralColors.overlay60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    gap: 8,
  },
  dateText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: NeutralColors.white,
  },
  timeText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: NeutralColors.white,
  },
  content: {
    gap: Spacing.space12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
    flex: 1,
  },
  price: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.space12,
    marginTop: Spacing.space4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: Spacing.space4,
  },
  infoDot: {
    color: Colors.light.ink3,
    marginHorizontal: Spacing.space8,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.space4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    backgroundColor: SportsColors.yoga,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space8,
  },
  avatarText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: NeutralColors.white,
  },
  organizerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  organizerName: {
    fontFamily: Typography.corpsGras.fontFamily,
    color: Colors.light.text,
  },
});

