import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  hasBadge?: boolean;
  variant?: 'solid' | 'glass' | 'outline' | 'liked' | 'ghost';
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  iconName,
  onPress,
  hasBadge,
  variant = 'solid',
  size = 22,
  style,
}: IconButtonProps) {
  const theme = useTheme();

  const isGlass = variant === 'glass';
  const isOutline = variant === 'outline';
  const isLiked = variant === 'liked';
  const isGhost = variant === 'ghost';

  const getIconColor = () => {
    if (isLiked) return '#ffffff';
    if (isOutline || isGhost) return theme.text;
    if (isGlass) return theme.text;
    return theme.background;
  };

  const getContainerStyle = () => {
    if (isLiked) {
      return { backgroundColor: theme.primary };
    }
    if (isOutline) {
      return {
        backgroundColor: theme.cardBackground,
        borderWidth: 1,
        borderColor: theme.line,
      };
    }
    if (isGhost) {
      return {
        backgroundColor: 'transparent',
        width: 40,
        height: 40,
      };
    }
    if (isGlass) {
      return { backgroundColor: theme.surfaceGhost };
    }
    // solid
    return { backgroundColor: theme.text };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, getContainerStyle(), style]}
    >
      <Ionicons name={iconName} size={size} color={getIconColor()} />
      {hasBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.primary,
              borderColor: isGhost ? theme.background : theme.cardBackground,
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
