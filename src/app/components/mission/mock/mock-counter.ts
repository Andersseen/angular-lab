import { Component, input, output } from '@angular/core';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnMinusIcon } from 'lumen-icons/minus';
import { LmnPlusIcon } from 'lumen-icons/plus';

@Component({
  selector: 'app-mock-counter',
  standalone: true,
  imports: [VoltButton, TranslatePipe, LmnMinusIcon, LmnPlusIcon],
  template: `
    <div class="text-center">
      <p class="text-sm text-al-ink-muted">{{ 'mission.mock.counter.countLabel' | translate }}</p>
      <p class="text-4xl font-bold text-al-ink">
        {{ count() }}
      </p>
      <div class="mt-4 flex justify-center gap-2">
        <volt-button size="sm" (click)="decrement.emit()">
          <lmn-minus [size]="14" />
          <span class="sr-only">{{ 'mission.mock.counter.decrement' | translate }}</span>
        </volt-button>
        <volt-button size="sm" (click)="increment.emit()">
          <lmn-plus [size]="14" />
          <span class="sr-only">{{ 'mission.mock.counter.increment' | translate }}</span>
        </volt-button>
      </div>
      <p class="mt-3 text-sm text-al-ink-muted">
        {{ 'mission.mock.counter.double' | translate: { value: (count() ?? 0) * 2 } }}
      </p>
    </div>
  `,
})
export class MockCounter {
  readonly count = input.required<number>();
  readonly increment = output<void>();
  readonly decrement = output<void>();
}
