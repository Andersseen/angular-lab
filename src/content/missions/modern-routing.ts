import type { Mission } from '../../app/core/models/mission.model';

export const ROUTING_MISSION: Mission = {
  id: 'modern-routing',
  title: 'Modern Angular Routing',
  description:
    'Navigate between views, read route parameters, and protect routes with modern router APIs.',
  goal: 'Map URLs to components, read route params as inputs, and guard navigation.',
  difficulty: 'intermediate',
  durationMinutes: 20,
  track: 'Routing & Data',
  tags: ['router', 'routes', 'navigation'],
  prerequisites: ['component-communication'],
  steps: [
    {
      id: 'concept',
      title: 'Router as state',
      type: 'concept',
      content:
        'The URL is part of your application state. Angular router maps URLs to components, passes parameters, and lets you guard navigation.\n\nModern routing favors functions over classes: `resolveFn`, `canActivateFn`, and `withComponentInputBinding()`.',
    },
    {
      id: 'example',
      title: 'Route parameters',
      type: 'example',
      content:
        'The editor shows a `UserProfile` component that reads `:id` from the route. With `withComponentInputBinding()`, the parameter becomes a component input automatically.',
    },
    {
      id: 'practice',
      title: 'Add a guard',
      type: 'practice',
      content:
        'Create a `canActivateFn` that blocks navigation to `/admin` unless a mock `isAdmin()` function returns true. Wire it into the route config.',
      hint: 'Return `true` to allow navigation or a `UrlTree` to redirect.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Check your routing knowledge.',
      checkpoints: [
        {
          question: 'Which function enables route params as component inputs?',
          options: [
            'withRouterConfig()',
            'withComponentInputBinding()',
            'withEnabledBlockingInitialNavigation()',
            'withHashLocation()',
          ],
          correctIndex: 1,
          explanation:
            '`withComponentInputBinding()` maps route data and parameters to component inputs.',
        },
        {
          question: 'What can a guard return to redirect navigation?',
          options: ['false', 'true', 'UrlTree', 'All of the above'],
          correctIndex: 3,
          explanation:
            'Guards can return boolean values or a `UrlTree` for redirection.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You can read route parameters, bind them to inputs, and protect routes with functional guards.\n\nYou are ready to build real Angular applications.',
    },
  ],
  starterCode: `import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink],
  template: \`
    <h1>User {{ userId() }}</h1>
    <a routerLink="/users">Back to list</a>
  \`,
})
export class UserProfile {
  readonly userId = input.required<string>();
}`,
};
