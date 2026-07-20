import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnCheckIcon } from 'lumen-icons/check';
import { LmnSignalIcon } from 'lumen-icons/signal';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';
import type { Difficulty } from '../../core/models/mission.model';

@Component({
  selector: 'app-difficulty-filter',
  standalone: true,
  imports: [TranslatePipe, LmnCheckIcon, LmnSignalIcon, LmnSquares2x2Icon],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="mr-1 text-xs font-semibold uppercase tracking-wide text-al-ink-muted"
      >
        {{ 'mission.filters.levelLabel' | translate }}
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
        {{ 'mission.filters.allLevels' | translate }}
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
          {{ ('mission.header.difficulty.' + difficulty) | translate }}
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
      ? 'bg-al-brand text-al-brand-ink shadow-md'
      : 'bg-al-surface-raised text-al-ink hover:bg-al-surface border border-al-line';
  }
}
