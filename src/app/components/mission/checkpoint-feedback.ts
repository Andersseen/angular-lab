import { Component, input } from '@angular/core';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';

@Component({
  selector: 'app-checkpoint-feedback',
  standalone: true,
  imports: [LmnCheckCircleIcon, LmnXCircleIcon],
  template: `
    <div role="status" [class]="containerClasses()">
      <p class="flex items-center gap-2 font-semibold text-al-ink">
        @if (correct()) {
          <lmn-check-circle [size]="16" class="text-al-success" />
          Correct!
        } @else {
          <lmn-x-circle [size]="16" class="text-al-danger" />
          Not quite.
        }
      </p>
      <p class="mt-1 text-al-ink-muted">{{ explanation() }}</p>
    </div>
  `,
})
export class CheckpointFeedback {
  readonly correct = input.required<boolean>();
  readonly explanation = input.required<string>();

  containerClasses(): string {
    const base = 'mt-4 rounded-xl border px-4 py-3 text-sm';
    return this.correct()
      ? `${base} border-al-success/30 bg-al-success/10`
      : `${base} border-al-danger/30 bg-al-danger/10`;
  }
}
