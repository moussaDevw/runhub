import { useMemo, useState } from 'react';
import { ParticipantResponse } from '@/features/events/api/events.api';
import { getUserDisplayName } from '../utils/check-in.utils';

export type FilterMode = 'all' | 'arrived' | 'pending';

export function useCheckInFilter(participants: ParticipantResponse[] = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const totalCount = participants.length;
  const arrivedCount = participants.filter((p) => p.status === 'checked_in').length;
  const pendingCount = Math.max(0, totalCount - arrivedCount);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const name = getUserDisplayName(
        p.user?.firstName,
        p.user?.lastName,
        p.user?.username
      ).toLowerCase();
      const code = (p.ticketCode || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || name.includes(query) || code.includes(query);

      if (!matchesSearch) return false;

      if (filterMode === 'arrived') return p.status === 'checked_in';
      if (filterMode === 'pending') return p.status !== 'checked_in';
      return true;
    });
  }, [participants, searchQuery, filterMode]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    handleClearSearch,
    filterMode,
    setFilterMode,
    totalCount,
    arrivedCount,
    pendingCount,
    filteredParticipants,
  };
}
