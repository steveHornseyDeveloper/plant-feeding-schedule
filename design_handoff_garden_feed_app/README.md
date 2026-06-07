# Handoff: Longstone — Garden Feed App

## Overview
A two-person garden feeding tracker for a converted-stables home in Great Longstone, Peak District. Tells the household when each plant is due a feed and with what kind of food. Designed for phone-first use as a PWA installable on iOS and Android.

The household has 5 plants (Wisteria — favourite, Peach tree, Fig tree in greenhouse, Pear trees, Apple trees) and uses 4 feed types (tomato feed, seaweed, ericaceous, bone meal). Two named users (Alex, Jamie) share the same schedule.

## About the design files
The files in `design-references/` are **design references created in HTML** — interactive prototypes that show the intended look, layout, and behavior. They are NOT production code to copy directly.

Your task is to **recreate these designs as a real React PWA** using the framework choices below, matching the look and interactions pixel-for-pixel.

## Fidelity
**High-fidelity.** The prototype uses final colors, typography, spacing, and interactions. Reproduce them exactly.

## Recommended stack
The user wants React + PWA installable on phones. Suggested:
- **Vite + React + TypeScript** (`npm create vite@latest -- --template react-ts`)
- **`vite-plugin-pwa`** for the service worker + manifest
- **Zustand** or React Context for shared state (the "fed" map across users)
- **date-fns** for date formatting (replaces the small helpers in `data.jsx`)
- **Local persistence**: start with `localStorage`; later swap to Firebase / Supabase / Cloudflare D1 if you want true multi-device sync between Alex & Jamie's phones
- **Fonts via Google Fonts** (already used in prototype): DM Serif Display, Sora, Cormorant Garamond, Inter
- **No icon library required** — the design uses simple SVG primitives (leaf glyph, drystone wall) that should be ported as React components

## PWA notes
- Add a `manifest.json` with `display: "standalone"`, theme color `#3f6b4a` (Verdure) or `#1a241d` (Drystone), and 192/512 icons of the plant-badge "W" monogram on the moss background
- Service worker should cache the app shell + Google Fonts; data is small (a JSON of plants + feeds) so cache-first is fine
- Test "Add to Home Screen" on both iOS Safari and Android Chrome
- Use `apple-touch-icon` link tag for iOS install icon

## Two design directions
The prototype contains **two complete directions** in a side-by-side canvas. Pick ONE before implementing.

### Direction A — Verdure (recommended default)
Green-led, soft botanical, watercolor washes, organic blobs, warm cream cards. Limestone hint = quiet drystone-wall divider strip under the title.
- Vibe: lush, warm, tactile, residential
- Hero typography: DM Serif Display
- Body typography: Sora

### Direction B — Drystone
Limestone-led, architectural, stacked-stone left-rail on every task card, full drystone band header, mossier deeper greens. Editorial — Edwardian botanical illustration meets stone wall.
- Vibe: editorial, considered, slightly more austere
- Hero typography: Cormorant Garamond (with italic eyebrows)
- Body typography: Inter

Both directions share the same content, data model, and screen structure — only the visual layer differs.

## Screens to build
1. **Today** (home) — overdue + today's tasks at top, 14-day upcoming list below, bottom tab bar
2. **Calendar** — month grid with per-day dots colored by plant, selected-day list below
3. **Plants** (referenced in tab bar but not designed yet — add after MVP)

The prototype only shows Today + Calendar. Build those first.

---

## Design tokens

### Direction A — Verdure
```js
const VERDURE = {
  bg:        '#f8f5ec',  // cream
  bgDeep:    '#eee8d6',
  ink:       '#1f2e23',  // deep moss text
  inkSoft:   '#3a4d3f',
  moss:      '#3f6b4a',  // primary brand green
  leaf:      '#5a8e54',  // accent green
  bloom:     '#c79a4a',  // soft amber/gold
  wisteria:  '#7a5b8e',  // wisteria-favourite accent
  card:      '#fffdf8',  // paper
  cardEdge:  'rgba(63, 107, 74, 0.12)',
  stoneSoft: '#e3dac3',
};
```

