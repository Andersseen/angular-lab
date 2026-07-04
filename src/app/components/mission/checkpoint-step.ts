import { Component, input, output, signal } from '@angular/core';
import { VoltButton } from '@voltui/components';
import type { Checkpoint } from '../../core/models/mission.model';
import { CheckpointQuestion } from './checkpoint-question';

@Component({
  selector: 'app-checkpoint-step',
  standalone: true,
  imports: [VoltButton, CheckpointQuestion],
  template: `
    <div class="space-y-6">
      @for (checkpoint of checkpoints(); track checkpoint.question; let i = $index) {
        <app-checkpoint-question
          [checkpoint]="checkpoint"
          [index]="i"
          [selectedOption]="selections()[i]"
          [submitted]="submitted()"
          [isCorrect]="isCorrect(i)"
          (optionSelect)="select(i, $event)"
        />
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
