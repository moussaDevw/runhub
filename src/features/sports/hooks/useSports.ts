import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SportsApi } from '../api/sports.api';
import { Sport } from '../types/sports.types';

export function useAllSports() {
  return useQuery<Sport[], Error>({
    queryKey: ['sports'],
    queryFn: () => SportsApi.getAllSports(),
  });
}

export function useUpdateUserSports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sportIds: string[]) => SportsApi.updateUserSports(sportIds),
    onSuccess: () => {
      // Invalider le profil utilisateur et les recommandations
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}
