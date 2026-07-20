# Context — Angular Lab

This file is the primary context source for future AI sessions working on Angular Lab. **Read this instead of re-analyzing the repo.** The roadmap lives in `PLAN.md`.

## Project Identity

- **Name:** Angular Lab
- **Purpose:** Interactive learning platform for modern Angular (guided missions + in-browser coding).
- **License:** MIT
- **Repository:** github.com/Andersseen/angular-lab

## Current Status (verified 2026-07-20)

- **Phases 01–09** ✅ complete (Foundation, Learning Engine, Playground, Server-side progress sync, Real content / mission library, Auth hardening & account lifecycle, Production polish, UI identity & componentization, Engagement). **The planned roadmap is done — nothing is scheduled.** `PLAN.md` lists uncommitted candidates.
- i18n is live (not a numbered phase, an ad hoc addition): English/Spanish/Ukrainian, covering UI chrome **and all mission content — no learner-facing text lives in a `.ts` file anywhere, including English**. `ngx-translate` for UI chrome; `MissionTranslationService` assembles mission `Mission` objects from structural `MissionMeta` (in `.ts`) + JSON text (all three languages). Instant no-reload switching, persisted per learner. Spec: `specs/i18n.md`, Decision 17.
- Unit tests: **45 files / 476 tests, all passing** (`pnpm test:unit`, ~5s — `src/content/missions/translations.spec.ts` alone is 307 structural checks of the mission translations, including full-coverage checks on `en.json`, against the real `MissionMeta` data). E2E: 7 Playwright specs (`home`, `mission`, `auth`, `auth-hardening`, `achievements`, `not-found`, `playground`), **17 tests passing** (`pnpm test:e2e`). The E2E suite runs **single-worker**: all tests share one local D1 (SQLite) database and per-IP auth rate-limit buckets, so parallel workers cause write contention / rate-limit collisions (see Decision 13).
- Missions in catalog: **12 across 3 tracks** (Fundamentals, Reactivity with Signals, Routing & Data). **8 are `previewMode: 'live'`** (real sandboxed execution: `dom-playground`, `events-and-state`, `derived-values`, `effect-sync`, `list-search`, `form-validation`, `async-data`, `data-table-sort`); the 4 Angular-framework missions (`reactive-signals`, `component-communication`, `dependency-injection`, `modern-routing`) stay on mock preview. Structural data lives in `src/content/missions/*.ts` (aggregated by `src/content/missions/index.ts`); all mission text lives in `public/i18n/missions/*.json` (Decision 17).
- Playground is live: sandboxed iframe (`allow-scripts`, no `allow-same-origin`) + `postMessage`, TS transpiled in-browser (lazy `typescript` chunk, ~3.5 MB, loaded only for live missions). Spec: `specs/playground.md`.
- Auth is live and hardened (Phase 06): Pages Functions + D1, seeded demo user (`migrations/0002_seed_demo_user.sql`), password reset + email verification (one-time D1 tokens, provider-agnostic email seam), per-IP rate limiting on login/signup/reset/resend, sliding-expiry sessions + "log out everywhere", and account deletion. Schema in `migrations/0004_auth_hardening.sql`.
- Progress sync is live for logged-in users: localStorage remains the first write, then `ProgressSyncService` merges local ↔ D1 on login and write-through syncs mission changes via `GET/PUT /api/progress`. Guests stay local-only.
- Dashboard exists (`/dashboard`, auth-guarded) with profile/progress/**achievements**/settings tabs; the progress tab shows real started/completed counts and per-mission percentages from stored progress, and the achievements tab shows the practice streak and the badge catalogue.
- Engagement is live (Phase 09): a practice-day streak (D1 `activity_days`, `GET/PUT /api/activity`), 9 derived badges, and a shareable SVG completion card on mission completion. Spec: `specs/engagement.md`.
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
├── e2e/                      # Playwright: home, mission, playground, auth, auth-hardening,
│                             # achievements, not-found (+ global-setup)
├── functions/api/            # auth endpoints + progress & activity sync endpoints
├── migrations/               # 0001_init, 0002_seed_demo_user, 0003_progress,
│                             # 0004_auth_hardening, 0005_engagement
├── public/vertex-editor/     # vendored web-editor(.lite).min.js
├── public/i18n/              # en.json, es.json, uk.json — UI chrome translations (Decision 17)
│   └── missions/             # en.json (eager, required), es.json, uk.json (lazy overlays) —
│                             # ALL mission text lives here, not in src/content/missions/*.ts
├── scripts/                  # generate-demo-hash.mjs, generate-seo-assets.mjs
├── specs/                    # product, learning-model, missions, playground, auth, progress,
│                             # engagement, production, contribution-principles, i18n
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── counter/      # example component + test
│   │   │   ├── dashboard/    # profile-tab, progress-tab, achievements-tab, settings-tab
│   │   │   ├── editor/       # vertex-editor.ts (Angular wrapper)
│   │   │   ├── home/         # hero, features, feature-card, stats
│   │   │   ├── layout/       # shell, nav-links, app-logo, theme-toggle, user-menu,
│   │   │   │                 # language-switcher
│   │   │   ├── mission/      # step renderers, editor-panel, live/mock preview, completion-card,
│   │   │   │                 # mission-completed, cards, filters
│   │   │   └── ui/           # shared presentational primitives (Decision 14 + 15)
│   │   ├── core/
│   │   │   ├── achievements/ # streak.ts, badges.ts, share-card.ts, share-image.ts (pure)
│   │   │   ├── guards/       # auth.guard.ts
│   │   │   ├── models/       # mission.model.ts, user.model.ts, achievement.model.ts
│   │   │   ├── playground/   # runner-doc.ts (iframe srcdoc), friendly-error.ts
│   │   │   └── services/     # auth, activity, achievements, code-executor, mission-catalog,
│   │   │                     # mission-state, progress-sync, storage, theme, language,
│   │   │                     # mission-translation, analytics
│   │   └── pages/            # index, missions, mission/[id], mission/index (redirect), login,
│   │                         # signup, forgot/reset password, verify-email, dashboard (guarded),
│   │                         # [...not-found]
│   ├── content/missions/     # mission library: one MissionMeta (structural only, no text) per
│   │                         # file + index.ts (Phase 05); translations.spec.ts validates
│   │                         # public/i18n/missions/*.json against it (Decision 17)
│   ├── styles.css            # Tailwind v4 + @source + the --al-* token layer
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
   - **One token layer** in `src/styles.css`: `@theme inline` maps Tailwind colour utilities onto namespaced custom properties (`--al-surface`, `--al-ink`, `--al-brand`, `--al-accent`, status trios), defined for light in `:root` and dark in `.dark`. Components use only semantic utilities (`bg-al-surface`, `text-al-ink`, `border-al-line`, `bg-al-brand`/`text-al-brand-ink`, `bg-al-success`…) — **no raw palette utilities anywhere in `src/app`**.
   - **The `al-` prefix is load-bearing on two levels.** (1) Custom properties: Volt defines `--surface`/`--success`/`--warning` on `:root[data-color=volt]`, which outranks a plain `:root`. (2) Tailwind colour names: Volt's components are themselves built from utility classes (`hover:bg-accent` ×36, `bg-surface` ×24), so naming a theme colour `accent` re-points Volt's own hover styles at our palette while Volt keeps using its neutral `--accent-foreground` for the text — that shipped a 1.65:1 ghost-button hover. Volt is re-skinned only through `--primary`/`--primary-foreground` → brand tokens; everything else of Volt's is left alone.
   - **`:hover` / `:focus` states are invisible to Lighthouse and axe** — they only audit the default state. Hover pairs must be checked by hand (hover the element, then read computed colours; resolve `lab()`/`oklch()` via a canvas fill, since naive regex parsing of those formats silently produces nonsense ratios).
   - **Contrast rule:** validate each status colour as text **on its own 10% tint** (`bg-success/10 text-success`), not just on the plain surface — that badge/alert pattern is the tightest pair and is what set light accent `#0c6a84` and warning `#92400e`. Status fills flip their ink: light = deep fill + white text, dark = bright fill + near-black text.
   - **Shared primitives** live in `src/app/components/ui/` (GradientIcon, Alert, FormField, AuthLayout, PageHeader, StatTile, ConfirmDialog, EmptyState). They are presentational only: signal inputs, outputs, no service injection, a11y baked in, one Testing Library spec each. A visual pattern used twice belongs here before a third use.
   - **Gotcha:** `[class.foo]` bindings cannot express token classes containing `/` or `dark:` — use a `[class]="…"` helper method returning the full class string (see `checkpoint-question`, `mission-nav`).
   - `FormField` renders a native `<label for>` because Volt's `<volt-label for>` does not reach the inner `<label>`; this makes the control's accessible name the label text, which E2E selectors rely on.
   - Identity signatures: electric `brand → accent` gradient (`.bg-gradient-brand` / `.text-gradient-brand`) on logo/hero/icon tiles, a blueprint grid texture (`.app-blueprint`, aliased by the legacy `.app-gradient`) on hero and empty-state backgrounds, and mono type for numbers, stats and metadata.

