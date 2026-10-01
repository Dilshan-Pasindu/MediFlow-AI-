import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3, // 3 seconds
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
