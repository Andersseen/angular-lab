# Production Polish Specification — Angular Lab

Cross-cutting behavior expected of every page before the platform is promoted publicly. Complements
`specs/product.md` (quality standards) and `specs/playground.md` (playground-specific accessibility).

## Discoverability (SEO)

- Every route has a distinct, human-readable page title and a meta description; the title always
  ends with "— Angular Lab" so browser tabs and search results stay identifiable.
- The mission detail route's title and description reflect the specific mission being viewed, not a
  generic placeholder.
- Pages that are not meant to be indexed (auth forms, the dashboard) are excluded from the sitemap and
  disallowed in `robots.txt`; the mission catalog and each mission page are included.
- Sharing a link to the home page, the catalog, or a mission produces a reasonable social preview
  (title + description) via Open Graph tags.
- `robots.txt` points crawlers at `sitemap.xml`, which lists every public route and stays in sync with
  the mission catalog automatically as missions are added.

## Accessibility

- Every interactive control has an accessible name, independent of whether its visible label is
  hidden responsively (icon-only nav buttons on narrow viewports still announce their purpose).
- The checkpoint quiz behaves like a single-select question to assistive technology: options form a
  labeled group, the selected option is exposed as such, and arrow keys move between options the same
  way native radio buttons do.
- Checkpoint feedback (correct/incorrect) is announced automatically when it appears, not just shown
  visually.
- Moving to a new mission step shifts keyboard focus to the new step's content, so screen reader users
  and keyboard users are not left focused on a nav control that has scrolled out of context.
- A learner can complete an entire mission — read steps, edit code, answer a checkpoint, mark
  complete — using only the keyboard.
- Text and interactive elements meet standard contrast ratios in both light and dark themes.

## Error Handling

- Navigating to a URL that does not match any route shows a friendly "page not found" page with a way
  back to the catalog or home, instead of a blank screen. The page is excluded from indexing.
- An unexpected runtime error is caught centrally, logged for diagnosis, and surfaced to the learner as
  a brief, friendly notice rather than failing silently or leaving the UI stuck.
- Direct navigation to any client route (deep link, refresh) works the same as navigating there from
  within the app.

## Analytics

- Usage analytics, if configured, must not use cookies or track individuals across sites — Cloudflare
  Web Analytics or an equivalent privacy-friendly provider only.
- With no analytics token configured (the default for local/dev), the app makes no analytics network
  requests at all.

## Performance

- Each route's code is a separate, lazily-loaded chunk; a page never pays for JavaScript another page
  needs (see `specs/playground.md` for why the TypeScript transpiler is likewise deferred).
- The Vertex Editor script loads only when a page actually renders an editor, not on every page load.
