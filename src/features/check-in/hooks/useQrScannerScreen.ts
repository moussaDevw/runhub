import { useLocalSearchParams, useRouter } from 'expo-router';

import { useScannerCamera } from './useScannerCamera';
import { useTicketScanner, ScanState } from './useTicketScanner';
import { useManualCodeModal } from './useManualCodeModal';

export type { ScanState };

export function useQrScannerScreen() {
  const router = useRouter();
  const { eventId = '' } = useLocalSearchParams<{ eventId?: string }>();

  // 1. Camera & Permissions logic
  const camera = useScannerCamera();

  // 2. Ticket scanning & verification logic
  const scanner = useTicketScanner({
    eventId,
    continuousScan: camera.continuousScan,
  });

  // 3. Manual code modal logic
  const manualModal = useManualCodeModal(scanner.handleProcessCode);

  const handleBack = () => {
    router.back();
  };

  return {
    eventId,
    // Camera
    permission: camera.permission,
    torchEnabled: camera.torchEnabled,
    toggleTorch: camera.toggleTorch,
    continuousScan: camera.continuousScan,
    toggleContinuousScan: camera.toggleContinuousScan,
    handleRequestPermission: camera.handleRequestPermission,
    // Scanner
    scanState: scanner.scanState,
    scanResult: scanner.scanResult,
    errorMessage: scanner.errorMessage,
    frameColor: scanner.frameColor,
    participantName: scanner.participantName,
    priceText: scanner.priceText,
    handleBarcodeScanned: scanner.handleBarcodeScanned,
    handleProcessCode: scanner.handleProcessCode,
    resetScan: scanner.resetScan,
    // Manual Modal
    isManualModalVisible: manualModal.isManualModalVisible,
    setIsManualModalVisible: manualModal.setIsManualModalVisible,
    manualCodeInput: manualModal.manualCodeInput,
    setManualCodeInput: manualModal.setManualCodeInput,
    openManualModal: manualModal.openManualModal,
    closeManualModal: manualModal.closeManualModal,
    handleManualSubmit: manualModal.handleManualSubmit,
    handleCloseModal: manualModal.closeManualModal,
    // Navigation
    handleBack,
  };
}
