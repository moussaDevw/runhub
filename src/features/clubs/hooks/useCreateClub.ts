import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';
import { ClubResponse, CreateClubPayload } from '../types/clubs.types';

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation<ClubResponse, Error, CreateClubPayload>({
    mutationFn: (payload) => ClubsApi.createClub(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
}
