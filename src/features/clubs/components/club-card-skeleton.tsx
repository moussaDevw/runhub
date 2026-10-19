import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

export function ClubCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Cover */}
      <Skeleton height={110} borderRadius={0} style={styles.cover} />

      <View style={styles.body}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Skeleton width={56} height={56} borderRadius={Radius.md} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Skeleton width="50%" height={20} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
          <Skeleton width="30%" height={14} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
          <Skeleton width="90%" height={14} borderRadius={Radius.xs} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Skeleton width={80} height={14} borderRadius={Radius.xs} />
          <Skeleton width={80} height={14} borderRadius={Radius.xs} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
    marginBottom: Spacing.space16,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cover: {
    width: '100%',
  },
  body: {
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  logoWrapper: {
    marginTop: -28,
    marginBottom: Spacing.space12,
  },
  info: {
    marginBottom: Spacing.space16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.space12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.line,
  },
});
