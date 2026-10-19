import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, AccentColors, Spacing, Typography, Radius, NeutralColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

export interface ManageEventsCardProps {
  count: number;
  onPress?: () => void;
}

export function ManageEventsCard({ count, onPress }: ManageEventsCardProps) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container} accessibilityRole="button">
      {/* Icon Area */}
      <View style={styles.iconWrapper}>
        <Ionicons name="menu" size={20} color={NeutralColors.white} />
      </View>
      
      {/* Text Area */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('manageEvents.title')}</Text>
        <Text style={styles.subtitle}>{t('manageEvents.subtitle')}</Text>
      </View>
      
      {/* Right Area */}
      <Text style={styles.count}>{count}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.light.ink3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space16,
    marginBottom: Spacing.space24,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  count: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: AccentColors.bissap,
    marginRight: Spacing.space8,
  },
});

