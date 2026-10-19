import { useState, useEffect } from 'react';

export interface AppliedFilters {
  dateFilter?: 'today' | 'weekend' | 'week' | 'month';
  sportId?: string;
  price?: 'free' | 'paid' | 'all' | string;
  neighborhood?: string;
}

export interface UseFilterModalNativeProps {
  activeDateFilter?: 'today' | 'weekend' | 'week' | 'month';
  activeSportId?: string;
  activePriceFilter?: string;
  activeNeighborhood?: string;
  onApplyDateFilter?: (filter?: 'today' | 'weekend' | 'week' | 'month') => void;
  onApplyFilters?: (filters: AppliedFilters) => void;
  onDismiss: () => void;
}

export function useFilterModalNative({
  activeDateFilter,
  activeSportId,
  activePriceFilter,
  activeNeighborhood,
  onApplyDateFilter,
  onApplyFilters,
  onDismiss,
}: UseFilterModalNativeProps) {
  const [when, setWhen] = useState<string>(activeDateFilter || 'all');
  const [sport, setSport] = useState<string>(activeSportId || 'all');
  const [neighborhood, setNeighborhood] = useState<string>(activeNeighborhood || 'all');
  const [price, setPrice] = useState<string>(activePriceFilter || 'all');
  const [distance, setDistance] = useState<number>(5);

  useEffect(() => {
    setWhen(activeDateFilter || 'all');
  }, [activeDateFilter]);

  useEffect(() => {
    setSport(activeSportId || 'all');
  }, [activeSportId]);

  useEffect(() => {
    setPrice(activePriceFilter || 'all');
  }, [activePriceFilter]);

  useEffect(() => {
    setNeighborhood(activeNeighborhood || 'all');
  }, [activeNeighborhood]);

  const handleReset = () => {
    setWhen('all');
    setSport('all');
    setNeighborhood('all');
    setPrice('all');
    setDistance(5);

    if (onApplyFilters) {
      onApplyFilters({
        dateFilter: undefined,
        sportId: undefined,
        price: 'all',
        neighborhood: undefined,
      });
    }
    if (onApplyDateFilter) {
      onApplyDateFilter(undefined);
    }
  };

  const handleClose = () => {
    const formattedDate = when === 'all' ? undefined : (when as 'today' | 'weekend' | 'week' | 'month');
    const formattedSport = sport === 'all' ? undefined : sport;
    const formattedPrice = price === 'all' ? undefined : price;
    const formattedNeighborhood = neighborhood === 'all' ? undefined : neighborhood;

    if (onApplyFilters) {
      onApplyFilters({
        dateFilter: formattedDate,
        sportId: formattedSport,
        price: formattedPrice,
        neighborhood: formattedNeighborhood,
      });
    }

    if (onApplyDateFilter) {
      onApplyDateFilter(formattedDate);
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
