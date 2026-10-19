import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function TicketDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* TICKET CARD SKELETON */}
      <View style={styles.ticketWrapper}>
        {/* Top Half Image */}
        <Skeleton width="100%" height={160} borderRadius={0} />

        {/* Top Half Details */}
        <View style={styles.ticketDetails}>
          <Skeleton width="75%" height={24} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space16 }} />

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Skeleton width={50} height={12} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
              <Skeleton width={100} height={16} borderRadius={Radius.xs} />
            </View>
            <View style={styles.infoCol}>
              <Skeleton width={50} height={12} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
              <Skeleton width={90} height={16} borderRadius={Radius.xs} />
            </View>
          </View>
        </View>

        {/* Separator Cutouts */}
        <View style={styles.separatorContainer}>
          <View style={styles.leftCutout} />
          <View style={styles.dashedLine} />
          <View style={styles.rightCutout} />
        </View>

        {/* Bottom Half */}
        <View style={styles.ticketBottom}>
          <Skeleton width={140} height={18} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space20 }} />

          {/* QR Code Placeholder */}
          <Skeleton width={160} height={160} borderRadius={Radius.md} style={{ marginBottom: Spacing.space20 }} />

          {/* Manual Code Box */}
          <Skeleton width="100%" height={56} borderRadius={Radius.md} style={{ marginBottom: Spacing.space16 }} />

          <Skeleton width="80%" height={12} borderRadius={Radius.xs} />
        </View>
      </View>

      {/* BOTTOM ACTIONS SKELETON */}
      <View style={styles.actionsRow}>
        <Skeleton width="48%" height={48} borderRadius={Radius.sm} />
        <Skeleton width="48%" height={48} borderRadius={Radius.sm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space20,
  },
  ticketWrapper: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.lg,
    marginBottom: Spacing.space24,
    overflow: 'hidden',
  },
  ticketDetails: {
    padding: Spacing.space20,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoCol: {
    flex: 1,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    position: 'relative',
  },
  leftCutout: {
    position: 'absolute',
    left: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    zIndex: 10,
  },
  rightCutout: {
    position: 'absolute',
    right: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    zIndex: 10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  ticketBottom: {
    alignItems: 'center',
    padding: Spacing.space32,
    paddingTop: Spacing.space12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
