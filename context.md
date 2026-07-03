# Context — Angular Lab

This file is the primary context source for future AI sessions working on Angular Lab.

## Project Identity

- **Name:** Angular Lab
- **Purpose:** Interactive learning platform for modern Angular.
- **License:** MIT
- **Repository:** (add URL when published)

## Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Analog.js (Angular meta-framework) |
| Language | TypeScript (strict mode) |
| Package manager | pnpm |
| Styling | Tailwind CSS v4 |
| UI components | Volt UI (`@voltui/components`) |
| Animations | Angular Movement (`angular-movement`) |
| Code editor | Vertex Editor (`<vertex-editor>` / `<vertex-editor-lite>` web components) |
| Unit/component tests | Vitest + Angular Testing Library |
| E2E tests | Playwright |
| CI/CD | GitHub Actions |
| Hosting | Cloudflare Pages (static) |

## Project Structure

```text
angular-lab/
├── .github/workflows/      # CI/CD
├── e2e/                    # Playwright E2E tests
├── prompts/                # Phase prompts for AI sessions
├── public/                 # Static assets
├── specs/                  # Product specs (SDD)
├── src/
│   ├── app/
│   │   ├── components/     # Shared components
│   │   │   ├── counter/    # Example component + tests
│   │   │   ├── editor/     # Vertex Editor wrapper
│   │   │   ├── layout/     # App shell
│   │   │   └── mission/    # Mission page subcomponents
│   │   ├── core/           # Domain models and state services
│   │   │   ├── models/     # Mission, Step, MissionState, etc.
│   │   │   └── services/   # Catalog, state, storage, theme
│   │   ├── pages/          # Analog file-based routes
│   │   │   ├── index.page.ts
│   │   │   ├── missions.page.ts
│   │   │   └── mission/
│   │   │       ├── index.page.ts     # redirects to /missions
│   │   │       └── [id].page.ts      # dynamic mission route
│   │   ├── app.config.ts   # Application config
│   │   └── app.ts          # Root component
│   ├── main.ts
│   ├── styles.css
│   ├── test-setup.ts       # Vitest setup
│   └── vite-env.d.ts
├── angular.json
├── eslint.config.mjs
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

## Important Decisions

1. **Tailwind v4 scans Volt UI and Angular Movement**
   - `src/styles.css` uses `@source` directives to scan `node_modules/@voltui/components` and `node_modules/angular-movement`.
   - This ensures host classes like `bg-primary`, `rounded-xl`, and `p-6` from Volt components are generated.
   - Global `button`/`a` styles from the original Vite template were removed because they override Tailwind utility layers.

2. **Static build for Cloudflare Pages**
   - Analog.js is configured with `ssr: false` and `static: true`.
   - Production build output: `dist/analog/public`.
   - This keeps the project on the Cloudflare Pages free tier without server functions.

3. **Peer dependency overrides**
   - `@voltui/components` and `angular-movement` declare Angular `^21.2.0` peer dependencies.
   - The project uses Angular `^22.0.0`.
   - pnpm overrides force these packages to use the project's Angular version.

4. **Vertex Editor integration**
   - Vertex Editor ships as self-contained web components from the `Andersseen/vertex` releases.
   - Assets are vendored in `public/vertex-editor/` and loaded in `index.html`.
   - Use `app-vertex-editor` (Angular wrapper) for two-way binding.
   - The wrapper waits for `customElements.whenDefined`, avoids overwriting the editor value while the user types, and reacts to `language`/`theme` changes.
   - Do not try to install it via npm; it is not published as a package.

5. **Spec-driven development**
   - Product behavior lives in `specs/`.
   - Specs do not mention implementation dependencies.
   - Technology choices live here, in `README.md`, in prompts, and in config files.

6. **Mission state architecture**
   - Domain models live in `src/app/core/models/`.
   - `MissionCatalogService` returns the static catalog of missions grouped by track.
   - `MissionStateService` holds the active mission, current step, and code per step using signals.
   - `StorageService` persists mission progress to `localStorage` with error handling.
   - Pages and components are thin orchestrators that delegate to these services.

7. **Dark mode handling**
   - `ThemeService` supports `light`, `dark`, and `system` modes.
   - User preference is stored in `localStorage` under `angular-lab:theme`.
   - `system` mode follows `prefers-color-scheme`.
   - Tailwind's `dark:` variants and Volt UI's dark theme rely on the `dark` class on `<html>`.
   - The service is injected in `App` so it initializes when the application starts.

8. **Preview is currently mocked**
   - The editor preview does not execute learner code (real execution requires WebContainer or a similar sandbox, planned for Phase 03).
   - `MockPreview` renders an interactive but fake UI that matches the mission topic.
   - The preview header clearly labels it as a "Mock preview" so learners are not misled.

## Conventions

- Components are standalone and small.
- Use signal-based state where possible.
- Prefer semantic HTML and accessible patterns.
- Tests verify user-visible behavior, not private implementation details.
- Do not add authentication, payments, backend logic, real lessons, or gamification.

## Common Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start local dev server
pnpm build:prod       # production build
pnpm preview          # serve production build locally
pnpm test:unit        # run unit/component tests
pnpm test:e2e         # run E2E tests
pnpm lint             # run ESLint
```

## Adding a New Mission

1. Add the mission data to `src/app/core/services/mission-catalog.service.ts`.
2. Follow the `Mission` and `Step` interfaces in `src/app/core/models/mission.model.ts`.
3. Support step types: `concept`, `example`, `practice`, `comparison`, `checkpoint`, `summary`.
4. Add a matching mock preview case in `src/app/components/mission/mock-preview.ts` if the mission has practice/example steps.
5. Add or update tests in:
   - `src/app/core/services/mission-state.service.spec.ts`
   - `src/app/pages/mission/[id].page.spec.ts`
   - `src/app/pages/missions.page.spec.ts`

## Known Issues / Watch List

- `@voltui/components` and `angular-movement` may emit peer-dep warnings if overrides are removed.
- Vertex Editor integration is pending publication.
- Real code execution preview is pending Phase 03 (WebContainer or equivalent).
