import { Component, input, output, signal } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';
import type { Checkpoint } from '../../core/models/mission.model';

@Component({
  selector: 'app-checkpoint-step',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltButton, LmnCheckCircleIcon, LmnXCircleIcon],
  template: `
    <div class="space-y-6">
      @for (checkpoint of checkpoints(); track checkpoint.question; let i = $index) {
        <volt-card class="border-zinc-200 dark:border-zinc-800">
          <volt-card-header>
            <volt-card-title class="text-base">Question {{ i + 1 }}</volt-card-title>
          </volt-card-header>
          <volt-card-content>
            <p class="mb-4 text-zinc-800 dark:text-zinc-100">{{ checkpoint.question }}</p>

            <div class="space-y-2">
              @for (option of checkpoint.options; track option; let o = $index) {
                <button
                  type="button"
                  class="group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all"
                  [class.border-blue-500]="selections()[i] === o"
                  [class.bg-blue-50]="selections()[i] === o"
                  [class.dark:bg-blue-950]="selections()[i] === o"
                  [class.border-zinc-200]="selections()[i] !== o"
                  [class.dark:border-zinc-800]="selections()[i] !== o"
                  [class.hover:border-zinc-300]="selections()[i] !== o && !submitted()"
                  [class.dark:hover:border-zinc-700]="selections()[i] !== o && !submitted()"
                  [class.opacity-60]="submitted() && selections()[i] !== o"
                  [disabled]="submitted()"
                  (click)="select(i, o)"
                >
                  <span
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                    [class.border-blue-500]="selections()[i] === o"
                    [class.bg-blue-500]="selections()[i] === o"
                    [class.text-white]="selections()[i] === o"
                    [class.border-zinc-300]="selections()[i] !== o"
                    [class.dark:border-zinc-700]="selections()[i] !== o"
                  >
                    {{ optionLetter(o) }}
                  </span>
                  {{ option }}
                </button>
              }
            </div>

            @if (submitted()) {
              <div
                class="mt-4 rounded-xl border px-4 py-3 text-sm"
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
                <p class="flex items-center gap-2 font-semibold">
                  @if (isCorrect(i)) {
                    <lmn-check-circle [size]="16" />
                    Correct!
                  } @else {
                    <lmn-x-circle [size]="16" />
                    Not quite.
                  }
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

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
