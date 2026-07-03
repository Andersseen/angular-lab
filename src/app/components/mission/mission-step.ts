import { Component, input, output } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
  VoltSeparator,
} from '@voltui/components';
import type { Step } from '../../core/models/mission.model';
import { CheckpointStep } from './checkpoint-step';
import { ComparisonStep } from './comparison-step';

@Component({
  selector: 'app-mission-step',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardFooter,
    VoltCardHeader,
    VoltCardTitle,
    VoltSeparator,
    CheckpointStep,
    ComparisonStep,
  ],
  template: `
    <volt-card>
      <volt-card-header>
        <volt-card-title>{{ step().title }}</volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p
          class="whitespace-pre-line text-base leading-7 text-slate-700 dark:text-slate-200"
        >
          {{ step().content }}
        </p>

        @if (step().hint) {
          <div
            class="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100"
          >
            <span class="font-semibold">Hint:</span> {{ step().hint }}
          </div>
        }

        @if (step().type === 'comparison' && step().comparison) {
          <div class="mt-6">
            <app-comparison-step [comparison]="step().comparison!" />
          </div>
        }

        @if (step().type === 'checkpoint' && step().checkpoints) {
          <div class="mt-6">
            <app-checkpoint-step
              [checkpoints]="step().checkpoints!"
              (allCorrect)="allCorrect.emit()"
            />
          </div>
        }
      </volt-card-content>
      <volt-card-footer>
        <div
          class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400"
        >
          <span>{{ currentStepNumber() }} of {{ totalSteps() }}</span>
          <volt-separator orientation="vertical" class="h-4" />
          <span class="capitalize">{{ step().type }}</span>
        </div>
      </volt-card-footer>
    </volt-card>
  `,
})
export class MissionStep {
  readonly step = input.required<Step>();
  readonly currentStepNumber = input.required<number>();
  readonly totalSteps = input.required<number>();
  readonly allCorrect = output<void>();
}
