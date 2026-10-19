import { AccentColors, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabSwitcherProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function TabSwitcher({ options, selectedIndex, onChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            onPress={() => onChange(index)}
            style={styles.tab}
          >
            <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
              {option}
            </Text>
            {isSelected && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
    marginBottom: Spacing.space8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
  },
  tabTextSelected: {
    color: Colors.light.text,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '25%',
    right: '25%',
    height: 2.5,
    backgroundColor: AccentColors.bissap,
    borderRadius: Radius.pill,
  },
});
