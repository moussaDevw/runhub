import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Stack, useFocusEffect } from 'expo-router';
import { ManualCodeModal } from '../components/ManualCodeModal';
import { ScannerCamera } from '../components/ScannerCamera';
import { ScannerFocusArea } from '../components/ScannerFocusArea';
import { ScannerHeader } from '../components/ScannerHeader';
import { ScannerPermissionView } from '../components/ScannerPermissionView';
import { ScanResultSheet } from '../components/ScanResultSheet';
import { useQrScannerScreen } from '../hooks/useQrScannerScreen';

export function QrScannerScreen() {
  const insets = useSafeAreaInsets();

  // isFocused contrôle si ScannerCamera est dans l'arbre React.
  // useFocusEffect garantit la synchronisation avec les événements de navigation Expo Router.
  // Voir ScannerCamera.tsx pour le détail du pourquoi.
  const [isFocused, setIsFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const {
    permission,
    torchEnabled,
    toggleTorch,
    continuousScan,
    toggleContinuousScan,
    scanState,
    scanResult,
    errorMessage,
    isManualModalVisible,
    setIsManualModalVisible,
    manualCodeInput,
    setManualCodeInput,
    frameColor,
    participantName,
    priceText,
    handleRequestPermission,
    handleBarcodeScanned,
    handleManualSubmit,
    handleCloseModal,
    resetScan,
    handleBack,
  } = useQrScannerScreen();

  // Stack.Screen rendu inconditionnellement — évite les re-configurations de layout Expo Router.
  const stackScreen = <Stack.Screen options={{ headerShown: false, presentation: 'fullScreenModal' }} />;

  // Permission en cours de chargement — écran stable (jamais return null)
  if (!permission) {
    return <View style={styles.container}>{stackScreen}</View>;
  }

  // Permission refusée — affiche la vue de demande
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        {stackScreen}
        <ScannerPermissionView
          canAskAgain={permission.canAskAgain}
          onRequestPermission={handleRequestPermission}
          onOpenManualEntry={() => setIsManualModalVisible(true)}
          onBack={handleBack}
          insetsTop={insets.top}
        />
      </View>
    );
  }

  // Permission accordée — interface de scan
  return (
    <View style={styles.container}>
      {stackScreen}

      {isFocused && (
        <ScannerCamera
          torchEnabled={torchEnabled}
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}

      <View style={styles.overlayTint} />

      <ScannerHeader
        continuousScan={continuousScan}
        torchEnabled={torchEnabled}
        onToggleContinuousScan={toggleContinuousScan}
        onToggleTorch={toggleTorch}
        onBack={handleBack}
        insetsTop={insets.top}
      />

      <ScannerFocusArea scanState={scanState} frameColor={frameColor} />

      <ScanResultSheet
        scanState={scanState}
        scanResult={scanResult}
        participantName={participantName}
        priceText={priceText}
        errorMessage={errorMessage}
        onOpenManualEntry={() => setIsManualModalVisible(true)}
        onResetScan={resetScan}
        onBack={handleBack}
        insetsBottom={insets.bottom}
      />

      <ManualCodeModal
        visible={isManualModalVisible}
        value={manualCodeInput}
        onChangeValue={setManualCodeInput}
        onSubmit={handleManualSubmit}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151318',
  },
  overlayTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