### Direction B — Drystone
```js
const DRYSTONE = {
  bg:        '#ede5d2',  // limestone
  bgDeep:    '#e0d5bb',
  paper:     '#f6f0de',
  ink:       '#1a241d',
  inkSoft:   '#3d4a3f',
  moss:      '#2f4a35',
  lichen:    '#7c8b4a',
  stone:     '#c4b896',
  stoneDk:   '#8a7d5e',
  rust:      '#a05a30',  // overdue accent
  wisteria:  '#5d4670',
};
```

### Plant accent colors (shared)
- Wisteria: `#9b86c4`
- Peach: `#e6a78b`
- Fig: `#7fae6c`
- Pear: `#b9c47a`
- Apple: `#c4d18a`

### Spacing / radius
- Card radius (Verdure): 18px outer, 14px sub-cards, 12px buttons
- Card radius (Drystone): 4–6px, much sharper — architectural
- Card padding: `14px`
- Screen padding: `22px` horizontal at headers, `16px` at task lists
- Tab bar: floats `16px` from sides + bottom

### Typography scale
| Use | Verdure | Drystone |
|-----|---------|----------|
| Hero title | DM Serif Display 38 / line 1.05 / -0.02em | Cormorant Garamond 500 40 / 1.0 / -0.015em |
| Plant name | DM Serif Display 22 | Cormorant Garamond 500 22 |
| Eyebrow | Sora 11 uppercase 0.18em letterspace, color moss | Cormorant italic 12 uppercase 0.22em letterspace, color stoneDk |
| Body | Sora 13 | Inter 13 |
| Small/caption | Sora 11–12 | Inter 10.5–11 |
| Status pill | n/a (dot + text) | Inter 9 uppercase 0.18em letterspace, 600 weight, in 1px border pill |

---

## Data model

### Plant
```ts
type Plant = {
  id: string;             // 'wisteria', 'peach', 'fig', 'pear', 'apple'
  name: string;           // display: "Wisteria"
  nick: string;           // "The Pride", "Greenhouse", "Two of"
  location: string;       // "South wall · pergola"
  feed: string;           // primary feed type
  feedNote: string;       // "High-potash for flowering"
  color: string;          // hex accent for badges + watercolor halos
  initial: string;        // monogram for circular badge
  favourite?: boolean;    // wisteria=true
  schedule: ScheduleEntry[];
  history: HistoryEntry[];
};

type ScheduleEntry = {
  date: string;           // ISO YYYY-MM-DD
  feed: string;
  done: boolean;
  status: 'overdue' | 'today' | 'upcoming';
};

type HistoryEntry = {
  date: string;
  feed: string;
  by: 'alex' | 'jamie';
};
```

The full seed dataset is in `design-references/data.jsx`. Port verbatim.

### Users
```ts
const USERS = {
  alex:  { name: 'Alex',  initial: 'A', tone: '#3f6b4a' },
  jamie: { name: 'Jamie', initial: 'J', tone: '#7a5b8e' },
};
```
The user has confirmed these are placeholder names — the app should let the household rename them in Settings.

### App state
```ts
type AppState = {
  currentUser: 'alex' | 'jamie';   // who's holding this phone right now
  fedMap: Record<string, FedRecord>; // key = `${plantId}-${schedIdx}`
  // ...
};
type FedRecord = { by: 'alex'|'jamie'; at: string };
```

`status` should be **derived**, not stored. Compute on render from `today`, `schedule[i].date`, and `fedMap`:
- if `fedMap[key]` exists → render "Fed by X · 2h ago"
- else if `date < today` → `overdue`
- else if `date == today` → `today`
- else → `upcoming`

---

## Screen 1 — Today (home)

