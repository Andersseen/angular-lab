# Contributing to Angular Lab

Thanks for being here. Missions, translations, accessibility fixes and bug reports are all
genuinely useful — and the bar for a first contribution is lower than it looks.

This file is the practical workflow. The reasoning behind the standards lives in
[`specs/contribution-principles.md`](specs/contribution-principles.md), and the architecture
lives in [`context.md`](context.md).

---

## Getting set up

```bash
pnpm install
pnpm dev            # → http://localhost:5173
```

If your change touches **accounts, progress sync, streaks, or anything under `/api/*`**, plain
`pnpm dev` will not work — it serves no Pages Functions and no database. Use:

```bash
pnpm db:migrate     # apply D1 migrations locally
pnpm dev:pages      # → http://localhost:8788, with Functions + D1
```

A demo account is seeded by `migrations/0002_seed_demo_user.sql` for local testing.

---

## The one rule that is not negotiable: spec first

Behavior is described in [`specs/`](specs/) **before** it is implemented. If your change alters
what a learner can see or do, the matching spec changes in the same PR.

- Specs describe *behavior*. They never name a framework, a library or a host.
- Technology choices go in `context.md` or in configuration — never in a spec.
- Changing auth behavior? `specs/auth.md` must be updated too.

This is what keeps the project from drifting into "whatever the last commit did".

---

## Code standards

| | |
|---|---|
| **Components** | Standalone, small, signal-based. No `Component` suffix on class names — `Counter`, not `CounterComponent`. |
| **File size** | ~150 lines is the soft ceiling. Pages are thin orchestrators; logic belongs in `core/`. |
| **Reuse** | A visual pattern used twice is extracted into `src/app/components/ui/` *before* its third use. Those primitives are presentational only — signal inputs, outputs, no service injection. |
| **Styling** | Through the `al-*` design tokens (`bg-al-surface`, `text-al-ink`, `border-al-line`, `bg-al-brand`, status trios). The `al-` prefix is required — unprefixed names collide with Volt's own tokens. No raw palette utilities (`zinc-*`, `blue-*`, hex) outside `src/styles.css`. |
| **Text inputs** | Native `<input class="al-input">`, **not** `volt-input` — it is an element component whose CVA breaks the `<label for>` association (`context.md` Decision 16). |
| **Accessibility** | Semantic HTML, real labels, managed focus on dynamic content, `prefers-reduced-motion` respected. |
| **Types** | Strict. No implicit `any`. Explicit return types on public APIs. |
| **Learner-facing text** | Goes in `public/i18n/`, never in a `.ts` file — including English. |

---

## Tests

New behavior ships with tests. They assert what a **user can observe**, never private
implementation details or internal selectors.

```bash
pnpm lint
pnpm test:unit
pnpm test:e2e      # required for auth, progress or playground changes
```

E2E runs single-worker by design — all tests share one local D1 database and per-IP rate-limit
buckets, so parallel workers produce flaky auth failures rather than real signal.

---

## Adding a mission

The most welcome kind of contribution, and the engine needs no changes to accept one:

1. Open a **Mission proposal** issue first, so the scope and track can be agreed.
2. Read [`specs/missions.md`](specs/missions.md) and [`specs/learning-model.md`](specs/learning-model.md).
3. Add `src/content/missions/<id>.ts` exporting a `MissionMeta` — **structure only, no text**.
4. Register it in `src/content/missions/index.ts`.
5. Add the text to `public/i18n/missions/en.json` (required) and, if you can, `es.json` / `uk.json`.
6. Decide the preview mode: `'live'` for plain TypeScript/DOM, mock for anything needing the
   Angular framework at runtime.
7. Run `pnpm test:unit` — `translations.spec.ts` will tell you exactly what is missing.

---

## Pull requests

- Work on a feature branch and open a PR into `main`; CI runs lint, unit, E2E and the build.
- Keep each PR to a single concern. Small and iterative beats one large refactor.
- Include screenshots for visual changes — **both themes**.
- Update `context.md` / `PLAN.md` if you changed architecture or the roadmap.

---

## What is out of scope

Not forbidden forever — but each needs an explicit decision before any code:

- **Payments or subscriptions.**
- **Competitive or coercive engagement**: points, leaderboards, ranks, streak-loss penalties,
  notifications. Engagement here is reflective; it reports practice you already did.
- **Gating learning content** behind an account or an achievement.
- **Collecting learner data** beyond what a shipped feature needs.

---

## Reporting a bug

Use the [issue templates](https://github.com/Andersseen/angular-lab/issues/new/choose). The most
useful bug report says which environment you hit it in — the live site, `:5173`, or `:8788` —
because that one detail rules out half of the possible causes immediately.

Security issues go through [SECURITY.md](SECURITY.md) instead, not the public tracker.
