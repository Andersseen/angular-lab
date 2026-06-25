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

- Vertex Editor is integrated as web components from the `Andersseen/vertex` releases (full editor and read-only lite variant).
- Include a small demo app structure (landing page + mission page) to validate Volt UI, Angular Movement, and Vertex Editor integration.
- Specs must describe product behavior only and must not mention implementation dependencies.
