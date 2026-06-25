# Angular Lab

Angular Lab is an interactive learning platform for modern Angular. It teaches Angular through guided missions, hands-on exercises, comparisons, editable examples, and browser-based code execution.

> **Status:** Foundation phase. The project tooling, testing stack, CI/CD, and documentation are in place. The actual learning platform content and playground will be built in upcoming phases.

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

- ✅ Analog.js + Angular 22 + pnpm
- ✅ Tailwind CSS 4
- ✅ Volt UI components
- ✅ Angular Movement animations
- ✅ Vitest + Angular Testing Library
- ✅ Playwright E2E tests
- ✅ ESLint
- ✅ GitHub Actions workflows
- ✅ Cloudflare Pages static build
- ✅ MIT license
- ✅ Initial specs and prompts
- 🕐 Learning engine (Phase 02)
- 🕐 Browser playground (Phase 03)

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
- `CLOUDFLARE_PROJECT_NAME`

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
- Do not add authentication, payments, backend logic, gamification, or real lesson content without an explicit phase prompt.
- Update `context.md` and relevant specs when you change architecture or behavior.

See `specs/contribution-principles.md` for the full contribution standards.

## License

This project is licensed under the [MIT License](LICENSE).
