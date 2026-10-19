import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

export function EventCardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Image Skeleton */}
      <Skeleton height={180} borderRadius={0} style={styles.image} />

      <View style={styles.detailsContainer}>
        {/* Title & Price */}
        <View style={styles.rowBetween}>
          <Skeleton width="60%" height={22} borderRadius={Radius.xs} />
          <Skeleton width="20%" height={18} borderRadius={Radius.xs} />
        </View>

        {/* Sub Info Row */}
        <View style={styles.subInfoRow}>
          <Skeleton width="30%" height={14} borderRadius={Radius.xs} />
          <Skeleton width="40%" height={14} borderRadius={Radius.xs} style={{ marginLeft: Spacing.space12 }} />
        </View>

        {/* Participants Row */}
        <View style={styles.participantsRow}>
          <View style={styles.avatarRow}>
            <Skeleton width={26} height={26} borderRadius={Radius.pill} />
            <Skeleton width={26} height={26} borderRadius={Radius.pill} style={{ marginLeft: -8 }} />
            <Skeleton width={26} height={26} borderRadius={Radius.pill} style={{ marginLeft: -8 }} />
            <Skeleton width={80} height={14} borderRadius={Radius.xs} style={{ marginLeft: Spacing.space12 }} />
          </View>
          <Skeleton width={60} height={14} borderRadius={Radius.xs} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
    marginBottom: Spacing.space16,
    overflow: 'hidden',
    ...Shadows.card,
    paddingBottom: Spacing.space16,
  },
  image: {
    width: '100%',
    marginBottom: Spacing.space12,
  },
  detailsContainer: {
    paddingHorizontal: Spacing.space16,
    gap: Spacing.space12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.space4,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
