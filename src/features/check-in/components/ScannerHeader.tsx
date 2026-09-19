import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AccentColors, Spacing, Typography } from '@/constants/theme';

export interface ScannerHeaderProps {
  continuousScan: boolean;
  torchEnabled: boolean;
  onToggleContinuousScan: () => void;
  onToggleTorch: () => void;
  onBack: () => void;
  insetsTop?: number;
}

export function ScannerHeader({
  continuousScan,
  torchEnabled,
  onToggleContinuousScan,
  onToggleTorch,
  onBack,
  insetsTop = 0,
}: ScannerHeaderProps) {
  return (
    <>
      <View style={[styles.header, { paddingTop: Math.max(insetsTop, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Scanner les billets</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, continuousScan && styles.iconButtonActive, { marginRight: 8 }]}
            onPress={onToggleContinuousScan}
          >
            <Ionicons name={continuousScan ? 'infinite' : 'infinite-outline'} size={22} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, torchEnabled && styles.iconButtonActive]}
            onPress={onToggleTorch}
          >
            <Ionicons name={torchEnabled ? 'flash' : 'flash-outline'} size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {continuousScan && (
        <View style={styles.continuousBadge}>
          <Ionicons name="infinite" size={14} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.continuousBadgeText}>Mode continu actif (réarmement auto)</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continuousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2f6b4d',
    paddingHorizontal: Spacing.space12,
    paddingVertical: 4,
    borderRadius: 99,
    marginTop: -8,
    marginBottom: 8,
    zIndex: 10,
  },
  continuousBadgeText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: '#ffffff',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: AccentColors.bissap,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: '#ffffff',
  },
});
