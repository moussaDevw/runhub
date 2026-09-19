import { useLocalSearchParams, useRouter } from 'expo-router';

import { useEventDetail, useEventParticipants } from '@/features/events/hooks/useEvents';
import { formatEventPresentation } from '@/features/events/utils/event.utils';
import { useCheckInFilter, FilterMode } from './useCheckInFilter';
import { useCheckInToggle } from './useCheckInToggle';

export {
  AVATAR_COLORS,
  getAvatarColor,
  getUserInitials,
  getUserDisplayName,
} from '../utils/check-in.utils';
export type { FilterMode };

export function useCheckInListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const eventId = id || '';

  // 1. Data fetching
  const { data: event, isLoading: isEventLoading, refetch: refetchEvent } = useEventDetail(eventId);
  const {
    data: participants = [],
    isLoading: isParticipantsLoading,
    refetch: refetchParticipants,
  } = useEventParticipants(eventId);

  // 2. Search & Filtering logic
  const filter = useCheckInFilter(participants);

  // 3. Check-in Toggle mutation logic
  const toggle = useCheckInToggle(eventId);

  const presentation = event ? formatEventPresentation(event) : null;

  const handleRefresh = () => {
    refetchEvent();
    refetchParticipants();
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoToEdit = () => {
    if (eventId) {
      router.push(`/(tabs)/creer?id=${eventId}` as any);
    }
  };

  const handleGoToScan = () => {
    router.push({ pathname: '/scan', params: { eventId } } as any);
  };

  return {
    eventId,
    event,
    presentation,
    participants,
    filteredParticipants: filter.filteredParticipants,
    totalCount: filter.totalCount,
    arrivedCount: filter.arrivedCount,
    pendingCount: filter.pendingCount,
    isEventLoading,
    isParticipantsLoading,
    isRefreshing: isEventLoading || isParticipantsLoading,
    searchQuery: filter.searchQuery,
    setSearchQuery: filter.setSearchQuery,
    handleClearSearch: filter.handleClearSearch,
    filterMode: filter.filterMode,
    setFilterMode: filter.setFilterMode,
    mutatingRegistrationId: toggle.mutatingRegistrationId,
    handleToggle: toggle.handleToggle,
    handleRefresh,
    handleBack,
    handleGoToEdit,
    handleGoToScan,
  };
}
