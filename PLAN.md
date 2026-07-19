# Plan — Angular Lab

The roadmap. Each phase is sized for a **single fresh AI session**: start by reading
`context.md` (what exists and why), then the phase section here. Don't start a phase
until the previous one is merged.

## Status (verified 2026-07-19)

**The planned roadmap is complete.** Phases 01–09 are shipped and merged; there is no
scheduled next phase. What shipped, and where the detail lives:

| # | Phase | Shipped |
|---|-------|---------|
| 01 | Foundation | Analog + Angular 22, Tailwind v4, Volt UI, CI |
| 02 | Learning Engine | mission/step model, state service, local persistence |
| 03 | Playground | sandboxed iframe execution, `previewMode`, friendly errors |
| 04 | Server-side progress sync | D1 `progress`, `GET/PUT /api/progress`, merge on login |
| 05 | Real content | 12 missions / 3 tracks in `src/content/missions/`, 8 live |
| 06 | Auth hardening | reset + verification, rate limiting, session hygiene, deletion |
| 07 | Production polish | SEO, a11y (Lighthouse 100), lazy editor, 404, analytics seam |
| 08 | UI identity | `--al-*` token layer, 8 shared `ui/` primitives, auth rebuild |
| 09 | Engagement | practice streak, derived badges, shareable completion card |

**Every design decision behind these lives in `context.md`** — that file is the one to
read, not this one. This file only tracks what is *next*.

## Phase 09 — Engagement ✅

Closed 2026-07-19. Scope was chosen deliberately: **reflective, not coercive** — it
reports practice the learner already did. No points, no leaderboards, no notifications
(`specs/engagement.md`).

- **Streak** — D1 `activity_days` + `GET/PUT /api/activity`, union-merge sync,
  local-first like progress. Recorded on any persisted mission change.
- **Badges** — 9 badges derived, never stored, from completed missions + longest
  streak, so they cannot drift and cannot be lost. Always visible with progress.
- **Completion card** — self-contained SVG (dark identity, no account data), saved as
  PNG via canvas with an SVG fallback, plus a copyable summary.
- **Dashboard → Achievements** tab; mission completion names the badges *that*
  completion unlocked (a with/without diff — no "seen" state to keep in sync).

Also fixed in the same pass: the auth pages had `<input volt-input>`, but Volt ships
`volt-input` as an *element* component, so Angular ignored the attribute and every auth
control rendered unstyled — replaced with the token-driven `.al-input`. Password fields
gained a show/hide toggle, and nav links now mark the active route.

Verified: lint clean, unit **158/158**, E2E **17/17**, `build:prod` clean, both themes
checked in the browser.

## What's next

Nothing is scheduled. Candidates, none started, none committed to:

- **Mission ratings** — the one Phase 09 candidate deliberately left out; it needs a new
  table, endpoints, and a guest-voting policy, so it is its own phase.
- **Framework execution in the playground** — the 4 Angular-framework missions stay on
  mock preview until WebContainers (COOP/COEP) is evaluated (`context.md` Decision 8).
- **Real email delivery** — the provider seam is wired but no provider is
  (`context.md` Decision 12); required before a public launch.
- **More content** — the mission library takes new missions without engine changes
  (`context.md` §"Adding a New Mission").

## Standing rules for every phase

1. Read `context.md` first; it replaces re-analyzing the repo.
2. Spec first: update/add the relevant file in `specs/` before coding.
3. Add/adjust tests with every behavior change (`pnpm test:unit`, `pnpm test:e2e`).
4. Keep components standalone, small, signal-based.
5. Update `context.md` (status + decisions) and this file before ending the session.
6. Work on a feature branch, PR into `main` (CI validates lint + tests + build).
