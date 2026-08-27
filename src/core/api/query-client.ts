import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './client';

/**
 * Shared QueryClient instance for the entire app.
 *
 * Created outside of React to survive re-renders.
 * Imported by the root layout to wrap the app in QueryClientProvider.
 *
 * Configuration optimized for React Native mobile:
 * - staleTime: avoids redundant refetches when navigating between screens
 * - smart retry: retries on network/server errors, skips on client errors (4xx)
 * - retryDelay: exponential backoff (1s → 2s → 4s…) to be gentle on the server
 * - refetchOnReconnect: auto-refreshes stale data when the phone comes back online
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Data stays "fresh" for 60 seconds.
       * During this window, navigating back to a screen reuses cached data
       * without firing a new network request → fewer API calls, smoother UX.
       */
      staleTime: 60_000,

      /** Cache unused data for 5 minutes before garbage collecting */
      gcTime: 5 * 60_000,

      /**
       * Smart retry: up to 2 retries, but only for server/network errors.
       * Client errors (400, 401, 403, 404, 429…) are never retried because
       * repeating the same request won't produce a different result.
       */
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },

      /** Exponential backoff: 1s, 2s, 4s… (capped at 30s) */
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),

      /** Don't refetch when the app window refocuses (avoids excessive calls on mobile) */
      refetchOnWindowFocus: false,

      /** Refetch stale queries when the device reconnects to the internet */
      refetchOnReconnect: 'always',
    },
    mutations: {
      /** Retry mutations once on server/network error only */
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
