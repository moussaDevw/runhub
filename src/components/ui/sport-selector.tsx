import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export interface SportOption {
  id: string;
  name: string;
  color: string;
}

interface SportSelectorProps {
  options: SportOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SportSelector({ options, selectedId, onSelect }: SportSelectorProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        
        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => onSelect(option.id)}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected
            ]}
          >
            <View style={[styles.dot, { backgroundColor: option.color }]} />
            <Text style={[
              styles.chipText,
              isSelected ? styles.textSelected : styles.textUnselected
            ]}>
              {option.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -Spacing.space20,
    marginBottom: Spacing.space24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space16,
    paddingVertical: 12,
    borderRadius: 99,
  },
  chipUnselected: {
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    backgroundColor: Colors.light.text, // Almost black
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chipText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
  },
  textUnselected: {
    color: '#65625e',
  },
  textSelected: {
    color: '#ffffff',
  },
});
