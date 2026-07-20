import type { MissionMeta } from '../../app/core/models/mission.model';

export const DEPENDENCY_INJECTION_MISSION: MissionMeta = {
  id: 'dependency-injection',
  difficulty: 'intermediate',
  durationMinutes: 18,
  track: 'Reactivity with Signals',
  tags: ['di', 'services', 'inject'],
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
      id: 'checkpoint',
      type: 'checkpoint',
      checkpoints: [{ correctIndex: 1 }, { correctIndex: 1 }],
    },
    {
      id: 'summary',
      type: 'summary',
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
