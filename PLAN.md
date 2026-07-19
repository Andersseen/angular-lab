# Plan — Angular Lab

Roadmap divided into phases. Each phase is designed to be tackled in a **single fresh AI session**: start the session by reading `context.md`, then the phase section below (plus its prompt in `prompts/` if one exists). Do not start a phase until the previous one is merged.

## Where we are (verified 2026-07-18)

- ✅ **Phase 01 — Foundation**, **Phase 02 — Learning Engine**, **Phase 03 — Playground** (sandboxed execution, `previewMode`, `dom-playground`): done.
- ✅ **Auth (unplanned extra)**: Pages Functions + D1, session cookies, auth guard, dashboard shell, demo user seed.
- ✅ **Phase 04 — Server-side progress sync**: done.
- ✅ **Phase 05 — Real content (mission library)**: done — 12 missions in `src/content/missions/`, 3 tracks, 8 live previews, track + difficulty filters.
- ✅ **Phase 06 — Auth hardening & account lifecycle**: done — password reset + email verification (D1 tokens, provider-agnostic email seam), per-IP rate limiting, sliding-expiry sessions + "log out everywhere", account deletion.
- ✅ **Phase 07 — Production polish**: done — SEO meta/OG, generated robots+sitemap, editor lazy-load, analytics seam, global error handler, 404 page, a11y fixes (Lighthouse a11y 100 in both themes), full E2E journeys green.
- 🕐 **Phase 08 — UI identity & componentization refactor**: planned — see `UI-PLAN.md`.

> Details of what shipped live in `context.md`; this file tracks only what's next.

---

## Phase 04 — Server-side progress sync ✅

**Goal:** persist mission progress to D1 for logged-in users; guests keep localStorage.

**Deliverables**

- New D1 migration: `progress` table (user_id, mission_id, step index, code per step, completed_at, updated_at).
- Pages Functions: `GET/PUT /api/progress` (session-cookie authenticated, reuse `_cookies.ts` helpers).
- `ProgressSyncService`: on login, merge local → remote (remote wins on conflict by `updated_at`); write-through on step changes (debounced).
- Dashboard `progress-tab.ts` shows real data (missions started/completed, per-mission %).
- Logout keeps local copy so guest mode still works.

**Acceptance criteria**

- Complete a step logged-in on browser A → visible on browser B after login.
- Guest flow unchanged; no network calls when logged out.
- Update `specs/auth.md` + new `specs/progress.md`; run `pnpm db:migrate`.

**Key files:** `functions/api/`, `migrations/`, `src/app/core/services/storage.service.ts`, `mission-state.service.ts`, `src/app/components/dashboard/progress-tab.ts`.

---

## Phase 05 — Real content (mission library) ✅

**Goal:** replace the 4 placeholder missions with a real curriculum.

**Deliverables**

- Extract mission data out of `mission-catalog.service.ts` into content files (e.g. `src/content/missions/*.ts` or JSON) loaded lazily; keep the service API stable.
- Curriculum: 3 tracks (Fundamentals / Reactivity with Signals / Routing & Data) × 4–6 missions each, following `specs/learning-model.md` step mix.
- Each practice step gets real starter code + expected behavior runnable in the Phase 03 playground.
- Difficulty + estimated time metadata surfaced in catalog cards and `track-filter.ts`.

**Acceptance criteria**

- ≥12 missions; every mission completable end to end with real execution.
- Catalog filter by track/difficulty works; deep links `/mission/:id` work for all.
- Content lives outside component/service code (contributors add missions without touching engine code); document the flow in `context.md` §"Adding a New Mission".

---

## Phase 06 — Auth hardening & account lifecycle ✅

**Goal:** make auth production-grade on the Cloudflare free tier.

**Deliverables**

- Password reset via email (Cloudflare Email Routing / Email Service; store one-time tokens in D1 with expiry).
- Email verification on signup (soft-block: unverified users keep access, banner prompts).
- Rate limiting on `login`/`signup` (per-IP counter in D1 or Turnstile on the forms).
- Session hygiene: sliding expiry, cleanup of expired sessions, "log out everywhere".
- Account deletion (GDPR-style: cascade delete sessions + progress).

**Acceptance criteria**

- Reset flow works end to end locally with `wrangler pages dev`.
- Brute-force attempt (>N tries/min) gets 429.
- Update `specs/auth.md`; new migration files; E2E happy-path test for reset.

---

## Phase 07 — Production polish

