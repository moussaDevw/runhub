import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

interface EventPreviewCardProps {
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
  sportColor = '#f2784f',
  dateLabel = 'MAR',
  timeLabel = '18:30',
}: EventPreviewCardProps) {
  return (
    <View style={styles.card}>
      {/* HEADER IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/onboarding_bg.png')}
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
          <Ionicons name="heart-outline" size={20} color="#ffffff" />
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
          <Text style={styles.infoText}>{location}</Text>
        </View>

        <View style={styles.organizerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{organizerInitials}</Text>
          </View>
          <Text style={styles.organizerText}>
            Organisé par <Text style={styles.organizerName}>{organizerName}</Text> · {places} places
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.space16,
    marginBottom: Spacing.space24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 180,
    borderRadius: 16,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f2784f',
    marginRight: 6,
  },
  sportText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: Spacing.space12,
    right: Spacing.space12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadge: {
    position: 'absolute',
    bottom: Spacing.space12,
    left: Spacing.space12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 8,
  },
  dateText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: '#ffffff',
  },
  timeText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: '#ffffff',
  },
  content: {
    gap: 12,
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
    color: '#65625e',
    marginLeft: 12,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: 4,
  },
  infoDot: {
    color: Colors.light.ink3,
    marginHorizontal: 8,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#b78ad6', // purple from sport colors
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: '#ffffff',
  },
  organizerText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
  },
  organizerName: {
    fontFamily: Typography.corpsGras.fontFamily,
    color: Colors.light.text,
  },
});
