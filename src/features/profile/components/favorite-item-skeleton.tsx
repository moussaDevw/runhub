import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

export function FavoriteItemSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={64} height={64} borderRadius={Radius.card} style={styles.image} />

      <View style={styles.content}>
        <Skeleton width="30%" height={10} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
        <Skeleton width="70%" height={16} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
        <Skeleton width="50%" height={12} borderRadius={Radius.xs} />
      </View>

      <Skeleton width={32} height={32} borderRadius={Radius.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    padding: Spacing.space12,
    marginHorizontal: Spacing.space20,
    marginBottom: Spacing.space12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.sm,
  },
  image: {
    marginRight: Spacing.space16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Spacing.space12,
  },
});
