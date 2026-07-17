import type { Mission } from '../../app/core/models/mission.model';

export const REACTIVE_SIGNALS_MISSION: Mission = {
  id: 'reactive-signals',
  title: 'Reactive Signals',
  description:
    'Master Angular signals: the modern reactive primitive for state that updates the UI automatically.',
  goal: 'Create, read, update, and derive signals in an Angular component.',
  difficulty: 'beginner',
  durationMinutes: 12,
  track: 'Fundamentals',
  tags: ['signals', 'reactivity', 'state'],
  prerequisites: ['dom-playground'],
  steps: [
    {
      id: 'concept',
      title: 'What are signals?',
      type: 'concept',
      content:
        'Signals are the core reactive primitive in modern Angular. A signal holds a value and notifies consumers when that value changes.\n\nUnlike RxJS observables, signals are synchronous and fine-grained: only the DOM nodes that read the signal re-render when it changes.',
    },
    {
      id: 'example',
      title: 'A living counter',
      type: 'example',
      content:
        'The editor contains a tiny counter component. Read the code, then run the preview to see how `signal(0)` and `count.update(...)` work together.',
      hint: 'In the next step you will edit this code yourself.',
    },
    {
      id: 'practice',
      title: 'Add double count',
      type: 'practice',
      content:
        'Add a second signal called `doubleCount` that is computed from `count`. Update the template to display it.\n\nThen click the preview to see the mock result.',
      hint: 'Use `computed(() => count() * 2)` and read it like a function in the template.',
    },
    {
      id: 'comparison',
      title: 'Signals vs RxJS',
      type: 'comparison',
      content:
        'Signals and RxJS solve similar problems in different ways. Understanding when to use each makes your code simpler.',
      comparison: {
        titleA: 'Signals',
        titleB: 'RxJS BehaviorSubject',
        points: [
          {
            aspect: 'API shape',
            a: 'Synchronous getter function: count()',
            b: 'Observable stream: count$.subscribe(...)',
          },
          {
            aspect: 'Granularity',
            a: 'Fine-grained: only readers re-render',
            b: 'Stream-based: consumers handle emissions',
          },
          {
            aspect: 'Best for',
            a: 'Component state, simple reactive values',
            b: 'HTTP streams, event composition, complex async',
          },
        ],
        recommendation:
          'Start with signals for component state. Reach for RxJS when you need operators, async streams, or event composition.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Answer these questions to verify your understanding.',
      checkpoints: [
        {
          question: 'How do you read the current value of a signal?',
          options: [
            'count.value',
            'count()',
            'count.get()',
            'count.subscribe()',
          ],
          correctIndex: 1,
          explanation:
            'Signals are read by calling them as a function: `count()`.',
        },
        {
          question: 'Which method creates a signal derived from other signals?',
          options: ['signal()', 'effect()', 'computed()', 'writable()'],
          correctIndex: 2,
          explanation:
            '`computed(() => ...)` creates a read-only signal derived from other signals.',
        },
        {
          question: 'When should you prefer RxJS over signals?',
          options: [
            'For every reactive value',
            'For simple counters only',
            'For async streams and complex operators',
            'Never; signals replace RxJS completely',
          ],
          correctIndex: 2,
          explanation:
            'RxJS remains the best tool for async streams, HTTP requests, and operator chains.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You have learned how to create signals, update them, derive values with `computed`, and when to combine them with RxJS.\n\nNext mission: pass data between components with inputs and outputs.',
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
