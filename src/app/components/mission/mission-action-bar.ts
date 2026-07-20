import { Component, input, output } from '@angular/core';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowLeftIcon } from 'lumen-icons/arrow-left';
import { LmnArrowPathIcon } from 'lumen-icons/arrow-path';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnCheckIcon } from 'lumen-icons/check';

@Component({
  selector: 'app-mission-action-bar',
  standalone: true,
  imports: [
    VoltButton,
    TranslatePipe,
    LmnArrowLeftIcon,
    LmnArrowRightIcon,
    LmnArrowPathIcon,
    LmnCheckIcon,
  ],
  template: `
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-al-line bg-al-surface-raised p-4 shadow-sm"
    >
      <volt-button
        variant="outline"
        [disabled]="!hasPrevious() || completed()"
        (click)="previous.emit()"
      >
        <span class="flex items-center gap-2">
          <lmn-arrow-left [size]="14" />
          {{ 'mission.actionBar.previous' | translate }}
        </span>
      </volt-button>
      <div class="flex flex-wrap gap-3">
        <volt-button
          variant="outline"
          [disabled]="completed()"
          (click)="resetRequested.emit()"
        >
          <span class="flex items-center gap-2">
            <lmn-arrow-path [size]="14" />
            {{ 'mission.actionBar.reset' | translate }}
          </span>
        </volt-button>
        @if (isLastStep() && !completed()) {
          <volt-button (click)="complete.emit()">
            <span class="flex items-center gap-2">
              <lmn-check [size]="14" />
              {{ 'mission.actionBar.complete' | translate }}
            </span>
          </volt-button>
        } @else {
          <volt-button
            [disabled]="!hasNext() || completed()"
            (click)="next.emit()"
          >
            <span class="flex items-center gap-2">
              {{ 'mission.actionBar.next' | translate }}
              <lmn-arrow-right [size]="14" />
            </span>
          </volt-button>
        }
      </div>
    </div>
  `,
})
export class MissionActionBar {
  readonly hasPrevious = input.required<boolean>();
  readonly hasNext = input.required<boolean>();
  readonly isLastStep = input.required<boolean>();
  readonly completed = input.required<boolean>();

  readonly previous = output<void>();
  readonly next = output<void>();
  readonly resetRequested = output<void>();
  readonly complete = output<void>();
}
