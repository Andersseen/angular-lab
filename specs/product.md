# Product Specification — Angular Lab

## Purpose

Angular Lab is an interactive learning platform that teaches learners how to build modern web applications through guided missions, hands-on exercises, editable examples, and browser-based code execution.

## Target Audience

- Developers who already know HTML, CSS, and basic JavaScript and want to learn the framework.
- Intermediate developers who want to deepen their understanding of signals, reactivity, routing, and advanced patterns.
- Teams looking for a consistent, self-paced training resource.

## Core Behaviors

### Learning Experience

1. Learners browse a catalog of missions organized by topic and difficulty.
2. Each mission contains a sequence of steps that mix reading, comparison, coding, and self-check.
3. Learners can edit example code directly in the browser and see the result immediately.
4. Progress is saved locally in the learner's browser.
5. Learners can reset a mission to its initial state at any time.

### Content Types

- **Concept:** a short explanation of one idea.
- **Comparison:** side-by-side views of two approaches with annotations.
- **Exercise:** a task where the learner writes or modifies code.
- **Example:** a read-only or editable snippet that demonstrates a pattern.
- **Checkpoint:** a lightweight self-check question.

### Code Execution

- The platform runs learner code inside the browser.
- Execution happens in a sandboxed context that prevents access to the host page.
- Errors are captured and displayed in plain language.
- Successful execution updates a live preview panel.

### Browser Storage

- Current mission state is stored in the browser.
- Storage is scoped per learner and per mission.
- Stored data is automatically cleared when the learner resets the mission.

## Out of Scope

The following are explicitly not part of this product:

- User accounts or authentication.
- Payments or subscriptions.
- Backend persistence.
- Gamification such as points, badges, or leaderboards.
- Real-time collaboration.
- Content authoring inside the platform.

## Quality Standards

- All interactive elements must be keyboard accessible.
- Color alone must not convey meaning.
- Text must meet standard contrast ratios.
- Motion must respect reduced-motion preferences.
- Code examples must be readable by screen readers.
