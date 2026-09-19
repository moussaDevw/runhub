import { useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Linking } from 'react-native';

export function useScannerCamera() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`[useScannerCamera] render #${renderCount.current}`);

  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [continuousScan, setContinuousScan] = useState(false);

  console.log('[useScannerCamera] state →', {
    permission: permission ? { granted: permission.granted, canAskAgain: permission.canAskAgain } : null,
    torchEnabled,
    continuousScan,
  });

  const handleRequestPermission = async () => {
    console.log('[useScannerCamera] handleRequestPermission called');
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
      if (permission && !permission.canAskAgain && !permission.granted) {
        console.log('[useScannerCamera] permission denied permanently → opening settings');
        await Linking.openSettings();
        return;
      }
      console.log('[useScannerCamera] requesting permission...');
      const result = await requestPermission();
      console.log('[useScannerCamera] permission result →', result);
      if (result && !result.granted && !result.canAskAgain) {
        console.log('[useScannerCamera] still denied permanently → opening settings');
        await Linking.openSettings();
      }
    } catch (e) {
      console.warn('[useScannerCamera] handleRequestPermission error →', e);
      Linking.openSettings().catch(() => { });
    }
  };

  const toggleTorch = () => {
    console.log('[useScannerCamera] toggleTorch →', !torchEnabled);
    setTorchEnabled((prev) => !prev);
  };

  const toggleContinuousScan = () => {
    console.log('[useScannerCamera] toggleContinuousScan →', !continuousScan);
    setContinuousScan((prev) => !prev);
  };

  return {
    permission,
    handleRequestPermission,
    torchEnabled,
    toggleTorch,
    continuousScan,
    toggleContinuousScan,
  };
}
