# Phase 01 — Foundation

## Goal

Prepare a clean, professional, open source-ready foundation for the Angular Lab learning platform. Do not implement the learning platform itself.

## Deliverables

- Working local development environment.
- Working production build for static hosting.
- Unit and component test setup with real behavior tests.
- E2E test setup with at least one journey test.
- Code quality tooling configured.
- Continuous integration workflows for pull requests and deployment.
- MIT license.
- Initial spec-driven development documentation.
- Context file for future AI sessions.

## Constraints

- Use the latest stable version of the framework.
- Use pnpm as the package manager.
- Use Tailwind CSS v4 for styling.
- Use Volt UI for the component library.
- Use Angular Movement for animation directives.
- Use Vitest and Angular Testing Library for component tests.
- Use Playwright for E2E tests.
- Target Cloudflare Pages static hosting free tier.
- Keep the build static with no server-side rendering.
- Do not add authentication, payments, real lessons, gamification, or backend logic.

## Notes

- Vertex Editor is intended for the browser-based code editor. If it is not yet available as a published package, document the integration path and add a placeholder instead of blocking the foundation.
- Specs must describe product behavior only and must not mention implementation dependencies.
