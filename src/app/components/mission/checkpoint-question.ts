import { Component, input, output } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
  VoltRadioGroup,
  VoltRadioItem,
} from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import type { Checkpoint } from '../../core/models/mission.model';
import { CheckpointFeedback } from './checkpoint-feedback';

@Component({
  selector: 'app-checkpoint-question',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardHeader,
    VoltCardTitle,
    VoltRadioGroup,
    VoltRadioItem,
    TranslatePipe,
    CheckpointFeedback,
  ],
  template: `
    <volt-card class="border-al-line">
      <volt-card-header>
        <volt-card-title class="text-base">
          {{ 'mission.checkpoint.questionNumber' | translate: { number: index() + 1 } }}
        </volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p [id]="'checkpoint-question-' + index()" class="mb-4 text-al-ink">
          {{ checkpoint().question }}
        </p>

        <volt-radio-group
          class="block space-y-2"
          [value]="selectedValue()"
          [disabled]="submitted()"
          (valueChange)="onValueChange($event)"
          [attr.aria-labelledby]="'checkpoint-question-' + index()"
        >
          @for (option of checkpoint().options; track option; let o = $index) {
            <label [class]="optionClasses(o)">
              <volt-radio-item [value]="optionValue(o)" />
              <span [class]="optionLetterClasses(o)">{{ optionLetter(o) }}</span>
              <span>{{ option }}</span>
            </label>
          }
        </volt-radio-group>

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

  optionValue(optionIndex: number): string {
    return String(optionIndex);
  }

  selectedValue(): string | null {
    const selected = this.selectedOption();
    return selected === undefined ? null : String(selected);
  }

  onValueChange(value: string | null): void {
    if (value !== null && !this.submitted()) {
      this.optionSelect.emit(Number(value));
    }
  }

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  optionClasses(optionIndex: number): string {
    const base =
      'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all';
    if (this.selectedOption() === optionIndex) {
      return `${base} border-al-brand bg-al-brand/10`;
    }
    if (this.submitted()) {
      return `${base} border-al-line opacity-60`;
    }
    return `${base} border-al-line hover:border-al-brand`;
  }

  optionLetterClasses(optionIndex: number): string {
    const base =
      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold';
    return this.selectedOption() === optionIndex
      ? `${base} border-al-brand bg-al-brand text-al-brand-ink`
      : `${base} border-al-line`;
  }
}
