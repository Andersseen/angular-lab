import { Component, input, output } from '@angular/core';
import { LmnArrowsRightLeftIcon } from 'lumen-icons/arrows-right-left';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnEyeIcon } from 'lumen-icons/eye';
import { LmnFlagIcon } from 'lumen-icons/flag';
import { LmnLightBulbIcon } from 'lumen-icons/light-bulb';
import { LmnPencilSquareIcon } from 'lumen-icons/pencil-square';
import type { Step } from '../../core/models/mission.model';

const TYPE_ICONS: Record<string, string> = {
  concept: 'light-bulb',
  example: 'eye',
  practice: 'pencil-square',
  comparison: 'arrows-right-left',
  checkpoint: 'check-circle',
  summary: 'flag',
};

@Component({
  selector: 'app-mission-nav',
  standalone: true,
  imports: [
    LmnLightBulbIcon,
    LmnEyeIcon,
    LmnPencilSquareIcon,
    LmnArrowsRightLeftIcon,
    LmnCheckCircleIcon,
    LmnFlagIcon,
  ],
  template: `
    <nav class="flex flex-col gap-2" aria-label="Mission steps">
      @for (step of steps(); track step.id; let i = $index) {
        <button
          type="button"
          class="group relative rounded-xl border px-4 py-3 text-left transition-all"
          [class.border-blue-500]="currentStepId() === step.id"
          [class.bg-blue-50]="currentStepId() === step.id"
          [class.dark:bg-blue-950]="currentStepId() === step.id"
          [class.border-zinc-200]="currentStepId() !== step.id"
          [class.dark:border-zinc-800]="currentStepId() !== step.id"
          [class.hover:border-zinc-300]="currentStepId() !== step.id"
          [class.dark:hover:border-zinc-700]="currentStepId() !== step.id"
          [class.hover:bg-zinc-50]="currentStepId() !== step.id"
          [class.dark:hover:bg-zinc-900]="currentStepId() !== step.id"
          [attr.aria-current]="currentStepId() === step.id ? 'step' : null"
          (click)="selectStep.emit(step.id)"
        >
          @if (currentStepId() === step.id) {
            <span
              class="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-blue-500"
            ></span>
          }
          <span
            class="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
            [class.text-blue-600]="currentStepId() === step.id"
            [class.dark:text-blue-300]="currentStepId() === step.id"
            [class.text-zinc-500]="currentStepId() !== step.id"
            [class.dark:text-zinc-400]="currentStepId() !== step.id"
          >
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-md bg-current/10">
              @switch (typeIcon(step.type)) {
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
            Step {{ i + 1 }}
          </span>
          <span class="block font-semibold text-zinc-900 dark:text-zinc-100">
            {{ step.title }}
          </span>
        </button>
      }
    </nav>
  `,
})
export class MissionNav {
  readonly steps = input.required<readonly Step[]>();
  readonly currentStepId = input.required<string>();
  readonly selectStep = output<string>();

  typeIcon(type: string): string {
    return TYPE_ICONS[type] ?? 'light-bulb';
  }
}
