import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserSlug } from '@longstone/shared';
import { api } from '../lib/api';

export function useMarkFed(currentUser: UserSlug) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { plantId: number; feed: string; dueDate: string }) =>
      api.markFed(currentUser, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedule'] });
      qc.invalidateQueries({ queryKey: ['plants'] });
    },
  });
}

export function useSnooze(currentUser: UserSlug) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { plantId: number; feed: string; dueDate: string; days: 1 | 3 | 7 }) =>
      api.snooze(currentUser, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}
