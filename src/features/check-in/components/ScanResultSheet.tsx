import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { CheckInScanResult } from '@/features/events/api/events.api';
import { ScanState } from '../hooks/useQrScannerScreen';

export interface ScanResultSheetProps {
  scanState: ScanState;
  scanResult: CheckInScanResult | null;
  participantName: string;
  priceText: string;
  errorMessage: string;
  onOpenManualEntry: () => void;
  onResetScan: () => void;
  onBack: () => void;
  insetsBottom?: number;
}

export function ScanResultSheet({
  scanState,
  scanResult,
  participantName,
  priceText,
  errorMessage,
  onOpenManualEntry,
  onResetScan,
  onBack,
  insetsBottom = 0,
}: ScanResultSheetProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.bottomArea, { paddingBottom: Math.max(insetsBottom, 24) }]}>
      {/* IDLE / MANUAL ENTRY BUTTON */}
      {scanState === 'idle' && (
        <View style={styles.idleButtonsRow}>
          <TouchableOpacity
            style={styles.manualEntryButton}
            activeOpacity={0.8}
            onPress={onOpenManualEntry}
          >
            <Ionicons name="keypad-outline" size={18} color={Colors.light.text} style={{ marginRight: 8 }} />
            <Text style={styles.manualEntryButtonText}>{t('checkIn.enterCode')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VALID SHEET */}
      {scanState === 'valid' && (
        <View style={styles.resultSheet}>
          <View style={styles.resultInfoRow}>
            <View style={[styles.resultIconWrapper, { backgroundColor: '#2f6b4d' }]}>
              <Ionicons name="checkmark" size={32} color="#ffffff" />
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{t('checkIn.validTicket')}</Text>
              <Text style={styles.resultSubtitle}>
                {participantName} · {priceText} · Code : {scanResult?.registration?.ticketCode}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
              <Text style={styles.secondaryButtonText}>{t('checkIn.finish')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#2f6b4d' }]}
              onPress={onResetScan}
            >
              <Text style={styles.primaryButtonText}>{t('checkIn.scanNext')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ALREADY USED SHEET */}
      {scanState === 'used' && (
        <View style={styles.resultSheet}>
          <View style={styles.resultInfoRow}>
            <View style={[styles.resultIconWrapper, { backgroundColor: '#d98b2b' }]}>
              <Ionicons name="time-outline" size={32} color="#ffffff" />
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{t('checkIn.alreadyUsed')}</Text>
              <Text style={styles.resultSubtitle}>
                {t('checkIn.alreadyUsedDesc', { name: participantName })}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
              <Text style={styles.secondaryButtonText}>{t('checkIn.finish')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#d98b2b' }]}
              onPress={onResetScan}
            >
              <Text style={styles.primaryButtonText}>{t('checkIn.scanNext')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* INVALID SHEET */}
      {scanState === 'invalid' && (
        <View style={styles.resultSheet}>
          <View style={styles.resultInfoRow}>
            <View style={[styles.resultIconWrapper, { backgroundColor: AccentColors.bissap }]}>
              <Ionicons name="alert-circle" size={32} color="#ffffff" />
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{t('checkIn.invalidTicket')}</Text>
              <Text style={styles.resultSubtitle} numberOfLines={2}>
                {errorMessage || t('checkIn.invalidTicketDesc')}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
              <Text style={styles.secondaryButtonText}>{t('checkIn.finish')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: AccentColors.bissap }]}
              onPress={onResetScan}
            >
              <Text style={styles.primaryButtonText}>{t('checkIn.retry')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  idleButtonsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.space24,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.space24,
    paddingVertical: 14,
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  manualEntryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  resultSheet: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.space24,
    paddingBottom: Spacing.space12,
  },
  resultInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space20,
  },
  resultIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: '#65625e',
  },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  primaryButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
});
