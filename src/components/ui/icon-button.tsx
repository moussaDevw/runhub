import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  Radius, AccentColors } from '@/constants/theme';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  hasBadge?: boolean;
  variant?: 'solid' | 'glass' | 'outline' | 'liked';
}

export function IconButton({ iconName, onPress, hasBadge, variant = 'solid' }: IconButtonProps) {
  const isGlass = variant === 'glass';
  const isOutline = variant === 'outline';
  const isLiked = variant === 'liked';
  
  const getIconColor = () => {
    if (isOutline) return Colors.light.text;
    return '#ffffff';
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[
        styles.container, 
        isGlass && styles.glassContainer,
        isOutline && styles.outlineContainer,
        isLiked && styles.likedContainer,
      ]}
    >
      <Ionicons name={iconName} size={22} color={getIconColor()} />
      {hasBadge && <View style={[styles.badge, isOutline && styles.badgeOutline]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: '#232220', // Ink
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glassContainer: {
    backgroundColor: 'rgba(35, 34, 32, 0.4)', // Semi-transparent ink
  },
  outlineContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  likedContainer: {
    backgroundColor: AccentColors.bissap,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AccentColors.bissap, // Red notification dot
    borderWidth: 1.5,
    borderColor: '#232220', // Same as container background to cut it out
  },
  badgeOutline: {
    borderColor: '#ffffff',
  },
});
