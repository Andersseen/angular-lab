---
name: add-mission
description: Use when adding, creating, or scaffolding a new learning mission/lesson in Angular Lab. Covers the catalog entry, the Mission/Step model, the live-vs-mock preview decision, the mock-preview case, and the tests to update.
---

# Add a new mission

Missions are the core learning unit. Until Phase 05 moves content into dedicated files, they live inline in the catalog service. Always confirm the phase status in [PLAN.md](../../../PLAN.md) before starting — if Phase 05 is done, content may live elsewhere.

## Files involved

- Catalog (source of truth for now): `src/app/core/services/mission-catalog.service.ts`
- Model / interfaces: `src/app/core/models/mission.model.ts`
- Mock preview cases: `src/app/components/mission/mock-preview.ts`
- Playground rules: `specs/playground.md`

## Steps

1. **Add the mission object** to `mission-catalog.service.ts`, conforming to the `Mission` interface. Required fields: `id` (kebab-case, unique), `title`, `description`, `difficulty` (`beginner|intermediate|advanced`), `durationMinutes`, `track`, `tags`, `steps`, `starterCode`. Register it in the grouped catalog the service returns.

2. **Build `steps`** using the `Step` interface. Step `type` is one of: `concept`, `example`, `practice`, `comparison`, `checkpoint`, `summary`. `checkpoint` steps carry `checkpoints`; `comparison` steps carry a `comparison` object. Keep `content` as user-facing prose (use `\n\n` for paragraphs); no implementation detail.

3. **Decide the preview mode** (`previewMode`, default `'mock'`):
   - `'live'` **only** when `starterCode` is self-contained plain TS — **no `import`/`export`** (rejected up front by the sandbox; see `specs/playground.md`). Live code runs for real in the `allow-scripts` iframe.
   - `'mock'` for anything using Angular decorators/imports (the 4 Angular missions stay mock — real Angular JIT needs WebContainers/COOP+COEP).

4. **If mock + has practice/example steps**, add a matching case in `mock-preview.ts` so the fake UI reflects the mission.

5. **Update tests** (verify user-visible behavior, not internals):
   - `mission-state.service.spec.ts`
   - `src/app/pages/mission/[id].page.spec.ts`
   - `src/app/pages/missions.page.spec.ts`
   - Live missions also get an E2E spec in `e2e/` (model after `e2e/playground.spec.ts`).

6. **Verify:** `pnpm test:unit`; for live missions also `pnpm test:e2e`. Then `pnpm lint`.
