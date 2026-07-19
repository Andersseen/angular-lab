# Angular Lab

Angular Lab is an interactive learning platform for modern Angular. It teaches Angular through guided missions, hands-on exercises, comparisons, editable examples, and browser-based code execution.

> **Status:** Feature-complete for the planned roadmap (phases 01–09). 12 missions across 3 tracks, real in-browser code execution, accounts with progress sync, and practice streaks + badges. See `PLAN.md` for what is and is not next, and `context.md` for how it all works.

## Table of Contents

- [What is Angular Lab?](#what-is-angular-lab)
- [Project Status](#project-status)
- [Install Dependencies](#install-dependencies)
- [Run Locally](#run-locally)
- [Run Tests](#run-tests)
- [Run E2E Tests](#run-e2e-tests)
- [Build](#build)
- [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## What is Angular Lab?

Angular Lab helps developers learn Angular by doing. Instead of reading long tutorials, learners complete short missions that combine explanations, comparisons, and live coding exercises. The platform runs entirely in the browser, so no backend account or setup is required.

## Project Status

- ✅ Analog.js + Angular 22 + pnpm, Tailwind CSS 4, Volt UI, Angular Movement
- ✅ Learning engine: missions, steps, checkpoints, per-step progress
- ✅ Browser playground: real code execution in a sandboxed iframe
- ✅ 12 missions across 3 tracks (8 with live execution)
- ✅ Accounts on Cloudflare Pages Functions + D1, with progress sync
- ✅ Password reset, email verification seam, rate limiting, account deletion
- ✅ Design-token identity, shared UI primitives, Lighthouse a11y 100 in both themes
- ✅ Practice streaks, derived badges, shareable completion cards
- ✅ Vitest + Angular Testing Library, Playwright E2E, ESLint, GitHub Actions
- ✅ Cloudflare Pages static build, MIT license

## Install Dependencies

This project uses [pnpm](https://pnpm.io/). Make sure you have Node.js 20.19.1 or later installed.

```bash
pnpm install
```

## Run Locally

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The dev server supports hot module replacement.

Main routes:
- `/` — landing page
- `/missions` — mission catalog
- `/mission/:id` — interactive mission (e.g., `/mission/reactive-signals`)
- `/mission` — redirects to `/missions`
- `/login`, `/signup` — accounts
- `/forgot-password`, `/reset-password`, `/verify-email` — account lifecycle
- `/dashboard` — profile, progress, achievements, settings (authenticated)

### Running with Pages Functions

To test authentication locally, build the static site and run `wrangler pages dev`:

```bash
pnpm db:migrate       # apply D1 migrations locally
pnpm dev:pages        # builds and serves Pages + Functions on http://localhost:8788
```

## Run Tests

Unit and component tests use Vitest and Angular Testing Library. They verify user-visible behavior, not private implementation details.

```bash
pnpm test:unit
```

Run in watch mode during development:

```bash
pnpm vitest
```

## Run E2E Tests

E2E tests use Playwright. Install the browsers once:

```bash
pnpm exec playwright install --with-deps chromium
```

Run the tests:

```bash
pnpm test:e2e
```

## Build

Create a production build for static hosting:

```bash
pnpm build:prod
```

The static files are output to `dist/analog/public`.

Preview the production build locally:

```bash
pnpm preview
```

## Styling Notes

Tailwind CSS v4 is configured in `src/styles.css`. The `@source` directive scans `node_modules/@voltui/components` and `node_modules/angular-movement` so their host classes are included in the build.

## Authentication

Authentication is implemented with Cloudflare Pages Functions and Cloudflare D1:

- Passwords are hashed with Web Crypto PBKDF2-SHA256.
- Sessions are opaque IDs stored in D1, delivered via HTTP-only cookies.
- Guests can browse and complete missions without an account; progress stays local.
- Email verification and password reset are implemented; email delivery itself is a
  provider-agnostic seam that logs the link in development (no provider is wired yet).

See `migrations/` for the D1 schema and `functions/api/` for the endpoints.

Note that plain `pnpm dev` (port 5173) serves no Pages Functions, so anything touching
auth, progress, or streaks fails there — use `pnpm dev:pages` (port 8788).

## Vertex Editor

Vertex Editor is bundled as a framework-agnostic web component in `public/vertex-editor/`:

- `web-editor.min.js` — full editable editor (`<vertex-editor>`)
- `web-editor-lite.min.js` — read-only display editor (`<vertex-editor-lite>`)

The editor script is lazy-loaded on mission pages only. Use the `app-vertex-editor` Angular wrapper component or the `<vertex-editor>` custom element directly.

To update the editor assets to the latest release:

```bash
curl -fsSL -o public/vertex-editor/web-editor.min.js https://github.com/Andersseen/vertex/releases/download/web-editor-latest/web-editor.min.js
curl -fsSL -o public/vertex-editor/web-editor-lite.min.js https://github.com/Andersseen/vertex/releases/download/web-editor-latest/web-editor-lite.min.js
```

## Deploy to Cloudflare Pages

This project is designed for Cloudflare Pages free-tier static hosting.

### Build settings

- **Build command:** `pnpm build:prod`
- **Build output directory:** `dist/analog/public`
- **Root directory:** `/`

### GitHub Actions deployment

The repository includes `.github/workflows/deploy-cloudflare-pages.yml`. It deploys on every push to `main` using these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The project name is configured directly in the workflow (`angular-lab`).

Add the secrets in your GitHub repository settings under **Settings > Secrets and variables > Actions**.

### Manual deployment

You can also deploy manually with [Wrangler](https://developers.cloudflare.com/workers/wrangler/):

```bash
pnpm build:prod
npx wrangler pages deploy dist/analog/public --project-name=YOUR_PROJECT_NAME
```

## Contribution Guidelines

We follow spec-driven development. Before writing code, make sure the behavior is described in the `specs/` directory.

- Keep components small and focused.
- Write semantic, accessible HTML.
- Add tests for new behavior.
- Do not add payments, or competitive engagement mechanics (points, leaderboards, streak penalties), without an explicit decision — see `specs/contribution-principles.md`.
- Style through the design tokens in `src/styles.css`; no raw palette utilities.
- Update `context.md` and relevant specs when you change architecture or behavior.
- When changing auth behavior, update `specs/auth.md` and run `pnpm db:migrate` locally.

See `specs/contribution-principles.md` for the full contribution standards.

## License

This project is licensed under the [MIT License](LICENSE).
