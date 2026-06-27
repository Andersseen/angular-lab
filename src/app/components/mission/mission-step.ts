import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
  VoltSeparator,
} from '@voltui/components';
import type { Step } from '../../core/models/mission.model';

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
      </volt-card-content>
      <volt-card-footer>
        <div
          class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400"
        >
          <span>{{ currentStepNumber() }} of {{ totalSteps() }}</span>
          <volt-separator orientation="vertical" class="h-4" />
          <span>{{ step().id }}</span>
        </div>
      </volt-card-footer>
    </volt-card>
  `,
})
export class MissionStep {
  readonly step = input.required<Step>();
  readonly currentStepNumber = input.required<number>();
  readonly totalSteps = input.required<number>();
}
