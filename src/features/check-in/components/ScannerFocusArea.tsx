import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Spacing, Typography } from '@/constants/theme';
import { ScanState } from '../hooks/useQrScannerScreen';

const { width } = Dimensions.get('window');
export const SCAN_FRAME_SIZE = width * 0.68;

export interface ScannerFocusAreaProps {
  scanState: ScanState;
  frameColor: string;
}

export function ScannerFocusArea({ scanState, frameColor }: ScannerFocusAreaProps) {
  return (
    <View style={styles.scannerContainer}>
      <View
        style={[
          styles.scanFrame,
          { borderColor: frameColor, width: SCAN_FRAME_SIZE, height: SCAN_FRAME_SIZE },
        ]}
      >
        {scanState === 'scanning' ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <Ionicons name="qr-code" size={SCAN_FRAME_SIZE * 0.65} color="rgba(255,255,255,0.25)" />
        )}
      </View>

      <Text style={styles.instructionText}>
        {scanState === 'scanning'
          ? 'Vérification du billet en cours...'
          : 'Aligne le QR code du participant dans le cadre'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  scanFrame: {
    borderWidth: 4,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  instructionText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: Spacing.space32,
    opacity: 0.85,
  },
});
