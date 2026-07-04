import { Component, input } from '@angular/core';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';

@Component({
  selector: 'app-checkpoint-feedback',
  standalone: true,
  imports: [LmnCheckCircleIcon, LmnXCircleIcon],
  template: `
    <div
      class="mt-4 rounded-xl border px-4 py-3 text-sm"
      [class.border-emerald-200]="correct()"
      [class.bg-emerald-50]="correct()"
      [class.text-emerald-800]="correct()"
      [class.dark:border-emerald-900]="correct()"
      [class.dark:bg-emerald-950]="correct()"
      [class.dark:text-emerald-100]="correct()"
      [class.border-rose-200]="!correct()"
      [class.bg-rose-50]="!correct()"
      [class.text-rose-800]="!correct()"
      [class.dark:border-rose-900]="!correct()"
      [class.dark:bg-rose-950]="!correct()"
      [class.dark:text-rose-100]="!correct()"
    >
      <p class="flex items-center gap-2 font-semibold">
        @if (correct()) {
          <lmn-check-circle [size]="16" />
          Correct!
        } @else {
          <lmn-x-circle [size]="16" />
          Not quite.
        }
      </p>
      <p class="mt-1">{{ explanation() }}</p>
    </div>
  `,
})
export class CheckpointFeedback {
  readonly correct = input.required<boolean>();
  readonly explanation = input.required<string>();
}
