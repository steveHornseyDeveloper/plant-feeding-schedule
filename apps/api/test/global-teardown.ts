import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalTeardown() {
  const c = (globalThis as unknown as { __PG_CONTAINER__?: StartedPostgreSqlContainer })
    .__PG_CONTAINER__;
  if (c) await c.stop();
}
