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
| Code editor | Vertex Editor (`@vertex/web-editor`) — placeholder, see below |
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
│   │   ├── pages/          # Analog file-based routes
│   │   ├── app.config.ts   # Application config
│   │   └── app.ts          # Root component
│   ├── main.ts
│   ├── main.server.ts
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

1. **Static build for Cloudflare Pages**
   - Analog.js is configured with `ssr: false` and `static: true`.
   - Production build output: `dist/analog/public`.
   - This keeps the project on the Cloudflare Pages free tier without server functions.

2. **Peer dependency overrides**
   - `@voltui/components` and `angular-movement` declare Angular `^21.2.0` peer dependencies.
   - The project uses Angular `^22.0.0`.
   - pnpm overrides force these packages to use the project's Angular version.

3. **Vertex Editor placeholder**
   - The intended editor is `@vertex/web-editor` from `github:Andersseen/vertex`.
   - It is not published to npm and requires `bun` to build from the monorepo.
   - It is documented here and in prompts but not installed in Phase 01.
   - Once published, install with:
     ```bash
     pnpm add @vertex/web-editor
     ```
   - The component exposes `<vertex-editor>` and `<vertex-editor-lite>` web components.

4. **Spec-driven development**
   - Product behavior lives in `specs/`.
   - Specs do not mention implementation dependencies.
   - Technology choices live here, in `README.md`, in prompts, and in config files.

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
pnpm test:unit        # run unit/component tests
pnpm test:e2e         # run E2E tests
pnpm lint             # run ESLint
```

## Known Issues / Watch List

- `@voltui/components` and `angular-movement` may emit peer-dep warnings if overrides are removed.
- Vertex Editor integration is pending publication.
