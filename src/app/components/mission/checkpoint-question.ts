import { Component, ElementRef, input, output, viewChildren } from '@angular/core';
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
    <volt-card class="border-line">
      <volt-card-header>
        <volt-card-title class="text-base">Question {{ index() + 1 }}</volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p
          [id]="'checkpoint-question-' + index()"
          class="mb-4 text-ink"
        >
          {{ checkpoint().question }}
        </p>

        <div
          class="space-y-2"
          role="radiogroup"
          [attr.aria-labelledby]="'checkpoint-question-' + index()"
        >
          @for (option of checkpoint().options; track option; let o = $index) {
            <button
              #optionButton
              type="button"
              role="radio"
              [attr.aria-checked]="selectedOption() === o"
              [tabIndex]="rovingTabIndex(o)"
              [class]="optionClasses(o)"
              [disabled]="submitted()"
              (click)="optionSelect.emit(o)"
              (keydown)="onKeydown($event)"
            >
              <span [class]="optionLetterClasses(o)">
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

  private readonly optionButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('optionButton');

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  optionClasses(optionIndex: number): string {
    const base =
      'group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all';
    if (this.selectedOption() === optionIndex) {
      return `${base} border-brand bg-brand/10`;
    }
    if (this.submitted()) {
      return `${base} border-line opacity-60`;
    }
    return `${base} border-line hover:border-brand`;
  }

  optionLetterClasses(optionIndex: number): string {
    const base =
      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold';
    return this.selectedOption() === optionIndex
      ? `${base} border-brand bg-brand text-brand-ink`
      : `${base} border-line`;
  }

  rovingTabIndex(optionIndex: number): number {
    const active = this.selectedOption() ?? 0;
    return optionIndex === active ? 0 : -1;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.submitted()) {
      return;
    }

    const optionCount = this.checkpoint().options.length;
    const current = this.selectedOption() ?? 0;
    let next: number;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (current + 1) % optionCount;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (current - 1 + optionCount) % optionCount;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = optionCount - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.optionSelect.emit(next);
    this.optionButtons()[next]?.nativeElement.focus();
  }
}
