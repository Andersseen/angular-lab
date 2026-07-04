import { Component, input, output } from '@angular/core';
import { LmnCheckIcon } from 'lumen-icons/check';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';

@Component({
  selector: 'app-track-filter',
  standalone: true,
  imports: [LmnCheckIcon, LmnRocketLaunchIcon, LmnSquares2x2Icon],
  template: `
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
        [class]="pillClasses(selectedTrack() === null)"
        (click)="selectTrack.emit(null)"
      >
        @if (selectedTrack() === null) {
          <lmn-check [size]="14" />
        } @else {
          <lmn-squares-2x2 [size]="14" />
        }
        All tracks
      </button>
      @for (track of tracks(); track track) {
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
          [class]="pillClasses(selectedTrack() === track)"
          (click)="selectTrack.emit(track)"
        >
          @if (selectedTrack() === track) {
            <lmn-check [size]="14" />
          } @else {
            <lmn-rocket-launch [size]="14" />
          }
          {{ track }}
        </button>
      }
    </div>
  `,
})
export class TrackFilter {
  readonly tracks = input.required<readonly string[]>();
  readonly selectedTrack = input.required<string | null>();
  readonly selectTrack = output<string | null>();

  pillClasses(active: boolean): string {
    return active
      ? 'bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900'
      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800';
  }
}
