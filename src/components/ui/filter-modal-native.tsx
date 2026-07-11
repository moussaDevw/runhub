import { useState } from 'react';
import { View, Text } from 'react-native';

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function FilterModalNative({ isVisible, onDismiss }: FilterModalNativeProps) {
  return (
    <View>
      <Text>Filtres (Web/Fallback)</Text>
    </View>
  );
}
