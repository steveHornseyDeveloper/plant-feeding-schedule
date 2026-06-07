# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Longstone Garden Feed — a phone-first PWA for two users (Alexa on iOS, Stevie on Android) to track feeding schedules for 5 plants. Monorepo managed with pnpm workspaces.

## Commands

```bash
# Install
pnpm install

# Build shared package first (required before api/web resolve types)
pnpm --filter @longstone/shared build

# Run everything in dev
pnpm dev                                         # api :3001, web :5173

# Build all
pnpm build

# Lint / typecheck (all packages)
pnpm lint
pnpm typecheck

# Database
pnpm db:up                                       # start Postgres on :5433
pnpm db:down
pnpm db:migrate                                  # prisma migrate dev
pnpm db:seed

# Tests
pnpm --filter @longstone/shared test             # vitest, cadence unit tests
pnpm --filter api test:integration               # jest + Testcontainers Postgres
```

`DATABASE_URL` for local dev: `postgresql://longstone:longstone@localhost:5433/longstone`

## Architecture

### Schedule computation — no stored schedules

The central design: the API **never stores computed schedules**. `ScheduleService` loads all plants with their `FeedingSchedule` rules, `FeedRecord` history, and `Snooze` overrides from Postgres, then delegates to `computeSchedule()` from `@longstone/shared` to derive `ScheduleEntry[]` on every request. The `GET /schedule?from=&to=` endpoint is the only read path the web app needs for its feed view.

### `@longstone/shared` — pure cadence logic

`packages/shared/src/cadence.ts` is the heart of the scheduling logic and is used by **both** the API (NestJS, CJS) and the web (Vite, ESM). The package builds to both formats. `nextDueAfter()` advances a date by `everyDays`, then skips forward to the first day of the next active month if the result falls outside `activeMonths`. `computeSchedule()` walks each `FeedingSchedule` from its anchor (latest `fedAt`, or `plant.startedAt`) and emits entries within the requested window, applying snoozes and fed-record overlays.

### Key invariant: mark-fed uses `dueDate` as the anchor

`POST /feedings` writes a `FeedRecord` with both `fedAt` (actual time) and `dueDate` (the schedule slot it closes). Future cadence is computed from the latest `fedAt`, but snooze lookup and fed-record matching in `computeSchedule` match against `dueDate`, not `fedAt`.

### Identity — no auth

The web detects the current user via `detectUser()` (`apps/web/src/lib/detectUser.ts`): checks `?as=alexa|stevie` query param → `localStorage` → user-agent (iOS → alexa, Android → stevie). Write endpoints require `X-Garden-User: alexa|stevie` header; `GardenUser` decorator validates it. There is no token or session.

### Shared type contracts

All domain types (`Plant`, `FeedingSchedule`, `FeedRecord`, `Snooze`, `ScheduleEntry`, `UserSlug`) are defined once in `packages/shared/src/types.ts`. Prisma models map to these — the API manually maps Prisma's `DateTime` fields to `.toISOString()` strings before returning them, matching the shared types.

### React Query sync strategy

The web polls `GET /schedule` and `GET /plants` every 30 s and on window focus. After `markFed` or `snooze` mutations succeed, the relevant query keys are invalidated immediately. No optimistic updates — the server is the source of truth.

### Verdure design system

UI components live under `apps/web/src/components/botanical/` and `apps/web/src/layout/`. Design tokens are in `apps/web/src/theme/tokens.ts` (`VERDURE` constant) and global CSS in `apps/web/src/theme/verdure.css`. The visual theme is green-led watercolor with cream cards; keep new UI consistent with these tokens.

## API endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | none | |
| GET | `/users` | none | |
| GET | `/plants` | none | Returns `PlantWithSchedules[]` |
| GET | `/plants/:id` | none | Returns plant + history |
| GET | `/schedule?from=&to=` | none | ISO date strings |
| POST | `/feedings` | `X-Garden-User` | `{ plantId, feed, dueDate, fedAt? }` |
| POST | `/snooze` | `X-Garden-User` | `{ plantId, feed, dueDate, days: 1|3|7 }` |

## Environment variables

| Var | Where | Default |
|---|---|---|
| `DATABASE_URL` | api | `postgresql://longstone:longstone@localhost:5433/longstone` |
| `PORT` | api | `3001` |
| `WEB_ORIGIN` | api | `http://localhost:5173` |
| `VITE_API_BASE_URL` | web | `http://localhost:3001` |

## Deployment targets (not yet wired)

- **API**: Railway (Nixpacks), run `prisma migrate deploy` on release
- **Web**: Vercel (Vite), build command must run `pnpm --filter @longstone/shared build && pnpm --filter web build`, output `apps/web/dist`
