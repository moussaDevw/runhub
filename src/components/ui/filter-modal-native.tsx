
import { View, Text } from 'react-native';

export interface FilterModalNativeProps {
  isVisible: boolean;
  onDismiss: () => void;
  activeDateFilter?: 'today' | 'weekend' | 'week' | 'month';
  onApplyDateFilter?: (filter?: 'today' | 'weekend' | 'week' | 'month') => void;
  availableNeighborhoods?: string[];
}

export function FilterModalNative({ isVisible: _isVisible, onDismiss: _onDismiss, activeDateFilter: _activeDateFilter, onApplyDateFilter: _onApplyDateFilter }: FilterModalNativeProps) {
  return (
    <View>
      <Text>Filtres (Web/Fallback)</Text>
    </View>
  );
}
