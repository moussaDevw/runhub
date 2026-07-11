import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

type ScanState = 'idle' | 'valid' | 'used';

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.65;

export function QrScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [demoToggle, setDemoToggle] = useState(true);

  const handleSimulateScan = () => {
    setScanState(demoToggle ? 'valid' : 'used');
    setDemoToggle(!demoToggle);
  };

  const resetScan = () => {
    setScanState('idle');
  };

  let frameColor: string = AccentColors.bissap;
  if (scanState === 'valid') frameColor = '#2f6b4d';
  if (scanState === 'used') frameColor = '#d98b2b';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, presentation: 'fullScreenModal' }} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Scanner les billets</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="flash-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* SCANNER AREA */}
      <View style={styles.scannerContainer}>
        <View style={[styles.scanFrame, { borderColor: frameColor, width: SCAN_FRAME_SIZE, height: SCAN_FRAME_SIZE }]}>
          <Ionicons name="qr-code" size={SCAN_FRAME_SIZE * 0.7} color="rgba(255,255,255,0.2)" />
        </View>

        <Text style={styles.instructionText}>
          Aligne le QR du participant dans le cadre
        </Text>
      </View>

      {/* BOTTOM AREA */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        
        {scanState === 'idle' && (
          <TouchableOpacity 
            style={styles.simulateButton} 
            activeOpacity={0.8}
            onPress={handleSimulateScan}
          >
            <View style={styles.redDot} />
            <Text style={styles.simulateButtonText}>Simuler un scan</Text>
          </TouchableOpacity>
        )}

        {scanState === 'valid' && (
          <View style={styles.resultSheet}>
            <View style={styles.resultInfoRow}>
              <View style={[styles.resultIconWrapper, { backgroundColor: '#2f6b4d' }]}>
                <Ionicons name="checkmark" size={32} color="#ffffff" />
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultTitle}>Billet valide</Text>
                <Text style={styles.resultSubtitle}>Aïssatou Diallo · Payé · 2 000 F · 5 km</Text>
              </View>
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
                <Text style={styles.secondaryButtonText}>Terminer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#2f6b4d' }]} onPress={resetScan}>
                <Text style={styles.primaryButtonText}>Valider l'entrée</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {scanState === 'used' && (
          <View style={styles.resultSheet}>
            <View style={styles.resultInfoRow}>
              <View style={[styles.resultIconWrapper, { backgroundColor: '#d98b2b' }]}>
                <Ionicons name="time-outline" size={32} color="#ffffff" />
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultTitle}>Déjà utilisé</Text>
                <Text style={styles.resultSubtitle}>Moussa Sow · Déjà scanné à 18:32</Text>
              </View>
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
                <Text style={styles.secondaryButtonText}>Terminer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: AccentColors.bissap }]} onPress={resetScan}>
                <Text style={styles.primaryButtonText}>Scanner le suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151318',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: '#ffffff',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
  },
  scanFrame: {
    borderWidth: 4,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.space32,
    borderStyle: 'solid',
  },
  instructionText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.space24,
    paddingVertical: 16,
    borderRadius: 99,
    marginBottom: Spacing.space24,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AccentColors.bissap,
    marginRight: 10,
  },
  simulateButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  resultSheet: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.space24,
    paddingBottom: 0,
  },
  resultInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space24,
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
