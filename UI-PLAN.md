# UI Plan — Angular Lab (Phase 08)

Design + refactor plan for giving Angular Lab a professional, modern, distinctive identity and
paying down UI duplication. This is the detailed companion to `PLAN.md` § Phase 08. **No code in
this document — it is the brief an implementation session works from.**

How to use: implement in stages (§7), one PR per stage, each independently shippable. Read
`context.md` first as always; `specs/production.md` accessibility rules apply to everything here.

---

## 1. Current-state audit (verified 2026-07-18)

**Component health** — 37 components, nothing pathological, but clear duplication hotspots:

| File | Lines | Problem |
|---|---|---|
| `pages/signup.page.ts` | 213 | Inline auth UI (header, card, icon-inputs, banners) |
| `pages/login.page.ts` | 210 | Same pattern, near-duplicate |
| `pages/forgot-password.page.ts` | 167 | Same pattern |
| `pages/reset-password.page.ts` | 157 | Same pattern |
| `pages/verify-email.page.ts` | 121 | Same pattern |
| `components/dashboard/progress-tab.ts` | 151 | Inline stat tiles + progress rows |
| `components/dashboard/settings-tab.ts` | 148 | Inline danger-zone / confirm UI |
| `pages/mission/[id].page.ts` | 188 | OK as orchestrator, but uses `window.confirm` and inline not-found state |

The 5 auth pages total **~870 lines of near-duplicate template**: gradient icon header + card +
label/icon/input/error field groups + status banners + submit button. This is the single biggest
refactor win.

**Visual identity** — currently generic: Tailwind `zinc-*` neutrals + Volt UI's stock blue
(`--primary`), ad-hoc `blue-500 → violet-500` gradients, hard-coded `emerald-*`/`red-*` status
banners per page. Colors are scattered as raw utilities instead of semantic tokens, which is also
how the Phase 07 dark-theme contrast bug (3.12:1 primary pair) slipped in.

**Known a11y debt** (Phase 07 close-out, prerequisite for this phase): `volt-button` host
`aria-label` doesn't reach the inner native button; responsive labels use `hidden` (removed from
a11y tree) instead of `sr-only`.

---

## 2. Identity concept: "The Lab"

Angular Lab is a place where you *run experiments* — code executes live in a sandbox. The identity
should read as a **precision instrument**: dark-first, technical, electric. Three signature moves,
used consistently and sparingly:

1. **Electric gradient** (brand → accent, indigo → cyan): logo mark, hero headline accent, the
   ring on "Live" badges. Never on body text or large fills.
2. **Mono-accent typography**: numbers, stats, badges, step counters and kbd hints render in the
   mono font — the product is about code; the type system should say so.
3. **Blueprint texture**: a very subtle grid/graph-paper pattern on hero and empty-state
   backgrounds (CSS only, both themes) replacing the current generic radial blobs.

