# i18n integration (ngx-translate) — English / Spanish / Ukrainian

## Context

The app is English-only. The user asked to integrate `ngx-translate` for i18n with
English (already the default), Spanish, and Ukrainian, using JSON translation files
(confirmed as the right choice — it's ngx-translate's native format, not a workaround).

Two scope questions were resolved with the user first, since both had real
cost/architecture trade-offs:

1. **Mission content vs. UI only** — `src/content/missions/*.ts` is ~1475 lines of
   long-form technical prose (13 files: titles, step content, hints, checkpoints,
   comparisons). Machine-translating that without human review risks technical
   inaccuracy in a *learning* product. **Decision: UI chrome only for this phase.**
   Mission content stays English-only; flagged as a future candidate in `PLAN.md`.
2. **ngx-translate vs. Analog.js's built-in i18n** — Analog wraps Angular's
   `$localize`. Confirmed via docs: in a static build it detects locale from the
   first URL segment (`/es/...`), and switching languages means **navigating to a
   different locale-prefixed URL** — already-rendered components don't react to a
   runtime translation change. That would mean prefixing every existing route,
   touching the SEO/sitemap script (`scripts/generate-seo-assets.mjs`) and E2E.
   `ngx-translate` gives an instant, no-navigation switch via a reactive pipe —
   the same UX as the existing `ThemeService` toggle. **Decision: ngx-translate.**

## Package choice

`@ngx-translate/core@^18` + `@ngx-translate/http-loader@^18`. Verified via `npm view`:
both declare `"@angular/core": ">=18"` peers, so they resolve cleanly against
Angular 22 with **no `pnpm.overrides` needed** (unlike Volt UI / Angular Movement,
context.md Decision 3).

Verified (by pulling the actual v18 bundle from unpkg) that this version is a
ground-up rewrite on Angular signals — `TranslateService` stores translations in a
`signal()`, and `TranslatePipe` is `pure:false` and calls `changeDetectorRef.markForCheck()`
on change. That's the mechanism the zoneless scheduler (`provideZonelessChangeDetection()`,
already in `app.config.ts`) listens for — same category of mechanism as `AsyncPipe`.
Confirmed zoneless-safe; no zone-patching dependency.

## Architecture

**1. Bootstrap — `src/app/app.config.ts`**

Add, using the confirmed-correct v18 nesting (loader providers must be nested
*inside* `provideTranslateService`'s config, not sibling top-level providers —
verified against the official ngx-translate docs):

```ts
provideTranslateService({
  lang: getInitialLang(),
  fallbackLang: 'en',
  loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
}),
provideAppInitializer(() => {
  const translate = inject(TranslateService);
  return firstValueFrom(translate.use(getInitialLang()));
}),
```

`provideAppInitializer` (Angular 19+, available on 22) blocks first render on the
initial translation fetch — this is the standard fix for flash-of-untranslated-keys
and is worth the few extra lines given the user explicitly asked for best practice.
`getInitialLang()` is exported from the new `LanguageService` file (below) so
`app.config.ts` and the service share one source of truth instead of reading
`localStorage` twice.

**2. `LanguageService` — `src/app/core/services/language.service.ts`**

Modeled directly on `ThemeService` (`src/app/core/services/theme.service.ts`) — same
shape: `providedIn: 'root'`, a `signal`, a `localStorage` key, SSR-guarded reads
(`typeof localStorage === 'undefined'`), matching context.md Decision 7's pattern.
Differences from ThemeService: no eager root-injection needed (the `provideAppInitializer`
above already performs the startup side effect), and `setLang()` calls
`TranslateService.use(lang)` in addition to persisting.

```ts
export type AppLang = 'en' | 'es' | 'uk';
export const LANGUAGES: { code: AppLang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'uk', label: 'Українська' },
];
export function getInitialLang(): AppLang { /* localStorage read, SSR-guarded, default 'en' */ }

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly lang = signal<AppLang>(getInitialLang());
  setLang(lang: AppLang): void { /* signal.set + persist + translate.use(lang) */ }
}
```

**3. Translation files — `public/i18n/{en,es,uk}.json`**

`public/` is served verbatim at the app root by Vite/Analog's static build (same
mechanism as the existing `public/vertex-editor/*.js`), so these resolve at
`/i18n/en.json` etc. at runtime with zero extra config. Nested JSON, namespaced by
feature area to mirror the component tree: `nav`, `shell`, `home`, `auth` (with
`login`/`signup`/`forgotPassword`/`resetPassword`/`verifyEmail` sub-keys),
`dashboard` (with `settings`/`achievements`/`progress`/`profile` sub-keys),
`mission` (nav/actionBar/completed/checkpoint), `common` (Confirm/Cancel/Loading…),
`notFound`. **English values must be verbatim copies of the current hardcoded
strings** — that's what keeps the 158 existing unit tests and 17 E2E tests passing
unmodified (see Testing below).

**4. Template migration pattern (applies across ~59 component/page files)**

Confirmed via `grep`: every component uses inline `template:` (zero `templateUrl`),
so this is a pure find-and-replace pattern, not a directive-wiring exercise. Explored
one file from each shape found by the earlier survey to nail the pattern down:

- **Plain template text** (`nav-links.ts`, most files) → import standalone
  `TranslatePipe`, replace literal text with `{{ 'nav.home' | translate }}`, and
  `[attr.aria-label]="'nav.home' | translate"` for attribute strings.
