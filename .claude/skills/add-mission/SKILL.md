---
name: add-mission
description: Use when adding, creating, or scaffolding a new learning mission/lesson in Angular Lab. Covers the catalog entry, the Mission/Step model, the live-vs-mock preview decision, the mock-preview case, and the tests to update.
---

# Add a new mission

Missions are the core learning unit. Since Phase 05, each mission lives in its own content file under `src/content/missions/`, aggregated by `index.ts`. The catalog service (`MissionCatalogService`) reads that array — you never edit engine code to add content.

## Files involved

- Mission content: `src/content/missions/<id>.ts` (one `Mission` per file)
- Registry: `src/content/missions/index.ts` (`MISSIONS` array — add one line here)
- Model / interfaces: `src/app/core/models/mission.model.ts`
- Mock preview cases: `src/app/components/mission/mock-preview.ts`
- Playground rules: `specs/playground.md`

## Steps

1. **Create `src/content/missions/<id>.ts`** exporting a `Mission`, then register it in `src/content/missions/index.ts`. Required fields: `id` (kebab-case, unique), `title`, `description`, `difficulty` (`beginner|intermediate|advanced`), `durationMinutes`, `track` (`Fundamentals` / `Reactivity with Signals` / `Routing & Data`), `tags`, `steps`, `starterCode`. Optional: `goal`, `prerequisites` (existing mission ids).

2. **Build `steps`** using the `Step` interface. Step `type` is one of: `concept`, `example`, `practice`, `comparison`, `checkpoint`, `summary`. `checkpoint` steps carry `checkpoints`; `comparison` steps carry a `comparison` object. Keep `content` as user-facing prose (use `\n\n` for paragraphs); no implementation detail.

3. **Decide the preview mode** (`previewMode`, default `'mock'`):
   - `'live'` **only** when `starterCode` is self-contained plain TS — **no `import`/`export`** (rejected up front by the sandbox; see `specs/playground.md`). Live code runs for real in the `allow-scripts` iframe.
   - `'mock'` for anything using Angular decorators/imports (the 4 Angular missions stay mock — real Angular JIT needs WebContainers/COOP+COEP).

4. **If mock + has practice/example steps**, add a matching case in `mock-preview.ts` so the fake UI reflects the mission.

5. **Update tests** (verify user-visible behavior, not internals):
   - `src/app/core/services/mission-catalog.service.spec.ts` enforces catalog invariants automatically (unique ids, prerequisites resolve, live starter code has no `import`/`export`).
   - Live missions also get an E2E in `e2e/playground.spec.ts` (navigate to `/mission/<id>`, open the Preview tab, assert the sandbox renders and reacts).

6. **Verify:** `pnpm test:unit` and `pnpm lint`. For live missions run `pnpm test:e2e` — note the Playwright `webServer` (build + `wrangler pages dev`) can exceed its 120s boot on a cold start; if so, start `wrangler pages dev dist/analog/public --port 8788` yourself and let the suite reuse it.
