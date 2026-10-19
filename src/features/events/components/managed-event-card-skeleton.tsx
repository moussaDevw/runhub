import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

export function ManagedEventCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Top info */}
      <View style={styles.topSection}>
        <Skeleton width={60} height={60} borderRadius={Radius.sm} />
        <View style={styles.infoContainer}>
          <View style={styles.dateStatusRow}>
            <Skeleton width="40%" height={12} borderRadius={Radius.xs} />
            <Skeleton width="25%" height={16} borderRadius={Radius.pill} />
          </View>
          <Skeleton width="70%" height={16} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
          <Skeleton width="50%" height={12} borderRadius={Radius.xs} />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width="40%" height={10} borderRadius={Radius.xs} />
          <Skeleton width="60%" height={16} borderRadius={Radius.xs} />
        </View>
        <View style={styles.verticalDivider} />
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width="40%" height={10} borderRadius={Radius.xs} />
          <Skeleton width="60%" height={16} borderRadius={Radius.xs} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actionsSection}>
        <Skeleton width="48%" height={40} borderRadius={Radius.sm} />
        <Skeleton width="48%" height={40} borderRadius={Radius.sm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.card,
    padding: Spacing.space16,
    marginBottom: Spacing.space16,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.card,
  },
  topSection: {
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.space12,
    justifyContent: 'center',
  },
  dateStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.backgroundElement,
    marginVertical: Spacing.space12,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space16,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.backgroundElement,
    marginHorizontal: Spacing.space16,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
