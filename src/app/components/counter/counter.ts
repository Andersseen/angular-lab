import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  template: `
    <section aria-label="Counter example" class="flex flex-col items-center gap-4">
      <p class="text-2xl" data-testid="counter-count">{{ count() }}</p>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded bg-al-brand px-4 py-2 text-al-brand-ink transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-al-brand"
          (click)="increment()"
        >
          Increment
        </button>
        <button
          type="button"
          class="rounded border border-al-line bg-al-surface-raised px-4 py-2 text-al-ink transition-colors hover:bg-al-surface focus:outline-none focus:ring-2 focus:ring-al-brand"
          (click)="decrement()"
        >
          Decrement
        </button>
        <button
          type="button"
          class="rounded bg-al-danger px-4 py-2 text-al-danger-ink transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-al-danger"
          (click)="reset()"
        >
          Reset
        </button>
      </div>
    </section>
  `,
})
export class Counter {
  readonly count = signal(0);

  increment(): void {
    this.count.update((value) => value + 1);
  }

  decrement(): void {
    this.count.update((value) => value - 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
