import type { MissionMeta } from '../../app/core/models/mission.model';

export const COMPONENT_COMMUNICATION_MISSION: MissionMeta = {
  id: 'component-communication',
  difficulty: 'beginner',
  durationMinutes: 15,
  track: 'Fundamentals',
  tags: ['components', 'inputs', 'outputs'],
  prerequisites: ['reactive-signals'],
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
      checkpoints: [{ correctIndex: 1 }, { correctIndex: 0 }],
    },
    {
      id: 'summary',
      type: 'summary',
    },
  ],
  starterCode: `import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: \`
    <div class="stars">
      @for (star of [1,2,3,4,5]; track star) {
        <button (click)="rate(star)">
          {{ star <= value() ? '★' : '☆' }}
        </button>
      }
    </div>
  \`,
})
export class Rating {
  readonly value = input.required<number>();
  readonly valueChange = output<number>();

  rate(star: number): void {
    this.valueChange.emit(star);
  }
}

@Component({
  selector: 'app-parent',
  template: \`
    <h2>Rating: {{ rating }}</h2>
    <app-rating [value]="rating" (valueChange)="rating = $event" />
  \`,
  imports: [Rating],
})
export class Parent {
  rating = 3;
}`,
};
