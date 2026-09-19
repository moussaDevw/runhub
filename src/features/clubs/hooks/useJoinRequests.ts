import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';

export function useJoinRequests(clubId: string) {
  return useQuery({
    queryKey: ['club-join-requests', clubId],
    queryFn: () => ClubsApi.getJoinRequests(clubId),
    enabled: !!clubId,
  });
}

export function useRespondToJoinRequest(clubId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'APPROVED' | 'REJECTED' }) =>
      ClubsApi.respondToJoinRequest(clubId, requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-join-requests', clubId] });
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
    },
  });
}
