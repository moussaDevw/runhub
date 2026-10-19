import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function ClubDetailSkeleton() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover */}
        <Skeleton height={200} borderRadius={0} style={styles.cover} />

        <View style={styles.body}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Skeleton width={80} height={80} borderRadius={Radius.lg} />
          </View>

          {/* Club Info */}
          <Skeleton width="60%" height={28} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
          <Skeleton width="30%" height={16} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space16 }} />
          <Skeleton width="100%" height={14} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
          <Skeleton width="80%" height={14} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space24 }} />

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <Skeleton width="45%" height={40} borderRadius={Radius.sm} />
            <Skeleton width="45%" height={40} borderRadius={Radius.sm} />
          </View>

          {/* Events Section Title */}
          <Skeleton width="40%" height={20} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space16 }} />

          {/* Event Rows */}
          <Skeleton width="100%" height={68} borderRadius={Radius.md} style={{ marginBottom: Spacing.space12 }} />
          <Skeleton width="100%" height={68} borderRadius={Radius.md} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cover: {
    width: '100%',
  },
  body: {
    paddingHorizontal: Spacing.space20,
    backgroundColor: Colors.light.background,
  },
  logoWrapper: {
    marginTop: -40,
    marginBottom: Spacing.space16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.space24,
  },
});
