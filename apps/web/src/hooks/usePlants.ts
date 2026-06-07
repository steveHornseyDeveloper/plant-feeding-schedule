import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usePlants() {
  return useQuery({
    queryKey: ['plants'],
    queryFn: api.plants,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function usePlant(id: number | undefined) {
  return useQuery({
    queryKey: ['plants', id],
    queryFn: () => api.plant(id!),
    enabled: id != null,
  });
}
