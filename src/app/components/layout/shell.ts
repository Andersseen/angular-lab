import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { MoveEnterDirective } from 'angular-movement';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, VoltButton, MoveEnterDirective],
  template: `
    <div
      class="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
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
            <a routerLink="/missions">
              <volt-button variant="ghost" size="sm">Missions</volt-button>
            </a>
            <volt-button
              variant="ghost"
              size="sm"
              class="ml-1"
              [attr.aria-label]="'Theme: ' + theme.mode()"
              (click)="theme.toggle()"
            >
              @switch (theme.mode()) {
                @case ('light') {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                }
                @case ('dark') {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                }
                @default {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                }
              }
            </volt-button>
          </div>
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer
        class="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
      >
        Angular Lab — open source learning platform. Licensed under MIT.
      </footer>
    </div>
  `,
})
export class Shell {
  readonly theme = inject(ThemeService);
}
