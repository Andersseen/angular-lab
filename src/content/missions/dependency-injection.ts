import type { Mission } from '../../app/core/models/mission.model';

export const DEPENDENCY_INJECTION_MISSION: Mission = {
  id: 'dependency-injection',
  title: 'Dependency Injection Basics',
  description:
    'Understand how Angular provides and injects services, and when to use different injection scopes.',
  goal: 'Share reactive state across components with an injectable service and inject().',
  difficulty: 'intermediate',
  durationMinutes: 18,
  track: 'Reactivity with Signals',
  tags: ['di', 'services', 'inject'],
  prerequisites: ['reactive-signals'],
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