**Goal:** quality pass before promoting the platform publicly.

**Deliverables**

- SEO: per-route meta tags/titles, Open Graph, sitemap, robots.txt (Analog route meta).
- Accessibility audit: keyboard-only mission completion, focus management on step change, ARIA on checkpoint quiz, color-contrast check in both themes.
- Performance: route-level code splitting check, editor script lazy-load (only on mission pages instead of global `index.html`), Lighthouse ≥90 on landing and catalog.
- Error/analytics: privacy-friendly analytics (e.g. Cloudflare Web Analytics), global error boundary + friendly 404/500 pages.
- E2E coverage: full guest journey + full auth journey in CI.

**Acceptance criteria**

- Lighthouse (mobile) ≥90 perf / ≥95 a11y on `/` and `/missions`.
- Playwright suite covers: browse → complete mission (guest), signup → progress sync → logout.

**Status (closed 2026-07-19):** all four close-out items done; lint ✓, unit 98/98 ✓, E2E 14/14 ✓.

1. **button-name** ✓ — `nav-links.ts` / `user-menu.ts` responsive labels moved from `hidden sm:inline` to `sr-only sm:not-sr-only`, so icon-only nav/user-menu buttons keep an accessible name on narrow viewports.
2. **Color contrast (dark theme)** ✓ — dropped the broken `.dark[data-color=volt] { --primary-foreground: #09090b }` override so dark inherits Volt's white foreground; the pinned `--primary: #2351de` now pairs at ~6.3:1 in both themes. (Phase 08's semantic token layer supersedes this one-off.)
3. **Re-audit** ✓ — Lighthouse (mobile): `/` a11y **100 in light and dark** (SEO 100, Best Practices 96); `/login` (dark) a11y **100**.
4. **E2E green** ✓ — `pnpm test:e2e` = 14/14, stable across repeated runs. Fixed pre-existing broken/flaky specs committed with `57257b1`: stale `a[routerlink="…"]` selector → `a[href="…"]` (Angular `RouterLink` reflects `href`, not `routerlink`); rapid step / keyboard navigation now asserts each transition instead of blind-looping; the anchored `/^correct!$/i` checkpoint-feedback locator (never matched the icon+text `<p>`) → substring; the ambiguous `/log out/i` selector (also matched "Log out everywhere") → exact `'Log out'`; and `workers: 1` + one local retry so the suite stops contending over the shared local D1 / per-IP rate-limit buckets.

---

## Phase 08 — UI identity & componentization refactor

**Goal:** give the platform a distinctive, professional visual identity and pay down UI duplication. Full plan, palette, token architecture, and component inventory live in **`UI-PLAN.md`** — read that file before starting this phase.

**Summary of deliverables** (details in `UI-PLAN.md`)

- Semantic design-token layer (Tailwind v4 `@theme`) replacing scattered raw `zinc-*` / `blue-*` / `emerald-*` utilities; new brand palette, AA-validated in both themes.
- Shared UI primitives (`src/app/components/ui/`): form field, alert/banner, auth layout, page header, stat tile, confirm dialog, empty state.
- Auth pages refactor: 5 pages (~870 lines of near-duplicate inline UI) rebuilt on the primitives; each page becomes a thin orchestrator.
- Typography + motion identity: mono-accent type system, standardized `angular-movement` durations/easings.

**Acceptance criteria**

- No page/component over ~150 lines of template+class (pages are thin orchestrators).
- No hard-coded palette utilities outside the token layer in migrated code.
- Lighthouse a11y ≥95 in **both** themes on `/`, `/missions`, `/login`; all unit + E2E tests stay green.
- Visual identity is consistent: one palette, one type scale, one motion vocabulary.

---

## Phase 09 — Engagement (optional, only if explicitly requested)

Gamification was intentionally out of scope until now (`specs/contribution-principles.md`). Candidate scope: streaks, badges per track, shareable completion cards, mission ratings. **Do not start without an explicit prompt from the owner.**

---

## Standing rules for every phase

1. Read `context.md` first; it replaces re-analyzing the repo.
2. Spec first: update/add the relevant file in `specs/` before coding.
3. Add/adjust tests with every behavior change (`pnpm test:unit`, `pnpm test:e2e`).
4. Keep components standalone, small, signal-based.
5. Update `context.md` (status + decisions) and this `PLAN.md` (mark the phase ✅) before ending the session.
6. Work on a feature branch, PR into `main` (CI validates lint + tests + build).
