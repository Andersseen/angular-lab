# Context — Angular Lab

This file is the primary context source for future AI sessions working on Angular Lab. **Read this instead of re-analyzing the repo.** The roadmap lives in `PLAN.md`.

## Project Identity

- **Name:** Angular Lab
- **Purpose:** Interactive learning platform for modern Angular (guided missions + in-browser coding).
- **License:** MIT
- **Repository:** github.com/Andersseen/angular-lab

## Current Status (verified 2026-07-19)

- **Phases 01–08** ✅ complete (Foundation, Learning Engine, Playground, Server-side progress sync, Real content / mission library, Auth hardening & account lifecycle, Production polish, UI identity & componentization). Next up: nothing scheduled — **Phase 09 (Engagement/gamification) is opt-in only** and needs an explicit prompt from the owner.
- Unit tests: **32 files / 111 tests, all passing** (`pnpm test:unit`, ~3s). E2E: 6 Playwright specs (`home`, `mission`, `auth`, `auth-hardening`, `not-found`, `playground`), **14 tests passing** (`pnpm test:e2e`). The E2E suite runs **single-worker**: all tests share one local D1 (SQLite) database and per-IP auth rate-limit buckets, so parallel workers cause write contention / rate-limit collisions (see Decision 13).
- Missions in catalog: **12 across 3 tracks** (Fundamentals, Reactivity with Signals, Routing & Data). **8 are `previewMode: 'live'`** (real sandboxed execution: `dom-playground`, `events-and-state`, `derived-values`, `effect-sync`, `list-search`, `form-validation`, `async-data`, `data-table-sort`); the 4 Angular-framework missions (`reactive-signals`, `component-communication`, `dependency-injection`, `modern-routing`) stay on mock preview. Content lives in `src/content/missions/*.ts`, aggregated by `src/content/missions/index.ts`.
- Playground is live: sandboxed iframe (`allow-scripts`, no `allow-same-origin`) + `postMessage`, TS transpiled in-browser (lazy `typescript` chunk, ~3.5 MB, loaded only for live missions). Spec: `specs/playground.md`.
- Auth is live and hardened (Phase 06): Pages Functions + D1, seeded demo user (`migrations/0002_seed_demo_user.sql`), password reset + email verification (one-time D1 tokens, provider-agnostic email seam), per-IP rate limiting on login/signup/reset/resend, sliding-expiry sessions + "log out everywhere", and account deletion. Schema in `migrations/0004_auth_hardening.sql`.
- Progress sync is live for logged-in users: localStorage remains the first write, then `ProgressSyncService` merges local ↔ D1 on login and write-through syncs mission changes via `GET/PUT /api/progress`. Guests stay local-only.
- Dashboard exists (`/dashboard`, auth-guarded) with profile/progress/settings tabs; the progress tab shows real started/completed counts and per-mission percentages from stored progress.
- CI: `pr-validation.yml` (lint + unit + E2E + build on PRs), `deploy-cloudflare-pages.yml` (deploy on push to `main`, needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets).

## Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Analog.js 2.6 (Angular 22 meta-framework), static build (`ssr: false`) |
| Language | TypeScript ~6.0 (strict) |
| Package manager | pnpm (Node ≥20.19.1; CI uses Node 22 + pnpm 10) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI components | Volt UI (`@voltui/components`) |
| Animations | Angular Movement (`angular-movement`) |
| Icons | `lumen-icons` |
| Code editor | Vertex Editor web components, vendored in `public/vertex-editor/` |
| Unit/component tests | Vitest 4 + Angular Testing Library |
| E2E tests | Playwright (chromium) |
| CI/CD | GitHub Actions |
| Hosting | Cloudflare Pages (free tier, static) |
| Backend | Cloudflare Pages Functions (`functions/`) |
| Database | Cloudflare D1 (binding `DB`, db `angular-lab-db`, config in `wrangler.jsonc`) |

## Project Structure

