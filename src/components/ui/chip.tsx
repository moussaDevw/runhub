import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';

interface ChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function Chip({ label, isActive, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          isActive ? styles.activeText : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    paddingHorizontal: Spacing.space16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space8,
  },
  activeContainer: {
    backgroundColor: '#232220', // Ink
  },
  inactiveContainer: {
    backgroundColor: '#ffffff', // Ivoire / White
    borderWidth: 1,
    borderColor: '#e3e2df', // Line
  },
  text: {
    fontFamily: Typography.meta.fontFamily, // Actually it looks like bold/medium sans
    fontSize: 14,
  },
  activeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#65625e', // Ink-2
    fontWeight: '500',
  },
});
