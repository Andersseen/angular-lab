import type { Mission } from '../../app/core/models/mission.model';

export const COMPONENT_COMMUNICATION_MISSION: Mission = {
  id: 'component-communication',
  title: 'Component Inputs & Outputs',
  description:
    'Learn the modern way to pass data down and send events up between Angular components.',
  goal: 'Pass data down with input() and send events up with output().',
  difficulty: 'beginner',
  durationMinutes: 15,
  track: 'Fundamentals',
  tags: ['components', 'inputs', 'outputs'],
  prerequisites: ['reactive-signals'],
  steps: [
    {
      id: 'concept',
      title: 'Input and Output flow',
      type: 'concept',
      content:
        'Angular components form a tree. Parents pass data down with `input()` and children send events up with `output()`.\n\nThis unidirectional flow makes applications predictable and easy to debug.',
    },
    {
      id: 'example',
      title: 'Rating component',
      type: 'example',
      content:
        'The editor shows a `Rating` component that receives a `value` input and emits a `valueChange` output when the user clicks a star.',
    },
    {
      id: 'practice',
      title: 'Bind the rating',
      type: 'practice',
      content:
        'Complete the parent component so it displays the current rating and updates it when the child emits a change.',
      hint: 'Use `[(value)]` two-way binding or the explicit `[value] + (valueChange)` pair.',
    },
    {
      id: 'comparison',
      title: 'Input required vs optional',
      type: 'comparison',
      content:
        'Angular inputs can be required or optional. Choosing the right default makes components safer.',
      comparison: {
        titleA: 'input.required<string>()',
        titleB: 'input<string>()',
        points: [
          {
            aspect: 'Compiler check',
            a: 'Parent must provide the binding',
            b: 'Binding is optional',
          },
          {
            aspect: 'Runtime value',
            a: 'Always defined',
            b: 'May be undefined unless default is set',
          },
          {
            aspect: 'Best for',
            a: 'Critical configuration values',
            b: 'Optional flags and defaults',
          },
        ],
        recommendation:
          'Use `input.required()` for values the component cannot work without. Use optional `input()` with defaults for flags and modifiers.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Test your knowledge of component communication.',
      checkpoints: [
        {
          question: 'Which function declares an output in a child component?',
          options: ['input()', 'output()', 'emit()', 'signal()'],
          correctIndex: 1,
          explanation: '`output()` creates an event emitter for parent binding.',
        },
        {
          question: 'What is the shorthand for `[value]="x" (valueChange)="x=$event"`?',
          options: [
            '[(value)]="x"',
            '[value]="x"',
            '(value)="x"',
            'bind-value="x"',
          ],
          correctIndex: 0,
          explanation:
            'Banana-in-a-box `[(value)]` enables two-way binding when the output is named `valueChange`.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You can now pass data down with inputs, send events up with outputs, and choose between required and optional inputs.\n\nNext mission: share services with dependency injection.',
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
