import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  template: `
    <section aria-label="Counter example" class="flex flex-col items-center gap-4">
      <p class="text-2xl" data-testid="counter-count">{{ count() }}</p>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          (click)="increment()"
        >
          Increment
        </button>
        <button
          type="button"
          class="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
          (click)="decrement()"
        >
          Decrement
        </button>
        <button
          type="button"
          class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
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
