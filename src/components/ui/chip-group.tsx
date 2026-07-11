import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Chip } from './chip';
import { Spacing } from '@/constants/theme';

interface ChipGroupProps {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function ChipGroup({ options, activeOption, onSelect, style }: ChipGroupProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <View key={option} style={styles.chipWrapper}>
          <Chip
            label={option}
            isActive={activeOption === option}
            onPress={() => onSelect(option)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // We use negative margin trick or rely on Chip's right margin
    marginRight: -Spacing.space8, 
  },
  chipWrapper: {
    marginBottom: Spacing.space12,
  },
});