- **String `@Input()`s passed to presentational `ui/` primitives** (e.g.
  `settings-tab.ts` → `<app-confirm-dialog title="Delete account?" message="...">`)
  → resolve the pipe in the *parent* template and bind it:
  `[title]="'dashboard.settings.deleteAccount.title' | translate"`. The `ui/`
  primitives themselves (`ConfirmDialog`, `Alert`, `FormField`, etc.) stay
  translation-unaware — no service injection, per context.md Decision 14's rule that
  they're presentational only. Zero changes needed inside `ui/`.
- **Imperative strings in `.ts` methods** (toasts in `settings-tab.ts` / `shell.ts` —
  `this.toast.info('Logged out of all devices.', 'Done')`) → inject `TranslateService`
  and use `.instant('key')`, e.g.
  `this.toast.info(this.translate.instant('dashboard.settings.logoutEverywhere.toastMessage'), ...)`.
- **Data-driven arrays with embedded copy** (e.g. `FEATURES` in `index.page.ts`,
  `routeMeta` SEO strings) → convert string fields to translation keys and resolve
  via the pipe/`.instant()` at the render site.

This pattern is described once here rather than enumerated per file — apply it
uniformly across the ~59 files the survey identified, grouped originally as: many
strings (`login.page.ts`, `settings-tab.ts`), moderate (`signup`/`forgot-password`/
`reset-password`/`verify-email` pages, `dashboard.page.ts`, `home-hero.ts`,
`home-stats.ts`, `achievements-tab.ts`, `progress-tab.ts`, `mission-completed.ts`,
`nav-links.ts`), and few (the remaining ~35 files with 1-5 strings each).

**5. Language switcher — `src/app/components/layout/language-switcher.ts`**

A native `<select class="al-input">` (three languages don't suit a toggle like
`ThemeToggle`'s two-state button; a native select gets keyboard nav and screen-reader
semantics for free, and sidesteps the Volt CVA pitfall context.md Decision 16
documents for form controls). Bound `(change)` calls `language.setLang(...)`;
options are generated from the `LANGUAGES` const. Placed in `shell.ts` next to
`<app-theme-toggle />` (same header cluster). Gets its own `.spec.ts` since it's a
new piece of interactive, user-facing behavior — following the pattern of testing
behavior, not implementation.

**6. Spec — `specs/i18n.md`**

Per CLAUDE.md's "spec first, then code": document supported languages, persistence
key, fallback behavior, and the explicit scope boundary (mission content excluded),
before/alongside the code change.

## Testing strategy (the part most likely to break silently)

The 158 unit tests query rendered text directly (`getByText('Sign in')`, etc.). If
`TranslatePipe` has no translations loaded during a test, it renders the raw key
and every one of those assertions breaks. Two options were weighed:

- Rewrite all ~40 affected spec files to assert against keys instead of text —
  rejected: much larger diff, and it contradicts the existing convention
  ("tests assert user-visible behavior, not implementation details").
- **Chosen: one change in `src/test-setup.ts`.** Add a global `beforeEach` (Vitest's
  `setupFiles` re-runs per test file, so this applies to every spec, confirmed
  against how `setupTestBed({ zoneless: true })` already works there) that calls
  `TestBed.configureTestingModule({ providers: [provideTranslateService(...)] })`
  with a **synchronous** loader built from a direct JSON import of
  `public/i18n/en.json` (`loader: provideTranslateLoader(() => ({ getTranslation: () => of(en) }))`).
  `of()` emits synchronously, so real English strings are available before the
  first render in every test — zero changes needed to any of the 41 existing spec
  files. Requires adding `"resolveJsonModule": true` to `tsconfig.json` (currently
  absent) so the JSON import type-checks; neither `tsconfig.spec.json` nor
  `tsconfig.app.json` sets an explicit `rootDir` that would conflict with importing
  from `public/` outside `src/`.

E2E (Playwright) needs no changes: fresh browser contexts have no saved
`angular-lab:lang`, so `getInitialLang()` defaults to `'en'` and the real
`/i18n/en.json` (verbatim-copied strings) is fetched from the running server —
existing selectors keep matching.

## Docs to update at the end (per CLAUDE.md / PLAN.md convention)

- `context.md`: new numbered Decision entry (ngx-translate + why over Analog i18n,
  the signals/zoneless confirmation, the UI-only scope boundary, the test-setup
  synchronous-loader trick).
- `PLAN.md`: note the phase, and list "translate mission content" under "What's next"
  as the deliberately-deferred follow-up.

## Verification

1. `pnpm install` — confirm no peer-dependency warnings for the two new packages.
2. `pnpm test:unit` — all 158 existing tests green with zero test-file edits (only
   `test-setup.ts` + `tsconfig.json` touched); add the new `language-switcher.spec.ts`.
3. `pnpm dev:pages` — manually switch EN → ES → UK in the browser: verify instant
   in-place text updates (no navigation/reload), persistence across a page refresh
   (`localStorage['angular-lab:lang']`), and that Spanish/Ukrainian fall back to
   English for any not-yet-translated key (`fallbackLang: 'en'`) instead of showing
   raw keys.
4. `pnpm test:e2e` — confirm the existing 17 tests still pass unmodified against the
   English default.
5. `pnpm lint` — clean.
