import { Component, input, output } from '@angular/core';
import type { Step } from '../../core/models/mission.model';

const TYPE_ICONS: Record<string, string> = {
  concept: '💡',
  example: '👀',
  practice: '✏️',
  comparison: '⚖️',
  checkpoint: '✅',
  summary: '🏁',
};

@Component({
  selector: 'app-mission-nav',
  standalone: true,
  imports: [],
  template: `
    <nav class="flex flex-col gap-2" aria-label="Mission steps">
      @for (step of steps(); track step.id; let i = $index) {
        <button
          type="button"
          class="group rounded-lg border px-4 py-3 text-left transition-colors"
          [class.border-blue-500]="currentStepId() === step.id"
          [class.bg-blue-50]="currentStepId() === step.id"
          [class.dark:bg-blue-950]="currentStepId() === step.id"
          [class.border-slate-200]="currentStepId() !== step.id"
          [class.dark:border-slate-800]="currentStepId() !== step.id"
          [class.hover:border-slate-300]="currentStepId() !== step.id"
          [class.dark:hover:border-slate-700]="currentStepId() !== step.id"
          [attr.aria-current]="currentStepId() === step.id ? 'step' : null"
          (click)="selectStep.emit(step.id)"
        >
          <span
            class="block text-xs font-medium uppercase tracking-wide"
            [class.text-blue-600]="currentStepId() === step.id"
            [class.dark:text-blue-300]="currentStepId() === step.id"
            [class.text-slate-500]="currentStepId() !== step.id"
            [class.dark:text-slate-400]="currentStepId() !== step.id"
          >
            Step {{ i + 1 }}
          </span>
          <span class="flex items-center gap-2 font-semibold">
            <span aria-hidden="true">{{ typeIcon(step.type) }}</span>
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
    return TYPE_ICONS[type] ?? '•';
  }
}
