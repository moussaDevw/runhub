import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface InfoSquareCardProps {
  label: string;
  value: string;
  subValue?: string;
}

export function InfoSquareCard({ label, value, subValue }: InfoSquareCardProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={2}>{value}</Text>
      </View>
      {subValue ? <Text style={styles.subValue}>{subValue}</Text> : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundElement, // Paper-2
    borderRadius: Radius.card,
    padding: Spacing.space16,
    paddingBottom: Spacing.space12,
    flex: 1, // To share width equally in a row
    minHeight: 110,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 9,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space4,
  },
  value: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 17,
    color: Colors.light.text,
    lineHeight: 20,
  },
  subValue: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 11,
    color: '#65625e',
    marginTop: Spacing.space4,
  },
});
