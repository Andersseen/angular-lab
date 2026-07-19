import { Component, input } from '@angular/core';

/**
 * Page title block: optional eyebrow chip (project its icon with
 * `data-slot="eyebrow-icon"`), an h1 heading, and an optional description.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  template: `
    <div>
      @if (eyebrow()) {
        <div
          class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-al-line bg-al-surface-raised px-3 py-1 text-xs font-semibold uppercase tracking-wide text-al-ink-muted"
        >
          <ng-content select="[data-slot=eyebrow-icon]" />
          {{ eyebrow() }}
        </div>
      }
      <h1 class="text-3xl font-bold tracking-tight text-al-ink sm:text-4xl">
        {{ heading() }}
      </h1>
      @if (description()) {
        <p class="mt-3 max-w-2xl text-al-ink-muted">{{ description() }}</p>
      }
    </div>
  `,
})
export class PageHeader {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly description = input<string>();
}
