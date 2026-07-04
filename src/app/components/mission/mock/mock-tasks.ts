import { Component, input, output } from '@angular/core';
import { VoltButton } from '@voltui/components';

@Component({
  selector: 'app-mock-tasks',
  standalone: true,
  imports: [VoltButton],
  template: `
    <div class="w-full max-w-sm">
      <p class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Tasks
      </p>
      <ul class="mb-4 space-y-2">
        @for (item of items(); track item) {
          <li
            class="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {{ item }}
          </li>
        }
      </ul>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="New task..."
          class="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          [value]="draft()"
          (input)="draftChange.emit($any($event).target.value)"
          (keydown.enter)="addTask.emit()"
        />
        <volt-button size="sm" (click)="addTask.emit()">Add</volt-button>
      </div>
    </div>
  `,
})
export class MockTasks {
  readonly items = input.required<readonly string[]>();
  readonly draft = input.required<string>();

  readonly draftChange = output<string>();
  readonly addTask = output<void>();
}
