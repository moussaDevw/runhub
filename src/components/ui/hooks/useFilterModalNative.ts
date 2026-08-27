import { useState, useEffect } from 'react';

export interface UseFilterModalNativeProps {
  activeDateFilter?: 'today' | 'weekend' | 'week' | 'month';
  onApplyDateFilter?: (filter?: 'today' | 'weekend' | 'week' | 'month') => void;
  onDismiss: () => void;
}

export function useFilterModalNative({
  activeDateFilter,
  onApplyDateFilter,
  onDismiss,
}: UseFilterModalNativeProps) {
  const [when, setWhen] = useState<string>(activeDateFilter || 'all');
  const [sport, setSport] = useState('Running');
  const [neighborhood, setNeighborhood] = useState('Médina');
  const [price, setPrice] = useState('Tous');
  const [distance, setDistance] = useState(5);

  useEffect(() => {
    setWhen(activeDateFilter || 'all');
  }, [activeDateFilter]);

  const handleReset = () => {
    setWhen('all');
    setSport('Running');
    setNeighborhood('Médina');
    setPrice('Tous');
    setDistance(5);
  };

  const handleClose = () => {
    if (onApplyDateFilter) {
      onApplyDateFilter(when === 'all' ? undefined : (when as any));
    }
    onDismiss();
  };

  return {
    when,
    setWhen,
    sport,
    setSport,
    neighborhood,
    setNeighborhood,
    price,
    setPrice,
    distance,
    setDistance,
    handleReset,
    handleClose,
  };
}
