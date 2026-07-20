import type { MissionMeta } from '../../app/core/models/mission.model';

export const ROUTING_MISSION: MissionMeta = {
  id: 'modern-routing',
  difficulty: 'intermediate',
  durationMinutes: 20,
  track: 'Routing & Data',
  tags: ['router', 'routes', 'navigation'],
  prerequisites: ['component-communication'],
  steps: [
    {
      id: 'concept',
      type: 'concept',
    },
    {
      id: 'example',
      type: 'example',
    },
    {
      id: 'practice',
      type: 'practice',
    },
    {
      id: 'checkpoint',
      type: 'checkpoint',
      checkpoints: [{ correctIndex: 1 }, { correctIndex: 3 }],
    },
    {
      id: 'summary',
      type: 'summary',
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
