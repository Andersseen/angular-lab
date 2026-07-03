import { Component, input, output, signal } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import type { Checkpoint } from '../../core/models/mission.model';

@Component({
  selector: 'app-checkpoint-step',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltButton],
  template: `
    <div class="space-y-6">
      @for (checkpoint of checkpoints(); track checkpoint.question; let i = $index) {
        <volt-card>
          <volt-card-header>
            <volt-card-title>Question {{ i + 1 }}</volt-card-title>
          </volt-card-header>
          <volt-card-content>
            <p class="mb-4 text-slate-800 dark:text-slate-100">{{ checkpoint.question }}</p>

            <div class="space-y-2">
              @for (option of checkpoint.options; track option; let o = $index) {
                <button
                  type="button"
                  class="w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors"
                  [class.border-blue-500]="selections()[i] === o"
                  [class.bg-blue-50]="selections()[i] === o"
                  [class.dark:bg-blue-950]="selections()[i] === o"
                  [class.border-slate-200]="selections()[i] !== o"
                  [class.dark:border-slate-800]="selections()[i] !== o"
                  [class.opacity-60]="submitted() && selections()[i] !== o"
                  (click)="select(i, o)"
                >
                  {{ option }}
                </button>
              }
            </div>

            @if (submitted()) {
              <div
                class="mt-4 rounded-lg border px-4 py-3 text-sm"
                [class.border-emerald-200]="isCorrect(i)"
                [class.bg-emerald-50]="isCorrect(i)"
                [class.text-emerald-800]="isCorrect(i)"
                [class.dark:border-emerald-900]="isCorrect(i)"
                [class.dark:bg-emerald-950]="isCorrect(i)"
                [class.dark:text-emerald-100]="isCorrect(i)"
                [class.border-rose-200]="!isCorrect(i)"
                [class.bg-rose-50]="!isCorrect(i)"
                [class.text-rose-800]="!isCorrect(i)"
                [class.dark:border-rose-900]="!isCorrect(i)"
                [class.dark:bg-rose-950]="!isCorrect(i)"
                [class.dark:text-rose-100]="!isCorrect(i)"
              >
                <p class="font-medium">
                  {{ isCorrect(i) ? 'Correct!' : 'Not quite.' }}
                </p>
                <p class="mt-1">{{ checkpoints()[i].explanation }}</p>
              </div>
            }
          </volt-card-content>
        </volt-card>
      }

      <div class="flex justify-end">
        <volt-button [disabled]="!canSubmit()" (click)="submit()">
          Check answers
        </volt-button>
      </div>
    </div>
  `,
})
export class CheckpointStep {
  readonly checkpoints = input.required<readonly Checkpoint[]>();
  readonly allCorrect = output<void>();

  readonly selections = signal<Record<number, number>>({});
  readonly submitted = signal(false);

  readonly canSubmit = () => {
    const checkpoints = this.checkpoints();
    const selected = this.selections();
    return checkpoints.every((_, i) => selected[i] !== undefined);
  };

  select(index: number, optionIndex: number): void {
    if (this.submitted()) {
      return;
    }
    this.selections.update((current) => ({ ...current, [index]: optionIndex }));
  }

  submit(): void {
    this.submitted.set(true);
    if (this.checkpoints().every((_, i) => this.isCorrect(i))) {
      this.allCorrect.emit();
    }
  }

  isCorrect(index: number): boolean {
    return this.selections()[index] === this.checkpoints()[index].correctIndex;
  }
}
