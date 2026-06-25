import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { MoveEnterDirective } from 'angular-movement';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, VoltButton, MoveEnterDirective],
  template: `
    <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header
        moveEnter="fade-down"
        class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
      >
        <nav class="mx-auto flex max-w-7xl items-center justify-between">
          <a
            routerLink="/"
            class="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400"
          >
            Angular Lab
          </a>
          <div class="flex items-center gap-2">
            <a routerLink="/">
              <volt-button variant="ghost" size="sm">Home</volt-button>
            </a>
            <a routerLink="/mission">
              <volt-button variant="ghost" size="sm">Demo Mission</volt-button>
            </a>
          </div>
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Angular Lab — open source learning platform. Licensed under MIT.
      </footer>
    </div>
  `,
})
export class Shell {}