### Layout (top to bottom)
1. **iOS status-bar spacer** — 62px transparent (so nothing collides with the dynamic island)
2. **Brand row** — italic "Longstone Garden" wordmark left, two stacked user-avatar dots right (overlapping by 8px). 22px horizontal padding.
3. **Hero header** — uppercase eyebrow ("Sun 10 May · 5 plants"), then 38px serif "Today's feed". Watercolor blobs in the corners (leaf-green top-right, amber bottom-left, low opacity, soft radial gradients).
4. **Drystone divider** — 18–24px tall band of stacked stones, opacity scales with `stoneIntensity` tweak (0–1.5 range, 1 = default).
5. **Today task cards** (overdue first, then today) — see component spec below
6. **Coming up section** — eyebrow + tendril icon + 4-row plant list (next 14 days, post-today)
7. **Floating tab bar** — `position: absolute; bottom: 16px; left: 16px; right: 16px;` with 3 tabs: Today / Calendar / Plants

### Today Task Card (Verdure)
- Background `#fffdf8`, 18px radius, 1px border `rgba(63,107,74,0.12)` (rust-tinted if overdue: `#c47a4a55`)
- Soft inner shadow + `0 6px 18px rgba(63,107,74,0.06)` outer
- Watercolor blob in plant.color in top-right corner, opacity 0.22, behind content
- **Top row**: 48px circular plant badge (monogram + watercolor halo) + plant name (22px serif) + ✦ if favourite + location subline (12px Sora 70% opacity)
- **Status line**: 6px colored dot (leaf green or rust if overdue) + feed name + "Due today" or "N days overdue"
- **Action row**: full-width "Mark fed" button (moss bg, cream text, leaf glyph) + "Snooze" outlined button
- **Fed state**: replace action row with cream-tinted bar showing user-avatar + "Alex fed · just now" + leaf glyph (auto-clears after 6s in prototype; should persist in real app)

### Today Task Card (Drystone)
- 14px-wide drystone left rail (full vertical bar of stacked stone rectangles)
- Paper card body `#f6f0de` with sharp 6px radius (only right side rounded; merges with rail)
- Top row: 42px badge + plant name (Cormorant 22 500) + "· favourite" italic eyebrow if favourite + status pill stamp on far right (uppercase 9px in 1px bordered pill, rust if overdue, moss if today)
- **Prescription line**: tinted feed-color square + "PRESCRIPTION" eyebrow + feed name (Cormorant 16) + feedNote (10px Inter, right-aligned, max 90px)
- **Action row**: black "MARK FED" button (uppercase 11 Inter 0.18em letterspace) + "SNOOZE" outlined
- **Fed state**: italic Cormorant "Fed by Alex · just now" with avatar dot

### Mark fed interaction
1. User taps "Mark fed"
2. Optimistic update: action row replaced with fed bar, plant.color watercolor blob pulses once
3. Persist `fedMap[key] = { by: currentUser, at: nowIso }` to localStorage
4. (Future) push to shared backend so partner's phone updates within seconds
5. Subtle haptic on tap (iOS: `navigator.vibrate?.(8)`)

---

## Screen 2 — Calendar

### Layout
1. iOS status-bar spacer (62px)
2. Brand row
3. Hero header — eyebrow "The feeding month" / "Year ledger · spring", title "May 2026"
4. Drystone divider (Verdure) or full drystone band (Drystone)
5. **Week-of-day heads** — S M T W T F S, tiny uppercase letterspaced
6. **Month grid** — 7-col CSS grid with `aspect-ratio: 1`. Each cell:
   - Day number top-left (DM Serif / Cormorant)
   - Up to 3–4 colored dots below (one per plant scheduled)
   - **Today (10 May)** = filled moss/ink background, cream day number, cream dots
   - **Days with overdue tasks** = rust-colored day number
   - **Verdure** uses rounded 9px tile cards on a transparent grid
   - **Drystone** uses borders between cells (1px stoneDk @ 20% opacity), no rounded corners — feels architectural
