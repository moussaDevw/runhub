import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HealthService } from '../services/health.service';
import { HealthSummary } from '../types/health.types';

export const HEALTH_QUERY_KEY = ['health', 'summary'];

export function useHealthData() {
  const queryClient = useQueryClient();

  const query = useQuery<HealthSummary>({
    queryKey: HEALTH_QUERY_KEY,
    queryFn: () => HealthService.getHealthSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const granted = await HealthService.requestPermissions();
      if (!granted) throw new Error('Permission refusée');
      return HealthService.getHealthSummary();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HEALTH_QUERY_KEY, data);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      await HealthService.disconnect();
      return HealthService.getHealthSummary();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HEALTH_QUERY_KEY, data);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    connect: connectMutation.mutateAsync,
    disconnect: disconnectMutation.mutateAsync,
    refetch: query.refetch,
    provider: HealthService.getProvider(),
  };
}
