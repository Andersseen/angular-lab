import { Injectable } from '@angular/core';
import type { Mission } from '../models/mission.model';

const REACTIVE_SIGNALS_MISSION: Mission = {
  id: 'reactive-signals',
  title: 'Reactive Signals',
  description: 'Learn how to create and update signals in Angular.',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Fundamentals',
  steps: [
    {
      id: 'concept',
      title: 'Concept',
      type: 'concept',
      content:
        'Signals are the core reactive primitive in modern Angular. A signal holds a value and notifies consumers when that value changes.',
    },
    {
      id: 'example',
      title: 'Example',
      type: 'example',
      content:
        'The editor below contains a tiny component. Read the code, then try changing the initial count.',
    },
    {
      id: 'practice',
      title: 'Practice',
      type: 'practice',
      content:
        'Add a second signal called `doubleCount` that is computed from `count`. Update the template to display it.',
    },
  ],
  starterCode: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-greeter',
  template: \`
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">Increment</button>
  \`,
})
export class Greeter {
  readonly count = signal(0);

  increment(): void {
    this.count.update((value) => value + 1);
  }
}`,
};

@Injectable({
  providedIn: 'root',
})
export class MissionCatalogService {
  private readonly catalog: readonly Mission[] = [REACTIVE_SIGNALS_MISSION];

  getAll(): readonly Mission[] {
    return this.catalog;
  }

  getById(id: string): Mission | undefined {
    return this.catalog.find((mission) => mission.id === id);
  }
}
