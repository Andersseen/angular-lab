import { Component, computed, input, signal } from '@angular/core';
import type { Mission, Step } from '../../core/models/mission.model';
import { MockCounter } from './mock/mock-counter';
import { MockPlaceholder } from './mock/mock-placeholder';
import { MockProfile } from './mock/mock-profile';
import { MockRating } from './mock/mock-rating';
import { MockTasks } from './mock/mock-tasks';

interface MockState {
  kind: 'counter' | 'rating' | 'tasks' | 'profile' | 'placeholder';
  count?: number;
  value?: number;
  items?: string[];
  draft?: string;
  userId?: string;
  message?: string;
}

@Component({
  selector: 'app-mock-preview',
  standalone: true,
  imports: [
    MockCounter,
    MockRating,
    MockTasks,
    MockProfile,
    MockPlaceholder,
  ],
  template: `
    <div
      class="flex h-96 flex-col rounded-xl border border-al-line bg-al-surface-raised shadow-sm"
    >
      <div
        class="flex items-center justify-between border-b border-al-line px-4 py-2"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wide text-al-ink-muted"
        >
          Mock preview
        </span>
        <span class="text-xs text-al-ink-muted">
          Live execution coming soon
        </span>
      </div>

      <div class="flex flex-1 items-center justify-center p-6">
        @switch (renderState().kind) {
          @case ('counter') {
            <app-mock-counter
              [count]="renderState().count ?? 0"
              (increment)="increment()"
              (decrement)="decrement()"
            />
          }

          @case ('rating') {
            <app-mock-rating
              [value]="renderState().value ?? 0"
              (setRating)="setRating($event)"
            />
          }

          @case ('tasks') {
            <app-mock-tasks
              [items]="renderState().items ?? []"
              [draft]="renderState().draft ?? ''"
              (draftChange)="updateDraft($event)"
              (addTask)="addTask()"
            />
          }

          @case ('profile') {
            <app-mock-profile [userId]="renderState().userId ?? ''" />
          }

          @default {
            <app-mock-placeholder [message]="renderState().message ?? ''" />
          }
        }
      </div>
    </div>
  `,
})
export class MockPreview {
  readonly mission = input.required<Mission>();
  readonly step = input.required<Step>();

  readonly counter = signal(0);
  readonly rating = signal(3);
  readonly tasks = signal<string[]>(['Learn signals', 'Build a component']);
  readonly draft = signal('');
  readonly userId = signal('42');

  readonly renderState = computed<MockState>(() => {
    const missionId = this.mission().id;
    const type = this.step().type;

    if (missionId === 'reactive-signals' && (type === 'example' || type === 'practice')) {
      return { kind: 'counter', count: this.counter() };
    }

    if (missionId === 'component-communication' && (type === 'example' || type === 'practice')) {
      return { kind: 'rating', value: this.rating() };
    }

    if (missionId === 'dependency-injection' && (type === 'example' || type === 'practice')) {
      return { kind: 'tasks', items: this.tasks(), draft: this.draft() };
    }

    if (missionId === 'modern-routing' && (type === 'example' || type === 'practice')) {
      return { kind: 'profile', userId: this.userId() };
    }

    return {
      kind: 'placeholder',
      message: 'This step is about understanding concepts. Run the next practice step to see a live mock preview.',
    };
  });

  increment(): void {
    this.counter.update((value) => value + 1);
  }

  decrement(): void {
    this.counter.update((value) => Math.max(0, value - 1));
  }

  setRating(value: number): void {
    this.rating.set(value);
  }

  updateDraft(value: string): void {
    this.draft.set(value);
  }

  addTask(): void {
    const title = this.draft().trim();
    if (!title) {
      return;
    }
    this.tasks.update((list) => [...list, title]);
    this.draft.set('');
  }
}
