import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, AccentColors, Radius, Spacing, Typography, NeutralColors, Shadows } from '@/constants/theme';

export interface FavoriteItemProps {
  title: string;
  time: string;
  location: string;
  price: string;
  imageSource: any;
  onPress?: () => void;
  onUnlike?: () => void;
}

export function FavoriteItem({
  title,
  time,
  location,
  price,
  imageSource,
  onPress,
  onUnlike,
}: FavoriteItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container} accessibilityRole="button">
      {/* Left Image */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} contentFit="cover" />
        <View style={styles.dotBadge} />
      </View>

      {/* Center Content */}
      <View style={styles.content}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.light.ink3} />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      </View>

      {/* Right Action (Unlike) */}
      <TouchableOpacity style={styles.heartButton} onPress={onUnlike} accessibilityRole="button" hitSlop={8}>
        <Ionicons name="heart" size={18} color={NeutralColors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    padding: Spacing.space12,
    marginHorizontal: Spacing.space20,
    marginBottom: Spacing.space12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.sm,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.card,
    overflow: 'hidden',
    position: 'relative',
    marginRight: Spacing.space16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotBadge: {
    position: 'absolute',
    top: Spacing.space4 + 2,
    left: Spacing.space4 + 2,
    width: Spacing.space8,
    height: Spacing.space8,
    borderRadius: Radius.pill,
    backgroundColor: AccentColors.bissap,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Spacing.space12,
  },
  timeText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.space4,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: Spacing.space4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    flex: 1,
  },
  priceText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '700',
    marginLeft: Spacing.space8,
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