15. **Engagement: streaks, badges, completion card (Phase 09)**
   - **Product stance:** engagement is *reflective, never coercive* — it reports practice the learner already did. No points, no leaderboards, no notifications, and nothing gated behind a badge (`specs/engagement.md`). Ratings were deliberately left out of this phase.
   - **Only practice days are stored.** Migration `0005_engagement.sql` adds `activity_days (user_id, day)`; `day` is the learner's *local* calendar day as `YYYY-MM-DD`. `MissionStateService.persist()` calls `ActivityService.recordToday()`, so any persisted change counts as practice and merely opening a mission does not.
   - **Sync is a union, not a merge.** The set is append-only, so `PUT /api/activity` sends what the device knows and returns everything the account knows — one request does login-merge *and* push, with no timestamps and no conflict rule (contrast progress, Decision 10). The server keeps a bounded window (400 days).
   - **Badges are derived, never stored** (`core/achievements/badges.ts`). Every requirement rests on a monotonically increasing value (missions completed, *longest* streak), which is what guarantees a recomputation can never revoke an earned badge. Track badges are generated from the catalog, so adding a track adds its badge.
   - **"Badges this completion unlocked"** is a with/without diff over the same pure function — no "already seen" state to persist, drift, or reset.
   - **The completion card is a self-contained SVG** built by `core/achievements/share-card.ts`: fixed dark-identity hexes (it leaves the app, so it must not follow the viewer's theme), generic font families (no external font loads inside an `<img>`-rendered SVG), every value XML-escaped, and no account data. Angular's URL sanitizer allowlists only *raster* `data:` images, so the `<img [src]>` needs `bypassSecurityTrustUrl`. Saving rasterises through canvas to PNG (data-URL SVG does not taint it) and falls back to saving the SVG.
   - **Gotcha — a signal-reading effect that writes back loops forever.** `ActivityService`'s login effect calls `syncWithRemote()`, which reads `days` and writes it from the response; it must be wrapped in `untracked()`.

16. **Form controls are native, not Volt (found in Phase 09)**
   - Volt ships `volt-input` as an **element component** (`<volt-input>`) with its own ControlValueAccessor — not an attribute directive. The auth pages had been writing `<input volt-input>` *and* not importing it, so Angular silently ignored both and every auth control rendered as an unstyled native input. `.al-input` in `styles.css` now styles the native control from the token layer, which also keeps FormField's native `<label for>` wiring (Decision 14) and the reactive-forms bindings intact.
   - `.al-input` lives in `@layer components` **on purpose**: outside a layer it outranks Tailwind utilities and eats the `pl-9` / `pr-10` that make room for the field icon and the password toggle.

17. **i18n: `ngx-translate`, UI chrome + mission content, English/Spanish/Ukrainian**
   - **Chose `ngx-translate` over Analog's built-in `provideI18n()`.** Analog wraps Angular's `$localize`; on a static build it resolves the locale from the first URL segment and switching languages means navigating to a different locale-prefixed route (already-rendered components don't react to a runtime change). That would have meant prefixing every route and touching the SEO/sitemap script and E2E. `ngx-translate` v18 is signals-backed internally (`TranslateService` stores translations in a `signal()`; `TranslatePipe` is `pure:false` + `markForCheck()`), so it's zoneless-compatible and gives an **instant, no-navigation** switch — the same UX as `ThemeService`'s toggle.
   - **Scope: UI chrome and all mission content, in every language including English — no learner-facing text lives in a `.ts` file anywhere.** First pass covered UI chrome only, with mission content deliberately deferred (quality-review risk); a same-day follow-up request explicitly asked for full JSON-only content, English included, so mission text was extracted out of `src/content/missions/*.ts` too. What stays out: track names (`Mission.track`, free-form, not an enum), server-driven auth error strings, `routeMeta` `<title>`/meta tags (always English, regardless of active language — see below), `starterCode`, and the completion-card SVG's own baked-in labels (Decision 15 — it leaves the app with a fixed identity). Full boundary and reasoning: `specs/i18n.md`.
   - **`LanguageService`** (`core/services/language.service.ts`) mirrors `ThemeService`'s shape exactly: a signal, an `angular-lab:lang` localStorage key, an SSR-guarded `getInitialLang()`. `app.config.ts` calls the same `getInitialLang()` (not a hardcoded `'en'`) when configuring `provideTranslateService`, so there's no English-then-target-language double fetch on boot; a `provideAppInitializer` blocks first render on that initial `translate.use()` call to avoid a flash of raw translation keys.
   - **Gotcha — `[value]` on a native `<select>` races its `@for`-generated `<option>`s.** Binding `[value]="lang()"` on the `<select>` itself intermittently left the browser showing the first `<option>` as selected (visually wrong) even though the correct language was active — a known class of bug where a parent's value binding can evaluate before dynamically-created child options exist to match against. Fixed by binding `[selected]="option.code === lang()"` on each `<option>` instead, which ties selection to each option's own binding rather than a parent/child race. Caught only by an actual browser check — unit tests didn't fail (jsdom/Testing Library assert on the DOM `value`, not the visually-selected option) and would not have here either.
   - **Testing:** UI-chrome unit tests keep passing unmodified. `test-setup.ts` globally provides `TranslateService` with a **synchronous** loader built from a direct `import` of `public/i18n/en.json` (`of(en)` resolves before first render), so `getByText('Sign in')`-style assertions still match — `en.json`'s values are verbatim copies of the strings that used to be hardcoded. Requires `"resolveJsonModule": true` in `tsconfig.json`.
   - **Badge titles/descriptions** (`core/achievements/badges.ts`, a pure function with no DI) hold translation **keys**, not literal text — `Badge` gained optional `titleParams`/`descriptionParams` for the one dynamic case (track badges interpolate the untranslated track name). `BadgeTile` resolves both via the `translate` pipe.
   - **Mission content is split into a structural layer and a text layer** (`MissionMeta` vs. `Mission` in `mission.model.ts`). `src/content/missions/*.ts` now export `MissionMeta` — `id`, `difficulty`, `durationMinutes`, `track`, `tags`, `prerequisites`, `previewMode`, `starterCode`, and each step's `id`/`type`/(checkpoint `correctIndex`s) — with **zero text**. All text, every language including English, lives in `public/i18n/missions/{en,es,uk}.json`.
   - **`MissionTranslationService`** (`core/services/mission-translation.service.ts`) fetches `en.json` **once, eagerly**, the moment it's first injected (visiting `/missions`, `/mission/[id]`, or the dashboard progress tab) — it's the required base with nowhere further to fall back to, and `routeMeta` needs it too. Non-English overlays stay lazy, fetched only on an actual language switch. `ready()` gates a `common.loading` message on the consuming pages during the (typically sub-second) initial fetch, so learners see a loading state instead of a flashed-empty catalog or false "not found". `hydrate(meta)` assembles the full `Mission` — English base + active-language overlay, falling back field-by-field — called once at the page level (`missions.page.ts`, `mission/[id].page.ts`, `dashboard/progress-tab.ts`) and passed down through existing component inputs, so `MissionHeader`/`MissionStep`/`MissionCard`/etc. needed zero changes. `MissionCatalogService`/`MissionStateService` stay structural-only internally (progress tracking keys off step `id`s, which don't change across languages).
   - **`routeMeta`'s title/meta resolve asynchronously** via `MissionTranslationService.getEnglishSummary(id)`, an `Observable` — Angular's `ResolveFn` supports this natively (it's the same mechanism as a route resolver), so `<title>`/meta tags update correctly even on a direct/bookmarked mission-page load, without needing to preload anything at app bootstrap. `en.json` is fetched once and shared (RxJS `shareReplay(1)`) between the resolver and the rest of the page.
   - **Gotcha — checkpoint `options` are matched by array position, not by content.** `CheckpointMeta.correctIndex` lives in the structural layer, not any translation file; a translated `options` array shorter than `correctIndex`, or reordered relative to English, would silently point "correct" at the wrong translated option. `src/content/missions/translations.spec.ts` checks this (plus full-coverage requirements on `en.json` and comparison-table row counts) programmatically against the real `MissionMeta` objects for every mission/step in all three language files — verified live in the browser too, in both passes (answered translated checkpoints correctly in Ukrainian and, after the full-JSON rework, in English).
   - The three mission-content translation files were drafted by parallel subagents (content extraction is mechanical/low-risk; one agent per language for the ES/UK prose, a third for the English extraction-only pass), each given the exact JSON schema, the positional-matching constraint, and — for the translation agents — a shared Angular-terminology glossary. Structural correctness was verified programmatically against the source `MissionMeta` objects every time, never assumed from an agent's self-report (this caught real issues both passes: a badge translation-key path typo and a native-`<select>` binding bug in the first pass, none in the second).
   - Adding a language: add `public/i18n/<code>.json` (UI chrome) with the same key set as `en.json` (verified by flattening and diffing, not by convention), optionally add `public/i18n/missions/<code>.json` (mission content — optional, falls back to English per mission/field), and register the code in `LANGUAGES` (`language.service.ts`). No other code changes.

## Conventions

- Standalone, small components; signal-based state; semantic accessible HTML.
- Tests verify user-visible behavior, not implementation details.
- No payments and no real lesson content without an explicit phase prompt. Engagement mechanics shipped in Phase 09 and stay within the stance in Decision 15 — anything competitive or coercive needs its own decision first.
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
pnpm test:unit        # Vitest (476 tests)
pnpm test:e2e         # Playwright
pnpm lint             # ESLint
pnpm install:vertex   # refresh vendored Vertex Editor assets
pnpm deploy           # manual build + wrangler pages deploy
```

## Adding a New Mission

Since Decision 17, mission authoring is split into two files — structure in TS, text in JSON:

1. Create `src/content/missions/<id>.ts` exporting a `MissionMeta` (not `Mission` — no text fields exist on it), then register it in `src/content/missions/index.ts`. No service/engine code changes — `MissionCatalogService` reads the aggregated `MISSIONS` array.
2. Follow the `MissionMeta`/`StepMeta`/`CheckpointMeta` interfaces in `src/app/core/models/mission.model.ts` (step types in Decision 6). Front matter: `difficulty`, `durationMinutes`, `track` (one of `Fundamentals` / `Reactivity with Signals` / `Routing & Data`), `tags`, optional `prerequisites` (existing mission ids). Each checkpoint step needs `checkpoints: [{ correctIndex }, ...]` — just the answer index, no question/options text.
3. Add the mission's text to **every** `public/i18n/missions/*.json` file, keyed by the mission's `id`: `title`, `description`, optional `goal`, and `steps` (keyed by step `id`) with `title`/`content`/optional `hint`/`checkpoints` (`question`/`options`/`explanation`, same order and length as the `correctIndex`es in the `.ts` file)/`comparison` (for `type: 'comparison'` steps). `en.json` is required and must be complete; `es.json`/`uk.json` may be added later (English shows meanwhile via fallback) but should eventually cover the new mission too.
4. Set `previewMode: 'live'` when the starter code is self-contained plain TS that renders into `root` (no `import`/`export` — see `specs/playground.md`); otherwise it falls back to mock preview and needs a matching mock case in `src/app/components/mission/mock-preview.ts` if it has practice/example steps.
5. Tests: `mission-catalog.service.spec.ts` enforces structural invariants (unique ids, prerequisites resolve, live starter code has no import/export); `src/content/missions/translations.spec.ts` enforces that `en.json` covers the new mission completely and that any `es`/`uk` entries stay positionally consistent with it. Add an E2E in `e2e/playground.spec.ts` for new live missions.
6. Badges follow automatically — a new track gets its own `<Track> Specialist` badge and the catalog-wide targets grow (Decision 15). No badge code to touch.

## Known Issues / Watch List

- 4 of 12 missions (the Angular-framework ones) stay on mock preview; real Angular execution would need WebContainers (COOP/COEP) — see Decision 8.
- `typescript` lazy chunk is ~3.5 MB raw (~1 MB gzip). It is loaded only on the first live-preview run, which is why it was left as is.
- Email delivery is a log-only seam (Decision 12); no real provider is wired, so production password reset / verification needs Cloudflare Email Service + verified domain (SPF/DKIM/DMARC) before launch.
- Streaks trust the learner's device clock (Decision 15) — a changed clock can extend a streak. Accepted: nothing competitive rides on it.
- Adding a mission raises the `Lab Graduate` and track-badge targets, so a learner who had "completed the catalog" is short again. That is intended (the badge means *the whole catalog*), but it is the one badge that can visibly un-fill.
- `@voltui/components` / `angular-movement` peer-dep overrides must stay until they support Angular 22.
- `.env` exists at repo root (gitignored) — do not commit secrets.
- Mission content translations (`public/i18n/missions/{es,uk}.json`, Decision 17) were machine-drafted by AI agents, not reviewed by a native-speaking Angular expert — structural correctness (option counts, step coverage) is enforced by `translations.spec.ts`, but translation *quality/accuracy* has only been spot-checked, not exhaustively reviewed.
