import { StyleSheet } from 'react-native';

import { CameraView } from 'expo-camera';

export type ScannerCameraProps = {
  torchEnabled: boolean;
  onBarcodeScanned: (event: { data: string }) => void;
};

export function ScannerCamera({ torchEnabled, onBarcodeScanned }: ScannerCameraProps) {
  return (
    <CameraView
      style={StyleSheet.absoluteFill}
      facing="back"
      mode="picture"
      mute={true}
      enableTorch={torchEnabled}
      responsiveOrientationWhenOrientationLocked
      barcodeScannerSettings={{
        barcodeTypes: ['qr', 'code128', 'code39'],
      }}
      onBarcodeScanned={onBarcodeScanned}
    />
  );
}
