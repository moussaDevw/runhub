import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  AccentColors, Radius, Spacing, Typography } from '@/constants/theme';

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
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
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
      <TouchableOpacity style={styles.heartButton} onPress={onUnlike}>
        <Ionicons name="heart" size={18} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space12,
    paddingHorizontal: Spacing.space20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4', // very subtle separator
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
    top: 6,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AccentColors.bissap, // red dot on image
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
    marginBottom: 4,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: 4,
    flexShrink: 1, // Allow truncation if long
    marginRight: Spacing.space8,
  },
  priceText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: AccentColors.bissap, // Gratuit is red
    fontWeight: '700',
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
