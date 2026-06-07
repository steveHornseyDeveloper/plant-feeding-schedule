# Longstone Garden Feed

Phone-first PWA for tracking plant feeding at the converted-stables home in Great
Longstone. Two users (Alexa on iPhone, Stevie on Android) share a schedule for 5
plants and 4 feed types. Direction A — **Verdure** — green-led, watercolor
washes, cream cards, drystone divider.

## Layout

```
apps/web              Vite + React + TS + vite-plugin-pwa  →  Vercel
apps/api              NestJS + Prisma + Postgres            →  Railway
packages/shared       Pure cadence functions (used by both)
docker-compose.yml    Local Postgres on :5433
```

## First run

```bash
# 1. Postgres
docker compose up -d postgres

# 2. Install
pnpm install

# 3. Build the shared package (required before api/web can resolve types)
pnpm --filter @longstone/shared build

# 4. Apply migrations + seed
pnpm --filter api exec prisma migrate dev --name init
pnpm --filter api exec prisma db seed

# 5. Run API and web in parallel
pnpm dev
# API:  http://localhost:3001
# WEB:  http://localhost:5173
```

To install the PWA on a phone, open `http://<your-laptop-LAN-ip>:5173` on the
device's browser and add to home screen. Identity is auto-detected from the
user-agent (iOS → Alexa, Android → Stevie). Override with `?as=alexa` or
`?as=stevie` in the URL.

## Tests

```bash
pnpm --filter @longstone/shared test       # cadence unit tests
pnpm --filter api test:integration         # API integration tests (Testcontainers Postgres)
```

## Architecture notes

- **Schedules are not stored.** The API computes upcoming entries on the fly
  from `FeedingSchedule` rules + `FeedRecord` history + `Snooze` overrides.
  Cadence rules live in their own table — a plant can have many (e.g. Pear:
  Ericaceous mulch in spring, Bone meal in October).
- **Mark-fed shifts cadence.** The next due date for that schedule's feed type
  is computed from the actual `fedAt` time, snapped to the start of the next
  active month if it lands outside `activeMonths`.
- **Snooze is a one-off override.** It defers a single entry; future cadence
  still walks from the real `fedAt` anchor.
- **No auth.** The household endpoint is private; the client sends
  `X-Garden-User: alexa|stevie` on writes. This is a deliberate v1 simplification.
- **Polling for sync.** React Query refetches `/schedule` and `/plants` on
  window focus and every 30 s. Two phones converge within one tick.

## Deployment plan (not yet wired)

- **API on Railway**: Nixpacks build, Postgres plugin, env vars `DATABASE_URL`,
  `WEB_ORIGIN`, `PORT`. Run `prisma migrate deploy` on each release.
- **Web on Vercel**: framework Vite, build `pnpm --filter @longstone/shared
  build && pnpm --filter web build`, output `apps/web/dist`. Env
  `VITE_API_BASE_URL`. Add `vercel.json` with SPA rewrite once deploying.

## v1.1 backlog

- Settings screen: rename users, drystone-intensity slider, manual identity override.
- Plant CRUD UI (currently admin-only via `prisma db seed`).
- Web Push notifications (Android + iOS 16.4+ standalone).
- PWA icons (drop into `apps/web/public/`).
- Switch sync from 30 s polling to SSE if it ever feels laggy.
