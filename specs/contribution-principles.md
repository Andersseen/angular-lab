# Contribution Principles — Angular Lab

## Spec-Driven Development

All product behavior must be defined in specs before it is implemented. Specs live in the `specs/` directory and describe what the product does, not how it is built.

## Spec Rules

- Specs describe user-visible behavior and business logic.
- Specs must not name implementation dependencies, frameworks, or hosting platforms.
- Technology choices belong in `context.md`, `README.md`, prompts, or project configuration.
- Every new feature must be traceable to at least one spec.

## Code Standards

### Type Safety

- Use strict type checking.
- Avoid implicit any.
- Prefer explicit function return types for public APIs.

### Accessibility

- Write semantic HTML.
- Provide meaningful labels for interactive elements.
- Manage focus for dynamic content.
- Respect reduced-motion preferences.

### Components

- Keep components small and focused on one responsibility.
- Components must be testable through their public interface.
- Avoid deep component trees.
- Do not test private implementation details.

### Styling

- Use utility-first styling.
- Avoid arbitrary values when a design token exists.
- Keep theming consistent across components.

## Testing Standards

- Unit and component tests verify user-visible behavior.
- E2E tests verify complete user journeys.
- Tests must not depend on private selectors or implementation details.
- New features must include tests.

## Pull Request Guidelines

1. Ensure all automated checks pass.
2. Update specs if the change affects product behavior.
3. Update documentation if the change affects setup or usage.
4. Keep changes focused on a single concern.
5. Write clear commit messages.

## What Not to Add

- Authentication or user accounts.
- Payments or subscriptions.
- Backend services or databases.
- Gamification mechanics.
- Real lesson content during foundation phases.

## Communication

- Use issues for bugs and feature proposals.
- Reference relevant specs in implementation discussions.
- Prefer small, iterative pull requests over large refactors.
