import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Spacing } from '@/constants/theme';

export function ParticipantRowSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={48} height={48} borderRadius={Radius.pill} />

      <View style={styles.textContainer}>
        <Skeleton width="60%" height={16} borderRadius={Radius.xs} style={{ marginBottom: Spacing.space4 }} />
        <Skeleton width="40%" height={12} borderRadius={Radius.xs} />
      </View>

      <Skeleton width={70} height={32} borderRadius={Radius.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.space12,
    marginRight: Spacing.space12,
  },
});
