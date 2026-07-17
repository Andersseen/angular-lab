import { Component, input, output } from '@angular/core';
import { LmnCheckIcon } from 'lumen-icons/check';
import { LmnSignalIcon } from 'lumen-icons/signal';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';
import type { Difficulty } from '../../core/models/mission.model';

@Component({
  selector: 'app-difficulty-filter',
  standalone: true,
  imports: [LmnCheckIcon, LmnSignalIcon, LmnSquares2x2Icon],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
      >
        Level
      </span>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
        [class]="pillClasses(selectedDifficulty() === null)"
        (click)="selectDifficulty.emit(null)"
      >
        @if (selectedDifficulty() === null) {
          <lmn-check [size]="14" />
        } @else {
          <lmn-squares-2x2 [size]="14" />
        }
        All levels
      </button>
      @for (difficulty of difficulties(); track difficulty) {
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium capitalize transition-all"
          [class]="pillClasses(selectedDifficulty() === difficulty)"
          (click)="selectDifficulty.emit(difficulty)"
        >
          @if (selectedDifficulty() === difficulty) {
            <lmn-check [size]="14" />
          } @else {
            <lmn-signal [size]="14" />
          }
          {{ difficulty }}
        </button>
      }
    </div>
  `,
})
export class DifficultyFilter {
  readonly difficulties = input.required<readonly Difficulty[]>();
  readonly selectedDifficulty = input.required<Difficulty | null>();
  readonly selectDifficulty = output<Difficulty | null>();

  pillClasses(active: boolean): string {
    return active
      ? 'bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900'
      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800';
  }
}
