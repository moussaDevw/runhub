import { View, Text, StyleSheet } from 'react-native';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

interface CheckInProgressProps {
  current: number;
  total: number;
}

export function CheckInProgress({ current, total }: CheckInProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <View style={styles.leftTextGroup}>
          <Text style={styles.currentText}>{current}</Text>
          <Text style={styles.totalText}> / {total} arrivés</Text>
        </View>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
      
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.space16,
    paddingHorizontal: Spacing.space20,
    backgroundColor: '#f5f5f4', // matching the header area background
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.space12,
  },
  leftTextGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentText: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 28,
    color: Colors.light.text,
  },
  totalText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.ink3,
  },
  percentageText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.text,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e3e3e1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AccentColors.bissap,
    borderRadius: 4,
  },
});
