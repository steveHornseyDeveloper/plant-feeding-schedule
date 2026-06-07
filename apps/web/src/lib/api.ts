import type {
  PlantWithSchedules,
  ScheduleEntry,
  User,
  UserSlug,
} from '@longstone/shared';

const BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '');

type RequestOpts = {
  method?: 'GET' | 'POST';
  body?: unknown;
  user?: UserSlug;
};

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.user) headers['X-Garden-User'] = opts.user;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type PlantDetail = PlantWithSchedules & {
  history: Array<{
    id: number;
    feed: string;
    fedAt: string;
    dueDate: string;
    by: { id: number; slug: UserSlug; name: string };
  }>;
};

export const api = {
  users: () => request<User[]>('/users'),
  plants: () => request<PlantWithSchedules[]>('/plants'),
  plant: (id: number) => request<PlantDetail>(`/plants/${id}`),
  schedule: (from: string, to: string) =>
    request<ScheduleEntry[]>(`/schedule?from=${from}&to=${to}`),
  markFed: (
    user: UserSlug,
    body: { plantId: number; feed: string; dueDate: string; fedAt?: string },
  ) => request<{ id: number }>('/feedings', { method: 'POST', body, user }),
  snooze: (
    user: UserSlug,
    body: { plantId: number; feed: string; dueDate: string; days: 1 | 3 | 7 },
  ) => request<{ id: number }>('/snooze', { method: 'POST', body, user }),
};
