---
name: angular-component
description: Use when creating a new Angular component (or its test) in Angular Lab, so it matches the repo's standalone + signal-based + Testing Library conventions. Covers class naming, template style, Tailwind/accessibility, and the test pattern.
---

# New Angular component (repo conventions)

Angular 22 + Analog. Components are small, standalone, signal-based, and accessible. Match the surrounding code — model after `src/app/components/counter/`.

## Component rules

- **Standalone**, `standalone: true`, explicit `imports: []`.
- **Class name has no suffix**: `Counter`, not `CounterComponent`. Selector is kebab-case with `app-` prefix (`app-counter`).
- **State is signals**: `readonly count = signal(0)`; derive with `computed(...)`; mutate with `.set(...)` / `.update(...)`. No `ngOnInit`-driven imperative state where a signal fits.
- **Inline `template`** with Tailwind v4 utility classes. Semantic, accessible HTML: real `<button type="button">`, `aria-label` on regions, visible focus (`focus:ring-*`).
- **Test hooks**: put `data-testid="..."` on values the test asserts on; interactive elements should be reachable by accessible role/name.
- One component per folder: `name/name.ts` + `name/name.spec.ts`. Prefer signal `input()`/`output()` over `@Input`/`@Output` for new code.

## Test rules (Vitest + Angular Testing Library)

- File `name.spec.ts` beside the component. Use `render` + `screen` from `@testing-library/angular` and `userEvent` from `@testing-library/user-event`.
- Assert **user-visible behavior**, not implementation: query by role/name or `getByTestId`, drive interactions with `user.click(...)`, assert on rendered text.
- Every `it` is `async`; `await render(...)` and `await user.click(...)`.

## Verify

`pnpm test:unit` (fast, ~5s). Then `pnpm lint`. Keep it green before moving on.
