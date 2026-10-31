import { AppliedFilters } from '@/components/ui/hooks/useFilterModalNative';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useClubsList } from '@/features/clubs/hooks/useClubsList';
import { useUnreadNotificationsCount } from '@/features/notifications';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useEventsList } from './useEvents';

export function useExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeSportId, setActiveSportId] = useState<string | undefined>(undefined);
  const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'weekend' | 'week' | 'month' | undefined>(undefined);
  const [activePriceFilter, setActivePriceFilter] = useState<string | undefined>(undefined);
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const router = useRouter();
  const { user } = useAuth();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount();

  const { data: sportsList = [] } = useAllSports();

  const { data: eventsResponse, isLoading, error, refetch, isRefetching } = useEventsList({
    sportId: activeSportId,
    q: debouncedSearchQuery || undefined,
    dateFilter: activeDateFilter,
    price: activePriceFilter,
    city: activeNeighborhood,
  });

  const { data: clubsResponse, isLoading: isLoadingClubs, error: clubsError, refetch: refetchClubs, isRefetching: isRefetchingClubs } = useClubsList({
    sportId: activeSportId,
    q: debouncedSearchQuery || undefined,
  });

  const events = eventsResponse?.data ?? [];
  const clubs = clubsResponse?.data ?? [];

  const hasActiveFilters = Boolean(
    activeDateFilter ||
    (activePriceFilter && activePriceFilter !== 'all') ||
    (activeNeighborhood && activeNeighborhood !== 'all')
  );

  const handleApplyFilters = (filters: AppliedFilters) => {
    setActiveDateFilter(filters.dateFilter);
    if (filters.sportId !== undefined) {
      setActiveSportId(filters.sportId === 'all' ? undefined : filters.sportId);
    }
    setActivePriceFilter(filters.price === 'all' ? undefined : filters.price);
    setActiveNeighborhood(filters.neighborhood === 'all' ? undefined : filters.neighborhood);
  };

  const handleResetFilters = () => {
    setActiveDateFilter(undefined);
    setActiveSportId(undefined);
    setActivePriceFilter(undefined);
    setActiveNeighborhood(undefined);
  };

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'TD';

  const handleNavigateProfile = () => router.push('/profil');
  const handleNavigateFavorites = () => router.push('/favorites' as any);
  const handleNavigateNotifications = () => router.push('/notifications' as any);
  const handleNavigateCreate = () => {
    if (activeTab === 'clubs') {
      router.push('/club/create' as any);
    } else {
      router.push('/event/create' as any);
    }
  };
  const handleNavigateEvent = (id: string) => router.push(`/event/${id}` as any);
  const handleNavigateClub = (id: string) => router.push(`/club/${id}` as any);

  return {
    // State
    filterVisible,
    setFilterVisible,
    activeSportId,
    setActiveSportId,
    activeDateFilter,
    setActiveDateFilter,
    activePriceFilter,
    setActivePriceFilter,
    activeNeighborhood,
    setActiveNeighborhood,
    hasActiveFilters,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,

    // Data
    userInitials,
    unreadNotificationsCount,
    sportsList,
    events,
    clubs,
    isLoading: activeTab === 'events' ? isLoading : isLoadingClubs,
    error: activeTab === 'events' ? error : clubsError,
    isRefetching: activeTab === 'events' ? isRefetching : isRefetchingClubs,

    // Actions
    handleApplyFilters,
    handleResetFilters,
    refetch: activeTab === 'events' ? refetch : refetchClubs,
    handleNavigateProfile,
    handleNavigateFavorites,
    handleNavigateNotifications,
    handleNavigateCreate,
    handleNavigateEvent,
    handleNavigateClub,
  };
}
