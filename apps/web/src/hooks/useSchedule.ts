import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSchedule(from: string, to: string) {
  return useQuery({
    queryKey: ['schedule', from, to],
    queryFn: () => api.schedule(from, to),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}
