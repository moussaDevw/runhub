import { useState } from 'react';

export function useManualCodeModal(onSubmitCode: (code: string) => void) {
  const [isManualModalVisible, setIsManualModalVisible] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState('');

  const openManualModal = () => {
    setIsManualModalVisible(true);
  };

  const closeManualModal = () => {
    setIsManualModalVisible(false);
    setManualCodeInput('');
  };

  const handleManualSubmit = () => {
    if (!manualCodeInput.trim()) return;
    const code = manualCodeInput.trim();
    closeManualModal();
    onSubmitCode(code);
  };

  return {
    isManualModalVisible,
    setIsManualModalVisible,
    manualCodeInput,
    setManualCodeInput,
    openManualModal,
    closeManualModal,
    handleManualSubmit,
  };
}
