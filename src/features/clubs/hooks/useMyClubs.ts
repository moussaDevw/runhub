import { useQuery } from '@tanstack/react-query';
import { ClubsApi } from '../api/clubs.api';
import { useAuth } from '@/features/auth/context/AuthContext';

export function useMyClubs() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-clubs', user?.id],
    queryFn: () => ClubsApi.getMyClubs(),
    enabled: !!user?.id,
  });
}
