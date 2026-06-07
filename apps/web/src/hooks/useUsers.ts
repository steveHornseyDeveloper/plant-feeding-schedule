import { useQuery } from '@tanstack/react-query';
import type { User, UserSlug } from '@longstone/shared';
import { api } from '../lib/api';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.users, staleTime: 5 * 60_000 });
}

export function useUserBySlug(slug: UserSlug | undefined): User | undefined {
  const { data } = useUsers();
  if (!slug || !data) return undefined;
  return data.find((u) => u.slug === slug);
}
