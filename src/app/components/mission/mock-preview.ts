import { Component, computed, input, signal } from '@angular/core';
import { VoltButton } from '@voltui/components';
import { LmnMinusIcon } from 'lumen-icons/minus';
import { LmnPlusIcon } from 'lumen-icons/plus';
import { LmnStarIcon } from 'lumen-icons/star';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import type { Mission, Step } from '../../core/models/mission.model';

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
  imports: [VoltButton, LmnMinusIcon, LmnPlusIcon, LmnStarIcon, LmnUserCircleIcon],
  template: `
    <div
      class="flex h-96 flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        class="flex items-center justify-between border-b border-zinc-100 px-4 py-2 dark:border-zinc-800"
      >
        <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Mock preview
        </span>
        <span class="text-xs text-zinc-400 dark:text-zinc-500">
          Live execution coming soon
        </span>
      </div>

      <div class="flex flex-1 items-center justify-center p-6">
        @switch (renderState().kind) {
          @case ('counter') {
            <div class="text-center">
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Count</p>
              <p class="text-4xl font-bold text-zinc-950 dark:text-white">
                {{ renderState().count }}
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <volt-button size="sm" (click)="decrement()">
                  <lmn-minus [size]="14" />
                  <span class="sr-only">Decrement</span>
                </volt-button>
                <volt-button size="sm" (click)="increment()">
                  <lmn-plus [size]="14" />
                  <span class="sr-only">Increment</span>
                </volt-button>
              </div>
              <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Double: {{ (renderState().count ?? 0) * 2 }}
              </p>
            </div>
          }

          @case ('rating') {
            <div class="text-center">
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Your rating</p>
              <div class="mt-2 flex justify-center gap-1 text-2xl text-amber-500">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button
                    type="button"
                    class="transition-transform hover:scale-110"
                    (click)="setRating(star)"
                  >
                    <lmn-star
                      [size]="24"
                      [variant]="star <= (renderState().value ?? 0) ? 'filled' : 'outline'"
                    />
                  </button>
                }
              </div>
              <p class="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">
                {{ renderState().value }} / 5
              </p>
            </div>
          }

          @case ('tasks') {
            <div class="w-full max-w-sm">
              <p class="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Tasks
              </p>
              <ul class="mb-4 space-y-2">
                @for (item of renderState().items; track item) {
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
                  [value]="renderState().draft"
                  (input)="updateDraft($any($event).target.value)"
                  (keydown.enter)="addTask()"
                />
                <volt-button size="sm" (click)="addTask()">Add</volt-button>
              </div>
            </div>
          }

          @case ('profile') {
            <div class="text-center">
              <div
                class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-2xl font-bold text-white shadow-lg"
              >
                <lmn-user-circle [size]="32" />
              </div>
              <p class="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
                User {{ renderState().userId }}
              </p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">
                Mock profile page
              </p>
            </div>
          }

          @default {
            <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
              {{ renderState().message }}
            </p>
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
