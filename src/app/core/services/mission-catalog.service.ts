import { Injectable } from '@angular/core';
import type { Mission } from '../models/mission.model';

const REACTIVE_SIGNALS_MISSION: Mission = {
  id: 'reactive-signals',
  title: 'Reactive Signals',
  description:
    'Master Angular signals: the modern reactive primitive for state that updates the UI automatically.',
  difficulty: 'beginner',
  durationMinutes: 12,
  track: 'Fundamentals',
  tags: ['signals', 'reactivity', 'state'],
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

const COMPONENT_COMMUNICATION_MISSION: Mission = {
  id: 'component-communication',
  title: 'Component Inputs & Outputs',
  description:
    'Learn the modern way to pass data down and send events up between Angular components.',
  difficulty: 'beginner',
  durationMinutes: 15,
  track: 'Fundamentals',
  tags: ['components', 'inputs', 'outputs'],
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

const DEPENDENCY_INJECTION_MISSION: Mission = {
  id: 'dependency-injection',
  title: 'Dependency Injection Basics',
  description:
    'Understand how Angular provides and injects services, and when to use different injection scopes.',
  difficulty: 'intermediate',
  durationMinutes: 18,
  track: 'Fundamentals',
  tags: ['di', 'services', 'inject'],
  steps: [
    {
      id: 'concept',
      title: 'The injector tree',
      type: 'concept',
      content:
        'Angular builds an injector tree that mirrors the component tree. Services registered at root are singletons; services provided in a component live as long as that component.\n\nUse `inject()` to request a dependency from the closest injector.',
    },
    {
      id: 'example',
      title: 'A task service',
      type: 'example',
      content:
        'The editor contains a `TaskService` provided at root and a `TaskList` component that injects it. Notice how `inject(TaskService)` replaces constructor injection.',
    },
    {
      id: 'practice',
      title: 'Add a filter',
      type: 'practice',
      content:
        'Add a `filter` signal to the service and a method `setFilter(query: string)`. Update the component to show only matching tasks.',
      hint: 'Use `computed(() => tasks().filter(...))` in the service so every consumer sees the filtered list.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Check your DI knowledge.',
      checkpoints: [
        {
          question: 'Which function is the modern way to inject a service?',
          options: ['constructor()', 'inject()', 'provide()', 'useClass()'],
          correctIndex: 1,
          explanation:
            '`inject()` is the recommended API inside components, directives, and services.',
        },
        {
          question: 'What lifetime has a service provided in a component?',
          options: [
            'Application lifetime',
            'Same as the component',
            'One per module',
            'One per route',
          ],
          correctIndex: 1,
          explanation:
            'A service provided in a component is created and destroyed with that component instance.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You understand how Angular resolves dependencies through the injector tree and how to scope services to components.\n\nNext mission: navigate between views with the modern Angular router.',
    },
  ],
  starterCode: `import { Injectable, Component, inject, signal, computed } from '@angular/core';

interface Task {
  id: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Learn signals' },
    { id: 2, title: 'Build a component' },
  ]);

  add(title: string): void {
    this.tasks.update((list) => [...list, { id: list.length + 1, title }]);
  }
}

@Component({
  selector: 'app-task-list',
  template: \`
    <ul>
      @for (task of taskService.tasks(); track task.id) {
        <li>{{ task.title }}</li>
      }
    </ul>
  \`,
})
export class TaskList {
  readonly taskService = inject(TaskService);
}`,
};

const ROUTING_MISSION: Mission = {
  id: 'modern-routing',
  title: 'Modern Angular Routing',
  description:
    'Navigate between views, read route parameters, and protect routes with modern router APIs.',
  difficulty: 'intermediate',
  durationMinutes: 20,
  track: 'Routing',
  tags: ['router', 'routes', 'navigation'],
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

@Injectable({
  providedIn: 'root',
})
export class MissionCatalogService {
  private readonly catalog: readonly Mission[] = [
    REACTIVE_SIGNALS_MISSION,
    COMPONENT_COMMUNICATION_MISSION,
    DEPENDENCY_INJECTION_MISSION,
    ROUTING_MISSION,
  ];

  getAll(): readonly Mission[] {
    return this.catalog;
  }

  getById(id: string): Mission | undefined {
    return this.catalog.find((mission) => mission.id === id);
  }

  getTracks(): readonly string[] {
    return [...new Set(this.catalog.map((mission) => mission.track))];
  }

  getByTrack(track: string): readonly Mission[] {
    return this.catalog.filter((mission) => mission.track === track);
  }
}
