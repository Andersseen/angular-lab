import { Component, input, output } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import type { Checkpoint } from '../../core/models/mission.model';
import { CheckpointFeedback } from './checkpoint-feedback';

@Component({
  selector: 'app-checkpoint-question',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, CheckpointFeedback],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <volt-card-title class="text-base">Question {{ index() + 1 }}</volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p class="mb-4 text-zinc-800 dark:text-zinc-100">{{ checkpoint().question }}</p>

        <div class="space-y-2">
          @for (option of checkpoint().options; track option; let o = $index) {
            <button
              type="button"
              class="group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all"
              [class.border-blue-500]="selectedOption() === o"
              [class.bg-blue-50]="selectedOption() === o"
              [class.dark:bg-blue-950]="selectedOption() === o"
              [class.border-zinc-200]="selectedOption() !== o"
              [class.dark:border-zinc-800]="selectedOption() !== o"
              [class.hover:border-zinc-300]="selectedOption() !== o && !submitted()"
              [class.dark:hover:border-zinc-700]="selectedOption() !== o && !submitted()"
              [class.opacity-60]="submitted() && selectedOption() !== o"
              [disabled]="submitted()"
              (click)="optionSelect.emit(o)"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                [class.border-blue-500]="selectedOption() === o"
                [class.bg-blue-500]="selectedOption() === o"
                [class.text-white]="selectedOption() === o"
                [class.border-zinc-300]="selectedOption() !== o"
                [class.dark:border-zinc-700]="selectedOption() !== o"
              >
                {{ optionLetter(o) }}
              </span>
              {{ option }}
            </button>
          }
        </div>

        @if (submitted()) {
          <app-checkpoint-feedback
            [correct]="isCorrect()"
            [explanation]="checkpoint().explanation"
          />
        }
      </volt-card-content>
    </volt-card>
  `,
})
export class CheckpointQuestion {
  readonly checkpoint = input.required<Checkpoint>();
  readonly index = input.required<number>();
  readonly selectedOption = input.required<number | undefined>();
  readonly submitted = input.required<boolean>();
  readonly isCorrect = input.required<boolean>();

  readonly optionSelect = output<number>();

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