What it is **not**: no glassmorphism-everywhere, no neon-on-black cyberpunk, no copying Angular's
official red/pink brand gradient (we riff on "lab energy", not the framework's logo).

---

## 3. Palette (candidate values — every pair must be re-validated ≥AA before merge)

Dark theme is the primary design target; light must reach full parity, not be an afterthought.
Neutrals are slightly cool/indigo-tinted to feel intentional vs. stock zinc.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `surface` (app bg) | `#FAFAFC` | `#0B0D12` | cool-tinted, not pure black/white |
| `surface-raised` (cards) | `#FFFFFF` | `#12141C` | |
| `ink` (text) | `#16161D` | `#F4F4F8` | |
| `ink-muted` | `#5C5F6E` | `#9DA0B0` | ≥4.5:1 on both surfaces |
| `line` (borders) | `#E4E5EC` | `#232734` | |
| `brand` | `#4F46E5` | `#818CF8` | indigo; fg below |
| `brand-ink` (text on brand) | `#FFFFFF` (~6.3:1) | `#0B0D12` (~6.3:1) | replaces the broken Phase 07 pair |
| `accent` | `#0891B2` | `#22D3EE` | cyan; dark ink on the dark-theme value (~10:1) |
| `success` | `#047857` | `#34D399` | fills: white-on-deep (light) / dark-on-bright (dark) |
| `warning` | `#B45309` | `#FBBF24` | same fill rule |
| `danger` | `#BE123C` | `#FB7185` | same fill rule |

Rules:

- **Status fills flip their ink**: light theme = deep fill + white text; dark theme = bright fill +
  near-black text. This is the pattern the Phase 07 bug got half-right — make it a documented rule.
- Volt UI consumes the same tokens (`--primary`, `--primary-foreground`, etc. are *mapped from*
  our semantic tokens in one place), so Volt components inherit the identity automatically. The
  current one-off overrides in `styles.css` are replaced by this mapping.
- The gradient is `brand → accent` of the active theme.

---

## 4. Token architecture (Tailwind v4)

Single source of truth in `src/styles.css` via `@theme` + the existing `.dark` custom variant:

- Semantic utilities: `bg-surface`, `bg-surface-raised`, `text-ink`, `text-ink-muted`,
  `border-line`, `bg-brand`, `text-brand-ink`, `bg-accent`, plus status trios.
- The existing `--app-*` variables and `app-gradient` / `app-glass` helpers are absorbed into this
  layer (`app-glass` survives only if it earns a place in the new identity; `app-gradient` is
  replaced by the blueprint texture).
- **Hard rule for migrated code**: no raw palette utilities (`zinc-*`, `blue-*`, `emerald-*`,
  `red-*`, hex values) in components/pages. Raw scales live only inside the token definitions.
  Add an ESLint check or a grep-based CI step if cheap; otherwise enforce in review.

## 5. Typography

- **UI**: keep Inter (already loaded, no new cost) with a defined scale — display (hero), h1–h3,
  body, small, caption. Tighten tracking on display/headings (already partially done globally).
- **Mono accent**: one mono family (prefer a system-stack `ui-monospace` first strategy; only
  self-host e.g. JetBrains Mono if the fallback stack looks bad — CSP/`self-contained` and
  performance budgets apply, no CDN fonts).
- Where mono is used: stats and numbers (home stats, dashboard %), difficulty/duration metadata,
  step counter ("Step 3 / 7"), badges, checkpoint feedback labels.

## 6. Motion

`angular-movement` is already configured (320ms, expo-out). Standardize a vocabulary instead of
per-component values: `fast` (~120ms, hover/press), `base` (~320ms, enter/reveal), `slow`
(~500ms, page-level hero only). Respect `prefers-reduced-motion` globally. No new animation
library.

---

## 7. Componentization plan

New shared primitives in `src/app/components/ui/` (scaffold with the `angular-component` skill;
every primitive ships with a Testing Library spec and a11y baked in — names, roles, focus):

| Primitive | Replaces | Used by |
|---|---|---|
| `AuthLayout` | gradient icon header + centered card shell duplicated ×5 | all 5 auth pages |
| `FormField` | label + leading icon + input + validation error group | auth pages, settings |
| `Alert` (info/success/warning/danger) | hand-rolled emerald/red/amber banner divs | auth pages, verification banner, live-preview errors |
| `PageHeader` | per-page h1 + description blocks | missions, dashboard |
| `StatTile` | inline stat boxes | `home-stats`, `progress-tab` |
| `ConfirmDialog` | `window.confirm` + inline danger confirm | mission reset, account deletion |
| `EmptyState` | inline "not found" / no-results blocks | mission not-found, filtered-empty catalog, 404 page |
| `GradientIcon` | ad-hoc `bg-gradient-to-br` icon tiles | auth header, feature cards, 404 |

Migration targets (order = value):

1. **Auth pages** (5 pages, ~870 → target ≤100 lines each) on `AuthLayout`/`FormField`/`Alert`.
2. **Dashboard tabs**: `progress-tab` → `StatTile` + a `MissionProgressRow`; `settings-tab` →
   `ConfirmDialog` + `Alert`.
3. **Mission page**: swap `window.confirm` → `ConfirmDialog`; not-found → `EmptyState`. The step
   renderers (`mission-step`, previews, checkpoint) are already well-factored — token migration
   only.
4. **Home / catalog**: `home-stats` → `StatTile`; hero + feature cards restyled to the identity;
   mission cards get the mono-accent metadata treatment and the Live-badge gradient ring.

Component rules going forward (also add to `CLAUDE.md` conventions when the phase closes):

- Pages are thin orchestrators; ~150 lines soft ceiling for any component file.
- A visual pattern used twice gets extracted to `ui/` before it's used a third time.
- Primitives take signal inputs, emit outputs, no service injection (presentational only).

---

## 8. Execution stages (one PR each)

| Stage | Scope | Acceptance |
|---|---|---|
| **0 (prereq)** | Close Phase 07: `sr-only` labels, fix primary contrast pair, re-audit | Lighthouse a11y ≥95 on `/`; PLAN/context updated |
| **A — Tokens** | `@theme` semantic layer, Volt mapping, palette in both themes, blueprint texture util | Every token pair AA-validated (documented in the PR); no raw-utility regressions in migrated files; visual smoke-check both themes |
| **B — Primitives** | The 8 `ui/` components + specs | Unit tests green; each primitive keyboard-operable and labeled |
| **C — Migrations** | Auth pages → dashboard → mission page → home/catalog (may split into 2 PRs) | Line-count targets met; E2E suite green unchanged (behavior-level selectors should survive); no `window.confirm` left |
| **D — Identity polish** | Type scale + mono accents, motion vocabulary, empty states, focus rings, logo/favicon refresh | Lighthouse a11y ≥95 both themes on `/`, `/missions`, `/login`; perf ≥90 maintained |

## 9. Out of scope

- No new features, routes, or content; no gamification (Phase 09 gate unchanged).
- No new runtime dependencies (no component libraries, no animation libs, no CDN fonts).
- Volt UI stays — we re-skin it through tokens, we don't replace it.