```text
angular-lab/
├── .github/workflows/       # pr-validation.yml, deploy-cloudflare-pages.yml
├── e2e/                      # Playwright: home, mission, auth (+ global-setup)
├── functions/api/            # auth endpoints + progress sync endpoint
├── migrations/               # 0001_init, 0002_seed_demo_user, 0003_progress, 0004_auth_hardening
├── prompts/                  # phase-01..03 prompts for AI sessions
├── public/vertex-editor/     # vendored web-editor(.lite).min.js
├── scripts/                  # generate-demo-hash.mjs
├── specs/                    # product, learning-model, missions, auth, contribution-principles
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── counter/      # example component + test
│   │   │   ├── dashboard/    # profile-tab, progress-tab, settings-tab
│   │   │   ├── editor/       # vertex-editor.ts (Angular wrapper)
│   │   │   ├── home/         # hero, features, feature-card, stats
│   │   │   ├── layout/       # shell, nav-links, app-logo, theme-toggle, user-menu
│   │   │   └── mission/      # step renderers, editor-panel, live-preview, mock-preview, mock/*, cards, filters
│   │   ├── core/
│   │   │   ├── guards/       # auth.guard.ts
│   │   │   ├── models/       # mission.model.ts, user.model.ts
│   │   │   ├── playground/   # runner-doc.ts (iframe srcdoc), friendly-error.ts
│   │   │   └── services/     # auth, code-executor, mission-catalog, mission-state, storage, theme
│   │   └── pages/            # index, missions, mission/[id], mission/index (redirect),
│   │                         # login, signup, dashboard (guarded)
│   ├── content/missions/     # mission library: one Mission per file + index.ts (Phase 05)
│   ├── styles.css            # Tailwind v4 + @source directives
│   └── test-setup.ts
├── PLAN.md                   # phase roadmap (source of truth for what's next)
├── context.md                # this file
├── wrangler.jsonc            # Pages + D1 config
└── vite.config.ts / angular.json / playwright.config.ts / eslint.config.mjs
```

## Important Decisions

1. **Tailwind v4 scans Volt UI and Angular Movement**
   - `src/styles.css` uses `@source` directives to scan `node_modules/@voltui/components` and `node_modules/angular-movement` so their host classes are generated.
   - Global `button`/`a` styles from the original Vite template were removed (they override Tailwind utility layers).

2. **Static build for Cloudflare Pages**
   - Analog is `ssr: false` / `static: true`; output `dist/analog/public`. Keeps the free tier; backend logic goes in Pages Functions only.

3. **Peer dependency overrides**
   - `@voltui/components` and `angular-movement` declare Angular `^21.2.0` peers; project is on Angular 22. pnpm `overrides` force the project's versions. Removing them brings peer warnings back.

4. **Vertex Editor integration**
   - Ships as self-contained web components from `Andersseen/vertex` GitHub releases (NOT on npm; `pnpm install:vertex` refreshes assets).
   - Full editor script is loaded globally in `index.html` (candidate for lazy-load in Phase 07).
   - Use the `app-vertex-editor` wrapper: waits for `customElements.whenDefined`, avoids clobbering value while typing, reacts to `language`/`theme` changes.

5. **Spec-driven development**
   - Behavior lives in `specs/` (no implementation details there). Tech choices live here, in `README.md`, prompts, and config.

6. **Mission state architecture**
   - Models in `core/models/`; `MissionCatalogService` returns the static catalog grouped by track; `MissionStateService` holds active mission/step/code-per-step in signals; `StorageService` persists to localStorage with error handling. Pages/components are thin orchestrators.
   - Step types: `concept`, `example`, `practice`, `comparison`, `checkpoint`, `summary`.

7. **Dark mode handling**
   - `ThemeService`: `light` | `dark` | `system`, stored under `angular-lab:theme`, toggles `dark` class on `<html>`; injected in `App` root so it initializes at startup.

