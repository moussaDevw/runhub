import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function SportCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={32} height={32} borderRadius={Radius.pill} />
      <Skeleton width="60%" height={14} borderRadius={Radius.xs} style={{ marginLeft: Spacing.space8, flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.space12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.line,
    marginBottom: Spacing.space8,
  },
});
