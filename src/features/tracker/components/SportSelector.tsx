import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivitySport, SportOption } from '../types/tracker.types';

interface SportSelectorProps {
  selectedSport: ActivitySport;
  onSelect: (sport: ActivitySport) => void;
  disabled?: boolean;
}

export const SPORT_OPTIONS: SportOption[] = [
  {
    key: 'running',
    labelFr: 'Course',
    icon: 'run',
    color: AccentColors.bissap,
    caloriesFactor: 1.05,
  },
  {
    key: 'walking',
    labelFr: 'Marche',
    icon: 'walk',
    color: '#ca8a04',
    caloriesFactor: 0.75,
  },
  {
    key: 'trail',
    labelFr: 'Trail',
    icon: 'pine-tree',
    color: '#15803d',
    caloriesFactor: 1.15,
  },
  {
    key: 'cycling',
    labelFr: 'Vélo',
    icon: 'bike',
    color: '#0284c7',
    caloriesFactor: 0.45,
  },
];

export function SportSelector({
  selectedSport,
  onSelect,
  disabled = false,
}: SportSelectorProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SPORT_OPTIONS.map((sport) => {
          const isSelected = selectedSport === sport.key;
          return (
            <TouchableOpacity
              key={sport.key}
              activeOpacity={0.8}
              disabled={disabled}
              onPress={() => onSelect(sport.key)}
              style={[
                styles.optionChip,
                isSelected && styles.optionChipSelected,
                isSelected && { borderColor: sport.color },
              ]}
            >
              <MaterialCommunityIcons
                name={sport.icon as any}
                size={18}
                color={isSelected ? sport.color : Colors.light.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                  isSelected && { color: sport.color },
                ]}
              >
                {t(`tracker.sports.${sport.key}`, { defaultValue: sport.labelFr })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: Spacing.space16,
    paddingVertical: Spacing.space8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionChipSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  optionLabelSelected: {
    fontFamily: Typography.corpsGras.fontFamily,
  },
});
