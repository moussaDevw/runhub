import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({
  options,
  selectedIndex,
  onChange,
}: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
      ]}
    >
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => onChange(index)}
            style={[
              styles.segment,
              isSelected && [
                styles.segmentSelected,
                { backgroundColor: theme.cardBackground },
              ],
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isSelected ? theme.text : theme.ink3,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: 3,
    marginBottom: Spacing.space12,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  segmentSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
  },
});