8. **Playground: sandboxed iframe execution (Phase 03)**
   - Missions declare `previewMode?: 'live' | 'mock'` (default `mock`). Live missions render `LivePreview`; the rest keep `MockPreview` (fake UI, labeled "Mock preview").
   - Sandbox: persistent `<iframe sandbox="allow-scripts">` (NO `allow-same-origin`) with a fixed `srcdoc` runner (`core/playground/runner-doc.ts`). Parent transpiles TS with lazy-loaded `typescript` (`transpileModule`, separate ~3.5 MB chunk) and posts compiled JS; runner executes with `new Function(root, console, code)` in try/catch.
   - Protocol: parent `{source:'angular-lab', type:'ping'|'run'}`; sandbox `{source:'angular-lab-playground', type:'ready'|'done'|'error'|'console'}`. Readiness is a ping/pong handshake (the iframe may load before the service listens). 3s timeout → friendly "not responding" message.
   - Snippets must be self-contained: import/export is rejected up front with a friendly message (checked via `ts.createSourceFile` walk, not runtime failure).
   - Errors (transpile, runtime, console.error) map to plain language in `core/playground/friendly-error.ts` and render in a `role="alert"` region. Spec: `specs/playground.md`.
   - The 4 Angular-code missions stay on mock: real Angular JIT in an `allow-scripts`-only sandbox needs heavy vendoring; WebContainers (COOP/COEP) is the evaluation path if framework execution becomes a requirement.

9. **Authentication on Cloudflare free tier**
   - Pages Functions (`functions/api/auth/*`) + D1. PBKDF2-SHA256 via Web Crypto (`_crypto.ts`); sessions = opaque IDs in D1, HTTP-only Secure SameSite=Lax cookies (`_cookies.ts`).
   - Guests get full mission access; progress stays local. Email verification, password reset, and rate limiting landed in Phase 06 (Decision 12).
   - Local dev with functions: `pnpm db:migrate` then `pnpm dev:pages` (port 8788). Plain `pnpm dev` (port 5173) has NO functions → auth calls fail there.

10. **Progress sync (Phase 04)**
   - D1 table `progress` stores one row per `(user_id, mission_id)`: current step, code per step, completion timestamp and `updated_at` for conflict resolution.
   - `GET/PUT /api/progress` reuse session-cookie authentication through `functions/api/_session.ts`; unauthenticated progress calls return 401.
   - `ProgressSyncService` is initialized from `App`, never calls `/api/progress` while logged out, merges local and remote progress on login (remote wins timestamp ties), and debounces authenticated writes.
   - `MissionStateService` still writes localStorage first, now including `completedAt` and `updatedAt`, then asks the sync service to push in the background.

11. **Mission content library (Phase 05)**
   - Mission data lives in `src/content/missions/*.ts` (one `Mission` per file), aggregated by `src/content/missions/index.ts` into the `MISSIONS` array. `MissionCatalogService` imports that array; its API (`getAll`/`getById`/`getTracks`/`getByTrack`) is unchanged, so pages/services/tests were untouched. Contributors add a mission by creating a file and adding one line to the index.
   - The library is imported eagerly (bundled into the `mission-catalog.service` chunk, ~13 KB gzip). True per-mission dynamic `import()` (split metadata vs. body) is deferred to the Phase 07 performance pass — the real weight is the `typescript` chunk, not mission text.
   - Curriculum: 12 missions, 3 tracks × 4. `Mission` gained optional `goal` and `prerequisites` (validated by `mission-catalog.service.spec.ts`). The missions page filters by track **and** difficulty (`difficulty-filter.ts`); cards show a "Live" badge for `previewMode: 'live'`.
   - "Real execution" is satisfied by making every mission that *can* be self-contained plain TS a live preview (8/12). The 4 genuine Angular-framework missions stay mock until framework execution lands (WebContainers, Decision 8).

