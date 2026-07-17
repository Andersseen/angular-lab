import {
  afterRenderEffect,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
  VoltSeparator,
} from '@voltui/components';
import { LmnArrowsRightLeftIcon } from 'lumen-icons/arrows-right-left';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnEyeIcon } from 'lumen-icons/eye';
import { LmnFlagIcon } from 'lumen-icons/flag';
import { LmnLightBulbIcon } from 'lumen-icons/light-bulb';
import { LmnPencilSquareIcon } from 'lumen-icons/pencil-square';
import type { Step } from '../../core/models/mission.model';
import { CheckpointStep } from './checkpoint-step';
import { ComparisonStep } from './comparison-step';

const TYPE_ICONS: Record<string, string> = {
  concept: 'light-bulb',
  example: 'eye',
  practice: 'pencil-square',
  comparison: 'arrows-right-left',
  checkpoint: 'check-circle',
  summary: 'flag',
};

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
    LmnLightBulbIcon,
    LmnEyeIcon,
    LmnPencilSquareIcon,
    LmnArrowsRightLeftIcon,
    LmnCheckCircleIcon,
    LmnFlagIcon,
  ],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <div class="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <span class="inline-flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
            @switch (typeIcon(step().type)) {
              @case ('light-bulb') {
                <lmn-light-bulb [size]="12" />
              }
              @case ('eye') {
                <lmn-eye [size]="12" />
              }
              @case ('pencil-square') {
                <lmn-pencil-square [size]="12" />
              }
              @case ('arrows-right-left') {
                <lmn-arrows-right-left [size]="12" />
              }
              @case ('check-circle') {
                <lmn-check-circle [size]="12" />
              }
              @case ('flag') {
                <lmn-flag [size]="12" />
              }
            }
          </span>
          <span class="capitalize">{{ step().type }}</span>
        </div>
        <volt-card-title #stepTitle tabindex="-1" class="text-xl outline-none">{{
          step().title
        }}</volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p
          class="whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-200"
        >
          {{ step().content }}
        </p>

        @if (step().hint) {
          <div
            class="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100"
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
          class="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400"
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

  private readonly stepTitle = viewChild('stepTitle', { read: ElementRef });

  constructor() {
    afterRenderEffect(() => {
      const step = this.step();
      const heading = this.stepTitle()?.nativeElement as HTMLElement | undefined;
      if (step && heading) {
        heading.focus({ preventScroll: true });
      }
    });
  }

  typeIcon(type: string): string {
    return TYPE_ICONS[type] ?? 'light-bulb';
  }
}
