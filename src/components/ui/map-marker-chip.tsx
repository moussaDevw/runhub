import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

interface MapMarkerChipProps {
  label: string;
  dotColor: string;
  isActive?: boolean;
  onPress?: () => void;
  style?: object;
}

export function MapMarkerChip({ label, dotColor, isActive, onPress, style }: MapMarkerChipProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container, 
        isActive && { shadowColor: dotColor, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
        style
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: Colors.light.text,
  },
});
