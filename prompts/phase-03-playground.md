# Phase 03 — Playground

## Goal

Add the browser-based code execution environment where learners edit and run code inside missions.

## Deliverables

- Integrated code editor component.
- Live preview panel.
- Sandboxed code execution.
- Error capture and plain-language messages.
- Reset example code behavior.
- At least one example mission that uses the playground end to end.

## Constraints

- Follow the specs in `specs/` exactly.
- The editor must be keyboard accessible.
- Code execution must be isolated from the host page.
- Preview updates must not lose scroll position when possible.
- Do not add backend execution or file system access.

## Notes

- If Vertex Editor is available as a published package, integrate it now. Otherwise, choose a lightweight in-browser editor and document the migration plan.
- Focus on TypeScript and HTML execution first.
- Keep the playground component reusable across missions.
