import type { MissionMeta } from '../../app/core/models/mission.model';

export const REACTIVE_SIGNALS_MISSION: MissionMeta = {
  id: 'reactive-signals',
  difficulty: 'beginner',
  durationMinutes: 12,
  track: 'Fundamentals',
  tags: ['signals', 'reactivity', 'state'],
  prerequisites: ['dom-playground'],
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
      id: 'comparison',
      type: 'comparison',
    },
    {
      id: 'checkpoint',
      type: 'checkpoint',
      checkpoints: [
        { correctIndex: 1 },
        { correctIndex: 2 },
        { correctIndex: 2 },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
    },
  ],
  starterCode: `import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Increment</button>
  \`,
})
export class Counter {
  readonly count = signal(0);
  readonly doubleCount = computed(() => this.count() * 2);

  increment(): void {
    this.count.update((value) => value + 1);
  }
}`,
};
