---
name: add-mission
description: Use when adding, creating, or scaffolding a new learning mission/lesson in Angular Lab. Covers the catalog entry, the MissionMeta/Mission split (structure vs. text), the live-vs-mock preview decision, the mock-preview case, and the tests to update.
---

# Add a new mission

Missions are the core learning unit. Since Phase 05, each mission's *structure*
lives in its own file under `src/content/missions/`, aggregated by `index.ts`.
Since Decision 17 (i18n), a mission's *text* — title, description, goal, step
prose, checkpoints, comparisons — does not live in that file at all: it lives in
`public/i18n/missions/{en,es,uk}.json`. `MissionCatalogService` reads only
structure; `MissionTranslationService` assembles the full `Mission` the app
renders by merging structure with the current language's text. You never edit
either service to add content.

## Files involved

- Mission structure: `src/content/missions/<id>.ts` (one `MissionMeta` per file — **no text fields**)
- Registry: `src/content/missions/index.ts` (`MISSIONS` array — add one line here)
- Mission text (all languages): `public/i18n/missions/{en,es,uk}.json` (one entry per file, keyed by mission `id`)
- Model / interfaces: `src/app/core/models/mission.model.ts` (`MissionMeta`/`StepMeta`/`CheckpointMeta` = structure; `Mission`/`Step`/`Checkpoint`/`Comparison` = the hydrated shape components render)
- Mock preview cases: `src/app/components/mission/mock-preview.ts`
- Playground rules: `specs/playground.md`
- i18n rules: `specs/i18n.md`

## Steps

1. **Create `src/content/missions/<id>.ts`** exporting a `MissionMeta`, then register it in `src/content/missions/index.ts`. Required fields: `id` (kebab-case, unique), `difficulty` (`beginner|intermediate|advanced`), `durationMinutes`, `track` (`Fundamentals` / `Reactivity with Signals` / `Routing & Data`), `tags`, `steps`, `starterCode`. Optional: `prerequisites` (existing mission ids). **No `title`/`description`/`goal` here** — those go in step 3.

2. **Build `steps`** using the `StepMeta` interface: just `id` and `type` (`concept`, `example`, `practice`, `comparison`, `checkpoint`, `summary`). `checkpoint` steps carry `checkpoints: [{ correctIndex }, ...]` — the answer index only, nothing else (question/options/explanation are text, see step 3). `comparison` steps need no extra structural field — the `comparison` object itself is text.

3. **Add the mission's text to every `public/i18n/missions/*.json` file**, keyed by the mission `id`:
   - `en.json` is **required and must be complete** — it's the base every other language falls back to. Add `title`, `description`, optional `goal`, and `steps` (keyed by step `id`) with `title`/`content` (use `\n\n` for paragraphs; no implementation detail) /optional `hint`/`checkpoints` (`question`, `options` — same length and order as the `.ts` file's `correctIndex`es — and `explanation`)/`comparison` (`titleA`, `titleB`, `points: [{aspect, a, b}]`, `recommendation`) for `type: 'comparison'` steps.
   - `es.json`/`uk.json` are optional partial overlays — add them if you can translate well; otherwise the mission just renders in English for those learners until someone does (no code changes needed later).

4. **Decide the preview mode** (`previewMode`, default `'mock'`):
   - `'live'` **only** when `starterCode` is self-contained plain TS — **no `import`/`export`** (rejected up front by the sandbox; see `specs/playground.md`). Live code runs for real in the `allow-scripts` iframe.
   - `'mock'` for anything using Angular decorators/imports (the 4 Angular missions stay mock — real Angular JIT needs WebContainers/COOP+COEP).

5. **If mock + has practice/example steps**, add a matching case in `mock-preview.ts` so the fake UI reflects the mission.

6. **Update tests** (verify user-visible behavior, not internals):
   - `src/app/core/services/mission-catalog.service.spec.ts` enforces structural catalog invariants automatically (unique ids, prerequisites resolve, live starter code has no `import`/`export`).
   - `src/content/missions/translations.spec.ts` enforces that `en.json` covers the new mission completely (title/description/every step's title+content/every checkpoint with a valid `correctIndex`/every comparison) and that any `es`/`uk` entries you added stay positionally consistent with it — this is what prevents a checkpoint's "correct answer" from silently pointing at the wrong translated option.
   - Live missions also get an E2E in `e2e/playground.spec.ts` (navigate to `/mission/<id>`, open the Preview tab, assert the sandbox renders and reacts).

7. **Verify:** `pnpm test:unit` and `pnpm lint`. For live missions run `pnpm test:e2e` — note the Playwright `webServer` (build + `wrangler pages dev`) can exceed its 120s boot on a cold start; if so, start `wrangler pages dev dist/analog/public --port 8788` yourself and let the suite reuse it. Also spot-check the mission in the browser (`pnpm dev:pages`) in at least English to confirm the text renders — `translations.spec.ts` catches structural bugs, not typos.
