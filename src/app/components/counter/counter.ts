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
          class="rounded bg-brand px-4 py-2 text-brand-ink transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand"
          (click)="increment()"
        >
          Increment
        </button>
        <button
          type="button"
          class="rounded border border-line bg-surface-raised px-4 py-2 text-ink transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
          (click)="decrement()"
        >
          Decrement
        </button>
        <button
          type="button"
          class="rounded bg-danger px-4 py-2 text-danger-ink transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-danger"
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
