import { useQuery } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';

interface UseClubsListParams {
  q?: string;
  sportId?: string;
}

export function useClubsList(params?: UseClubsListParams) {
  return useQuery({
    queryKey: ['clubs-list', params?.q, params?.sportId],
    queryFn: () => ClubsApi.searchClubs(params),
  });
}
