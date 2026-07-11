import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient instance for the entire app.
 *
 * Created outside of React to survive re-renders.
 * Imported by the root layout to wrap the app in QueryClientProvider.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Keep data fresh for 30 seconds before refetching in background */
      staleTime: 30_000,

      /** Cache unused data for 5 minutes before garbage collecting */
      gcTime: 5 * 60_000,

      /** Retry failed requests up to 2 times */
      retry: 2,

      /** Don't refetch when the app window refocuses (good for mobile) */
      refetchOnWindowFocus: false,
    },
    mutations: {
      /** Retry failed mutations once */
      retry: 1,
    },
  },
});
