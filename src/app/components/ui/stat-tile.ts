import { Component, input } from '@angular/core';

/**
 * Compact metric tile: uppercase label with an optional leading icon (project
 * with `data-slot="icon"`) over a mono-accent value. Mono type is the identity
 * signal for numbers/stats.
 */
@Component({
  selector: 'app-stat-tile',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-xl border border-al-line bg-al-surface-raised p-3">
      <div class="mb-1 flex items-center gap-1.5 text-al-ink-muted">
        <ng-content select="[data-slot=icon]" />
        <span class="text-[10px] font-semibold uppercase tracking-wide">
          {{ label() }}
        </span>
      </div>
      <p class="font-mono text-xl font-bold text-al-ink">{{ value() }}</p>
    </div>
  `,
})
export class StatTile {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
}
