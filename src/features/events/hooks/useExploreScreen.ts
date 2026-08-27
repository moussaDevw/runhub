import { useAuth } from '@/features/auth/context/AuthContext';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useEventsList } from './useEvents';

export function useExploreScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeSportId, setActiveSportId] = useState<string | undefined>(undefined);
  const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'weekend' | 'week' | 'month' | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const router = useRouter();
  const { user } = useAuth();

  const { data: sportsList = [] } = useAllSports();

  const { data: eventsResponse, isLoading, error, refetch, isRefetching } = useEventsList({
    sportId: activeSportId,
    q: debouncedSearchQuery || undefined,
    dateFilter: activeDateFilter,
  });

  const events = eventsResponse?.data ?? [];
  // console.log({ eventsResponse, events })
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'TD';

  const handleNavigateProfile = () => router.push('/profil');
  const handleNavigateFavorites = () => router.push('/favorites' as any);
  const handleNavigateNotifications = () => router.push('/notifications' as any);
  const handleNavigateCreate = () => router.push('/(tabs)/creer' as any);
  const handleNavigateEvent = (id: string) => router.push(`/event/${id}` as any);

  return {
    // State
    filterVisible,
    setFilterVisible,
    activeSportId,
    setActiveSportId,
    activeDateFilter,
    setActiveDateFilter,
    searchQuery,
    setSearchQuery,

    // Data
    userInitials,
    sportsList,
    events,
    isLoading,
    error,
    isRefetching,

    // Actions
    refetch,
    handleNavigateProfile,
    handleNavigateFavorites,
    handleNavigateNotifications,
    handleNavigateCreate,
    handleNavigateEvent,
  };
}
