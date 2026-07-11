import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography } from '@/constants/theme';

interface FeatureCheckItemProps {
  label: string;
}

export function FeatureCheckItem({ label }: FeatureCheckItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark" size={14} color="#ffffff" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space16,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2f6b4d', // Green
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
  },
  label: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#65625e',
  },
});