12. **Auth hardening & account lifecycle (Phase 06)**
   - Migration `0004_auth_hardening.sql` adds `users.email_verified`, `password_reset_tokens`, `email_verification_tokens`, and `auth_rate_limits`. Reset/verification tokens store only a SHA-256 **hash** (`_tokens.ts`); the raw token lives only in the emailed link. Reset TTL 1h, verification TTL 24h; both single-use.
   - Email is provider-agnostic (`_email.ts`): local/dev logs the link and, on `localhost`, endpoints echo it as `devLink` so the flow is E2E-testable without a provider; production wiring (Cloudflare Email Service) is a documented seam. Password reset returns the same generic 200 whether or not the email exists (no enumeration) and invalidates all sessions.
   - Rate limiting (`_rate-limit.ts`): fixed-window per-IP counters in D1, keyed by `action:ip:windowIndex`, `CF-Connecting-IP` for the IP; login 10 / signup·reset·resend 5 per 15 min → 429 with `Retry-After`. E2E clears `auth_rate_limits` in `global-setup` and isolates buckets via a unique `CF-Connecting-IP` per test.
   - Sessions: `me` applies sliding expiry (extend to full 7 days once a session ages past a day, ≤1 write/day) and returns `emailVerified`; login opportunistically deletes expired sessions; `logout-all` and reset delete all of a user's sessions. Account deletion (`delete-account`) explicitly batch-deletes progress/sessions/tokens/user (D1 does not enforce FK cascade).
   - Frontend: `/forgot-password`, `/reset-password`, `/verify-email` pages; a shell-wide verification banner (`email-verification-banner.ts`) with resend; dashboard settings gained "log out everywhere" + confirm-gated account deletion; login shows a "Forgot password?" link and a post-reset notice.

13. **Production polish & accessibility (Phase 07)**
   - Shipped in `57257b1`: per-route SEO meta/OG (Analog route meta), generated `robots.txt` + `sitemap.xml` (`scripts/generate-seo-assets.mjs`, run by `build:prod`), Vertex editor lazy-load (loaded on mission pages, not global `index.html`), a privacy-friendly analytics seam, a global `ErrorHandler`, and a friendly 404 page (`pages/[...not-found].page.ts`).
   - Two a11y fixes closed the phase (verified via Lighthouse mobile, a11y **100 in both themes** on `/` and `/login`): responsive nav/user-menu labels use `sr-only sm:not-sr-only` (not `hidden`) so icon-only buttons keep an accessible name on narrow viewports; and the dark-theme primary pair was fixed by **removing** the `.dark[data-color=volt] { --primary-foreground: #09090b }` override so the pinned `--primary: #2351de` inherits Volt's white foreground (~6.3:1). **Phase 08 replaces these `styles.css` one-offs with a semantic token layer.**
   - **E2E runs single-worker** (`playwright.config.ts` `workers: 1`, plus one local retry): the suite shares one local D1 (SQLite) + per-IP rate-limit buckets, so parallel workers cause write contention / rate-limit collisions; `global-setup.ts` also clears `auth_rate_limits` per run. When writing E2E: Angular `RouterLink` reflects `href` (there is no `routerlink` DOM attribute), disambiguate substring names (`'Log out'` also matched "Log out everywhere"), and assert each step transition rather than blind-looping `Next` — rapid navigation races the live-preview step re-renders.

