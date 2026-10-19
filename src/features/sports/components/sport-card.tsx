import { Colors, Radius, Spacing, Typography, NeutralColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SPORT_ICONS } from '../constants';

export interface SportCardProps {
  slug: string;
  label: string;
  color: string;
  isSelected: boolean;
  onToggle: () => void;
}

export { SPORT_ICONS };

export function SportCard({ slug, label, color, isSelected, onToggle }: SportCardProps) {
  const iconName = (SPORT_ICONS[slug] || 'run') as any;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.card,
        { backgroundColor: color || Colors.light.text },
        isSelected && styles.cardSelected,
      ]}
      accessibilityRole="button"
    >
      {/* Icon container */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={NeutralColors.white}
        />
      </View>

      {/* Label */}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {/* Checkmark badge */}
      {isSelected && (
        <View style={styles.checkBadge}>
          <MaterialCommunityIcons name="check" size={12} color={color || Colors.light.text} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.space12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space8,
    position: 'relative',
    opacity: 0.92,
  },
  cardSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: NeutralColors.white,
    shadowColor: NeutralColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    marginLeft: Spacing.space8,
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: NeutralColors.white,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    backgroundColor: NeutralColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.space4,
  },
});
