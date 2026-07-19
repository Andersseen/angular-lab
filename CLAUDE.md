# CLAUDE.md — Angular Lab

Interactive learning platform for modern Angular. **Read [context.md](context.md) for the full picture and [PLAN.md](PLAN.md) for what's next** — those are the source of truth; this file is the quick operational reference.

## Stack

Analog.js 2.6 (Angular 22, static `ssr: false`) · TypeScript strict · pnpm · Tailwind v4 · Volt UI · Vitest + Angular Testing Library · Playwright (E2E) · Cloudflare Pages + Functions + D1.

## Critical dev gotcha

- `pnpm dev` → Vite on **:5173**, **NO Pages Functions / D1** → auth & `/api/*` calls fail here.
- `pnpm dev:pages` → build + `wrangler pages dev` on **:8788**, **with** Functions + D1. Use this for anything touching auth, progress sync, or the database.
- Run `pnpm db:migrate` before `dev:pages` if the schema changed.

## Common commands

```bash
pnpm install         # deps
pnpm dev             # :5173 (no functions)
pnpm dev:pages       # :8788 (functions + D1)
pnpm db:migrate      # apply D1 migrations locally
pnpm test:unit       # Vitest (~5s)
pnpm test:e2e        # Playwright (chromium)
pnpm lint            # ESLint  (lint:fix to autofix)
pnpm build:prod      # production build → dist/analog/public
pnpm install:vertex  # refresh vendored Vertex Editor assets
```

## Conventions

- Standalone, small, signal-based components; class names have no `Component` suffix (`Counter`, not `CounterComponent`); semantic accessible HTML.
- Tests assert user-visible behavior, not implementation details.
- **Styling goes through the design tokens** (`bg-surface`, `text-ink`, `border-line`, `bg-brand`/`text-brand-ink`, status trios). No raw palette utilities (`zinc-*`, `blue-*`, hex) outside the `--al-*` token layer in `src/styles.css` — see `context.md` Decision 14.
- Pages are thin orchestrators; **~150 lines is the soft ceiling** for any component file.
- A visual pattern used twice is extracted to `src/app/components/ui/` before a third use. Those primitives are presentational only: signal inputs, outputs, no service injection.
- **Spec first, then code.** Behavior lives in `specs/` (no impl detail there); tech choices live in `context.md` / config.
- Update `context.md` + `PLAN.md` at the end of each phase; update `specs/auth.md` when auth behavior changes.
- Don't add payments, real lessons, or gamification without an explicit phase prompt.
- `.env` is gitignored — never commit secrets.

## Project skills (`.claude/skills/`)

- **add-mission** — add a learning mission (catalog entry, live/mock preview, tests).
- **d1-migration** — create & apply a numbered D1 migration.
- **angular-component** — scaffold a component + test in repo style.
