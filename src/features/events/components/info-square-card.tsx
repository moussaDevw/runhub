import { View, Text, StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InfoSquareCardProps {
  label: string;
  value: string;
  subValue?: string;
}

export function InfoSquareCard({ label, value, subValue }: InfoSquareCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <View>
        <Text style={[styles.label, { color: theme.ink3 }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.text }]} numberOfLines={2}>{value}</Text>
      </View>
      {subValue ? <Text style={[styles.subValue, { color: theme.textSecondary }]}>{subValue}</Text> : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space4,
  },
  value: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 17,
    lineHeight: 20,
  },
  subValue: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 11,
    marginTop: Spacing.space4,
  },
});