14. **Design system & UI identity (Phase 08)**
   - **One token layer** in `src/styles.css`: `@theme inline` maps Tailwind colour utilities onto namespaced custom properties (`--al-surface`, `--al-ink`, `--al-brand`, `--al-accent`, status trios), defined for light in `:root` and dark in `.dark`. Components use only semantic utilities (`bg-surface`, `text-ink`, `border-line`, `bg-brand`/`text-brand-ink`, `bg-success`…) — **no raw palette utilities anywhere in `src/app`**.
   - **The `--al-` prefix is load-bearing.** Volt's theme defines `--surface`, `--success` and `--warning` on `:root[data-color=volt]`, which outranks a plain `:root`; unprefixed tokens get silently overridden by Volt's palette. Volt itself is re-skinned by mapping `--primary`/`--primary-foreground` onto the brand tokens.
   - **Contrast rule:** validate each status colour as text **on its own 10% tint** (`bg-success/10 text-success`), not just on the plain surface — that badge/alert pattern is the tightest pair and is what set light accent `#0c6a84` and warning `#92400e`. Status fills flip their ink: light = deep fill + white text, dark = bright fill + near-black text.
   - **Shared primitives** live in `src/app/components/ui/` (GradientIcon, Alert, FormField, AuthLayout, PageHeader, StatTile, ConfirmDialog, EmptyState). They are presentational only: signal inputs, outputs, no service injection, a11y baked in, one Testing Library spec each. A visual pattern used twice belongs here before a third use.
   - **Gotcha:** `[class.foo]` bindings cannot express token classes containing `/` or `dark:` — use a `[class]="…"` helper method returning the full class string (see `checkpoint-question`, `mission-nav`).
   - `FormField` renders a native `<label for>` because Volt's `<volt-label for>` does not reach the inner `<label>`; this makes the control's accessible name the label text, which E2E selectors rely on.
   - Identity signatures: electric `brand → accent` gradient (`.bg-gradient-brand` / `.text-gradient-brand`) on logo/hero/icon tiles, a blueprint grid texture (`.app-blueprint`, aliased by the legacy `.app-gradient`) on hero and empty-state backgrounds, and mono type for numbers, stats and metadata.

## Conventions

- Standalone, small components; signal-based state; semantic accessible HTML.
- Tests verify user-visible behavior, not implementation details.
- No payments, real lessons, or gamification without an explicit phase prompt (see `PLAN.md` phase 08 note).
- When changing auth behavior: update `specs/auth.md` and run `pnpm db:migrate`.
- Spec first, then code; update `context.md` + `PLAN.md` at the end of each phase session.

## Common Commands

```bash
pnpm install          # install dependencies
pnpm dev              # Vite dev server :5173 (NO Pages Functions / auth)
pnpm dev:pages        # build + wrangler pages dev :8788 (with functions + D1)
pnpm db:migrate       # apply D1 migrations locally
pnpm build:prod       # production build → dist/analog/public
pnpm preview          # serve production build (static only)
pnpm test:unit        # Vitest (44 tests)
pnpm test:e2e         # Playwright
pnpm lint             # ESLint
pnpm install:vertex   # refresh vendored Vertex Editor assets
pnpm deploy           # manual build + wrangler pages deploy
```

## Adding a New Mission

1. Create `src/content/missions/<id>.ts` exporting a `Mission`, then register it in `src/content/missions/index.ts`. No service/engine code changes — `MissionCatalogService` reads the aggregated `MISSIONS` array.
2. Follow the `Mission`/`Step` interfaces in `src/app/core/models/mission.model.ts` (step types in Decision 6). Front matter: `goal`, `difficulty`, `durationMinutes`, `track` (one of `Fundamentals` / `Reactivity with Signals` / `Routing & Data`), `tags`, optional `prerequisites` (existing mission ids).
3. Set `previewMode: 'live'` when the starter code is self-contained plain TS that renders into `root` (no `import`/`export` — see `specs/playground.md`); otherwise it falls back to mock preview and needs a matching mock case in `src/app/components/mission/mock-preview.ts` if it has practice/example steps.
4. Tests: `mission-catalog.service.spec.ts` enforces the invariants automatically (unique ids, prerequisites resolve, live starter code has no import/export). Add an E2E in `e2e/playground.spec.ts` for new live missions.

## Known Issues / Watch List

- 4 of 12 missions (the Angular-framework ones) stay on mock preview; real Angular execution would need WebContainers (COOP/COEP) — see Decision 8.
- `typescript` lazy chunk is ~3.5 MB raw (~1 MB gzip), loaded only on first live-preview run (Phase 07 performance pass).
- Email delivery is a log-only seam (Decision 12); no real provider is wired, so production password reset / verification needs Cloudflare Email Service + verified domain (SPF/DKIM/DMARC) before launch.
- Vertex Editor loads globally in `index.html` even on pages without an editor (Phase 07).
- `@voltui/components` / `angular-movement` peer-dep overrides must stay until they support Angular 22.
- `.env` exists at repo root (gitignored) — do not commit secrets.
