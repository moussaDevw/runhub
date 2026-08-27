import { useQuery } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';
import { ClubResponse } from '../types/clubs.types';

export function useClubDetails(id: string) {
  return useQuery<ClubResponse>({
    queryKey: ['club', id],
    queryFn: () => ClubsApi.getClub(id),
    enabled: !!id,
  });
}
