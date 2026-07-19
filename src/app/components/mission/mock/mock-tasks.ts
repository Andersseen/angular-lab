import { Component, input, output } from '@angular/core';
import { VoltButton } from '@voltui/components';

@Component({
  selector: 'app-mock-tasks',
  standalone: true,
  imports: [VoltButton],
  template: `
    <div class="w-full max-w-sm">
      <p class="mb-3 text-sm font-medium text-al-ink">
        Tasks
      </p>
      <ul class="mb-4 space-y-2">
        @for (item of items(); track item) {
          <li
            class="rounded-lg bg-al-surface px-3 py-2 text-sm text-al-ink"
          >
            {{ item }}
          </li>
        }
      </ul>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="New task..."
          class="flex-1 rounded-lg border border-al-line bg-al-surface-raised px-3 py-2 text-sm text-al-ink placeholder:text-al-ink-muted"
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
