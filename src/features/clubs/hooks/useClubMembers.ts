import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';
import { ClubMember } from '../types/clubs.types';

export function useClubMembers(clubId?: string) {
  return useQuery<ClubMember[]>({
    queryKey: ['club-members', clubId],
    queryFn: () => ClubsApi.getClubMembers(clubId!),
    enabled: !!clubId,
  });
}

export function useRemoveClubMember(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => ClubsApi.leaveClub(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-members', clubId] });
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      queryClient.invalidateQueries({ queryKey: ['my-clubs'] });
    },
  });
}

