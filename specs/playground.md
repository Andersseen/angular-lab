# Playground Specification — Angular Lab

The playground is the browser-based execution environment where learners edit and run code inside missions. It follows the product rules in `specs/product.md` (Code Execution) and the preview rules in `specs/missions.md` (Preview Behavior).

## Execution Model

- Learner code runs inside the browser, in a sandboxed context isolated from the host page.
- The sandbox must not be able to read or modify the host page, its storage, or its network credentials.
- No backend execution and no file system access are allowed.
- The sandbox runs one self-contained snippet at a time; nothing persists between runs beyond what the snippet itself renders.

## Supported Code

- Playground missions run plain TypeScript and HTML, transpiled in the browser.
- Snippets are self-contained: they must not require external imports or extra setup to run.
- A snippet renders into a dedicated root container provided by the playground.
- Missions whose code needs a full framework runtime keep using a simulated preview until a future phase.

## Per-Mission Preview Mode

- Each mission declares how its preview behaves: **live** (real execution) or **mock** (simulated UI).
- Live is the default for new playground missions; mock remains as an explicit fallback.
- The preview panel must always make clear which mode is active.

## Live Updates

- The preview updates automatically when the learner edits code, without a full page reload.
- Updates are debounced so typing does not trigger a run on every keystroke.
- Updates must not lose the learner's scroll position when possible.
- Resetting a mission restores the starter code and re-runs the preview from that code.

## Errors and Feedback

- Both authoring errors (code that cannot be transpiled) and runtime errors are captured.
- Errors appear in the preview panel in plain language: what happened and a suggested next step.
- Error messages must never be console-only.
- When the code runs successfully, any previous error message is cleared.
- If the sandbox stops responding, the learner sees a friendly message instead of a dead panel.

## Accessibility

- The preview region is labeled so assistive technology can identify it.
- Error messages are announced (assertive live region).
- The sandboxed content carries an accessible title describing it as the code preview.
