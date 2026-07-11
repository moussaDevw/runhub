import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  Radius, Spacing, Typography, BackgroundThemes, AccentColors } from '@/constants/theme';
import { AvatarGroup } from './avatar';
import { useFavorites } from '@/context/FavoritesContext';

export interface EventCardProps {
  id?: string;
  title: string;
  price: string;
  time: string;
  location: string;
  distance?: string;
  participants: Array<{ id: string; initials: string; bgColor: string }>;
  totalPlaces: number;
  sportLabel: string;
  sportColor: string;
  badgeTime: string;
  imageSource: any; // e.g. require('@/assets/images/bg_home.jpeg')
  style?: ViewStyle;
  onPress?: () => void;
}

export function EventCard({
  id,
  title,
  price,
  time,
  location,
  distance,
  participants,
  totalPlaces,
  sportLabel,
  sportColor,
  badgeTime,
  imageSource,
  style,
  onPress,
}: EventCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = id ? isFavorite(id) : false;

  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container activeOpacity={0.9} onPress={onPress} style={[styles.container, style]}>
      {/* Upper Image Section */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={StyleSheet.absoluteFill} contentFit="cover" />
        
        {/* Top Left Sport Badge */}
        <View style={styles.sportBadge}>
          <View style={[styles.sportDot, { backgroundColor: sportColor }]} />
          <Text style={styles.sportBadgeText}>{sportLabel}</Text>
        </View>

        {/* Top Right Like Button */}
        <TouchableOpacity 
          style={[styles.likeButton, liked && { backgroundColor: AccentColors.bissap }]} 
          onPress={() => id && toggleFavorite(id)}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color="#ffffff" />
        </TouchableOpacity>

        {/* Bottom Left Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{badgeTime}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Title and Price */}
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        {/* Sub Info Row */}
        <View style={styles.subInfoRow}>
          <Ionicons name="time-outline" size={14} color={Colors.light.ink3} />
          <Text style={styles.subInfoText}>{time}</Text>

          <Ionicons name="location-outline" size={14} color={Colors.light.ink3} style={{ marginLeft: Spacing.space12 }} />
          <Text style={styles.subInfoText}>{location}</Text>

          {distance && (
            <Text style={styles.distanceText}>{distance}</Text>
          )}
        </View>

        {/* Participants Row */}
        <View style={styles.participantsRow}>
          <View style={styles.avatarRow}>
            <AvatarGroup users={participants} max={4} size={26} />
            <Text style={styles.participateText}>participent</Text>
          </View>
          <Text style={styles.placesText}>
            <Text style={styles.placesBold}>{participants.length}</Text>
            /{totalPlaces} places
          </Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundThemes.Creme, // Matches feed background, blending
    marginBottom: Spacing.space26,
  },
  imageContainer: {
    height: 180,
    borderRadius: Radius.card,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.space12,
  },
  sportBadge: {
    position: 'absolute',
    top: Spacing.space12,
    left: Spacing.space12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 22, 28, 0.4)', // Dark semi-transparent
    paddingHorizontal: Spacing.space12,
    paddingVertical: Spacing.space4,
    borderRadius: Radius.pill,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  sportBadgeText: {
    color: '#ffffff',
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  likeButton: {
    position: 'absolute',
    top: Spacing.space12,
    right: Spacing.space12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(29, 22, 28, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadge: {
    position: 'absolute',
    bottom: Spacing.space12,
    left: Spacing.space12,
    backgroundColor: 'rgba(29, 22, 28, 0.6)',
    paddingHorizontal: Spacing.space12,
    paddingVertical: Spacing.space4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateBadgeText: {
    color: '#ffffff',
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  detailsContainer: {
    paddingHorizontal: Spacing.space4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space4,
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
  },
  price: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space12,
  },
  subInfoText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    marginLeft: 4,
  },
  distanceText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: '#b8324f', // bissap
    marginLeft: Spacing.space12,
  },
  participantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participateText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
    marginLeft: Spacing.space12,
  },
  placesText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
  },
  placesBold: {
    color: Colors.light.text,
    fontWeight: '700',
  },
});
