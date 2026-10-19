import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function EventDetailSkeleton() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Cover Skeleton */}
        <Skeleton height={280} borderRadius={0} style={styles.headerImage} />

        <View style={styles.body}>
          {/* Tag & Title */}
          <Skeleton width={80} height={24} borderRadius={Radius.pill} style={{ marginBottom: Spacing.space12 }} />
          <Skeleton width="85%" height={32} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space16 }} />

          {/* Info Cards Grid */}
          <View style={styles.grid}>
            <Skeleton width="48%" height={80} borderRadius={Radius.card} />
            <Skeleton width="48%" height={80} borderRadius={Radius.card} />
          </View>

          {/* Organizer Row */}
          <View style={styles.organizerRow}>
            <Skeleton width={48} height={48} borderRadius={Radius.pill} />
            <View style={{ marginLeft: Spacing.space12, flex: 1, gap: Spacing.space8 }}>
              <Skeleton width="50%" height={16} borderRadius={Radius.xs} />
              <Skeleton width="30%" height={12} borderRadius={Radius.xs} />
            </View>
          </View>

          {/* Description Block */}
          <View style={styles.section}>
            <Skeleton width="40%" height={18} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space12 }} />
            <Skeleton width="100%" height={14} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
            <Skeleton width="95%" height={14} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space8 }} />
            <Skeleton width="70%" height={14} borderRadius={Radius.xs} />
          </View>

          {/* Map Preview Block */}
          <View style={styles.section}>
            <Skeleton width="40%" height={18} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space12 }} />
            <Skeleton width="100%" height={140} borderRadius={Radius.card} />
          </View>
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
  headerImage: {
    width: '100%',
  },
  body: {
    padding: Spacing.space20,
    marginTop: -20,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.space24,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.space16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.card,
    marginBottom: Spacing.space24,
  },
  section: {
    marginBottom: Spacing.space24,
  },
});