7. **Selected day section** — eyebrow "Sun 10 May · today" + flat list of that day's tasks (smaller variant of the row component)
8. Tab bar (Calendar active)

### Tap interaction (not in prototype)
Tap any cell → updates the selected-day list below. Long-press → bottom sheet to add task on that day.

---

## Drystone-intensity tweak
Both directions expose a slider (0 → 1.5, default 1) that controls how prominent the limestone/drystone elements are.

In production, surface this in **Settings → Appearance → Stone hint**, with these stops:
- 0.0: removed entirely (pure Verdure / pure paper Drystone)
- 0.5: faint
- 1.0 (default): visible
- 1.5: strong, the wall is the hero

It's a single CSS custom property `--stone-i` that cascades to:
- divider opacity & saturation
- header band height (Drystone): `calc(60px + var(--stone-i) * 14px)`
- left-rail card opacity (Drystone)

---

## Components to extract (suggested file structure)

```
src/
  app/
    pages/
      Today.tsx
      Calendar.tsx
      Plants.tsx              // future
      Settings.tsx            // future (rename users, theme, stone-hint)
    layout/
      AppShell.tsx            // status-bar safe area, tab bar, brand row
      TabBar.tsx
      BrandRow.tsx
      HeroHeader.tsx          // eyebrow + title + watercolor blobs
      DrystoneDivider.tsx
  components/
    PlantBadge.tsx            // monogram + watercolor halo
    UserDot.tsx
    TaskCard.tsx              // direction-themed via context
    TaskRow.tsx
    Watercolor.tsx            // SVG component, props: color, opacity, seed
    Drystone.tsx              // SVG component, props: rows, w, h, intensity
    LeafGlyph.tsx
    Tendril.tsx
  data/
    plants.ts                 // seed data
    users.ts
    schedule.ts               // helpers: getTodayTasks, getUpcoming, relWhen, fmtDay
  state/
    fedStore.ts               // zustand
    settingsStore.ts
  theme/
    verdure.ts
    drystone.ts
    ThemeProvider.tsx         // CSS-in-JS or CSS vars on <html>
```

The prototype's `botanical.jsx` is a near-1:1 port — the SVG components there are pure and just need TypeScript types added.

---

## Interactions checklist
- [ ] Tap **Mark fed** → optimistic state, persist locally, animate
- [ ] Tap **Snooze** → bottom sheet with "+1 day / +3 days / next week"
- [ ] Tap a **plant card** → plant detail page (out of MVP scope)
- [ ] Tap a **calendar day** → that day's task list updates below
- [ ] Tap a **tab** → page transition
- [ ] Pull-to-refresh on Today
- [ ] iOS install prompt on first visit (after engagement)
- [ ] Android install prompt via `beforeinstallprompt`

## Non-goals for MVP
- Photos per plant
- Weather integration
- Notifications/push (consider for v1.1 — Web Push works on Android, iOS 16.4+ in standalone PWA)
- Multi-device real-time sync (start with single-device; add later)
- Adding/editing plants in-app (seed file is fine for MVP — owner edits JSON)

---

## Files in this handoff
- `design-references/Watering Schedule App.html` — runnable prototype, open in any browser
- `design-references/data.jsx` — seed data (plants, schedule, history, users)
- `design-references/botanical.jsx` — Watercolor, Drystone, LeafGlyph, Tendril, PlantBadge, UserDot
- `design-references/verdure.jsx` — Direction A screens
- `design-references/drystone.jsx` — Direction B screens

## How to use with Claude Code
1. Drop this whole folder into a new repo
2. Open the repo in Claude Code
3. Ask: "Read `design_handoff_garden_feed_app/README.md` and the design-references. Scaffold a Vite React TS PWA implementing **Direction A (Verdure)**. Match the prototype pixel-for-pixel. Wire up `localStorage` persistence for the fed map and user preference. Add `vite-plugin-pwa` with a `manifest.json` configured for installable mode."
4. Iterate from there. The prototype HTML is the source of truth for any visual ambiguity.
