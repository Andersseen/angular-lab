import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnStarIcon } from 'lumen-icons/star';

@Component({
  selector: 'app-mock-rating',
  standalone: true,
  imports: [TranslatePipe, LmnStarIcon],
  template: `
    <div class="text-center">
      <p class="text-sm text-al-ink-muted">{{ 'mission.mock.rating.yourRating' | translate }}</p>
      <div class="mt-2 flex justify-center gap-1 text-2xl text-al-warning">
        @for (star of [1, 2, 3, 4, 5]; track star) {
          <button
            type="button"
            class="transition-transform hover:scale-110"
            (click)="setRating.emit(star)"
          >
            <lmn-star
              [size]="24"
              [variant]="star <= value() ? 'filled' : 'outline'"
            />
          </button>
        }
      </div>
      <p class="mt-3 text-lg font-semibold text-al-ink">
        {{ value() }} / 5
      </p>
    </div>
  `,
})
export class MockRating {
  readonly value = input.required<number>();
  readonly setRating = output<number>();
}
