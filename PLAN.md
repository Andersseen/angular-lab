# Plan — Angular Lab

Roadmap divided into phases. Each phase is designed to be tackled in a **single fresh AI session**: start the session by reading `context.md`, then the phase section below (plus its prompt in `prompts/` if one exists). Do not start a phase until the previous one is merged.

## Where we are (verified 2026-07-16)

- ✅ **Phase 01 — Foundation**, **Phase 02 — Learning Engine**, **Phase 03 — Playground** (sandboxed execution, `previewMode`, `dom-playground`): done.
- ✅ **Auth (unplanned extra)**: Pages Functions + D1, session cookies, auth guard, dashboard shell, demo user seed.
- 🕐 **Phase 04 — Server-side progress sync**: NOT started. Next up.

> Details of what shipped live in `context.md`; this file tracks only what's next.

---

## Phase 04 — Server-side progress sync

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

## Phase 05 — Real content (mission library)

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

## Phase 06 — Auth hardening & account lifecycle

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

---

## Phase 08 — Engagement (optional, only if explicitly requested)

Gamification was intentionally out of scope until now (`specs/contribution-principles.md`). Candidate scope: streaks, badges per track, shareable completion cards, mission ratings. **Do not start without an explicit prompt from the owner.**

---

## Standing rules for every phase

1. Read `context.md` first; it replaces re-analyzing the repo.
2. Spec first: update/add the relevant file in `specs/` before coding.
3. Add/adjust tests with every behavior change (`pnpm test:unit`, `pnpm test:e2e`).
4. Keep components standalone, small, signal-based.
5. Update `context.md` (status + decisions) and this `PLAN.md` (mark the phase ✅) before ending the session.
6. Work on a feature branch, PR into `main` (CI validates lint + tests + build).
