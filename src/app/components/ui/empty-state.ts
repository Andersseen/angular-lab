import { Component, input } from '@angular/core';
import { GradientIcon } from './gradient-icon';

/**
 * Centered empty / not-found placeholder on a blueprint panel. Project the
 * header icon with `data-slot="icon"` and an optional call-to-action with
 * `data-slot="action"`.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [GradientIcon],
  template: `
    <div
      class="app-blueprint flex flex-col items-center justify-center rounded-2xl border border-al-line px-6 py-16 text-center"
    >
      <div class="mb-5 flex justify-center">
        <app-gradient-icon size="lg">
          <ng-content select="[data-slot=icon]" />
        </app-gradient-icon>
      </div>
      <h2 class="text-xl font-semibold text-al-ink">{{ title() }}</h2>
      @if (message()) {
        <p class="mt-2 max-w-sm text-sm text-al-ink-muted">{{ message() }}</p>
      }
      <div class="mt-6 empty:hidden">
        <ng-content select="[data-slot=action]" />
      </div>
    </div>
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input<string>();
}
