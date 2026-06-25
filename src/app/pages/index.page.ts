import { Component } from '@angular/core';
import { Counter } from '../components/counter/counter';
import { VoltButton } from '@voltui/components';
import { MoveEnterDirective } from 'angular-movement';

@Component({
  selector: 'app-home',
  imports: [Counter, VoltButton, MoveEnterDirective],
  template: `
    <main class="flex flex-col items-center gap-8 p-8">
      <header moveEnter="fade-up" class="text-center">
        <h1 class="text-4xl font-bold">Angular Lab</h1>
        <p class="text-lg text-slate-600 dark:text-slate-300">
          An interactive learning platform for modern Angular.
        </p>
      </header>

      <app-counter />

      <volt-button
        variant="outline"
        (click)="showNotice = !showNotice"
        >
        {{ showNotice ? 'Hide notice' : 'Show notice' }}
      </volt-button>

      @if (showNotice) {
        <p
          moveEnter="fade-up"
          class="max-w-md rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          role="status"
        >
          Foundation phase complete. The learning platform will be built in
          upcoming phases.
        </p>
      }
    </main>
  `,
})
export default class Home {
  showNotice = false;
}
