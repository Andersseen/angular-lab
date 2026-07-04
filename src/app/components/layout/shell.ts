import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { MoveEnterDirective } from 'angular-movement';
import { LmnArrowLeftStartOnRectangleIcon } from 'lumen-icons/arrow-left-start-on-rectangle';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnHomeIcon } from 'lumen-icons/home';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnMoonIcon } from 'lumen-icons/moon';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';
import { LmnSunIcon } from 'lumen-icons/sun';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import { TooltipDirective } from 'quartz-headless';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    VoltButton,
    MoveEnterDirective,
    LmnHomeIcon,
    LmnListBulletIcon,
    LmnRocketLaunchIcon,
    LmnSquares2x2Icon,
    LmnMoonIcon,
    LmnSunIcon,
    LmnArrowRightEndOnRectangleIcon,
    LmnArrowLeftStartOnRectangleIcon,
    LmnUserCircleIcon,
    TooltipDirective,
  ],
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
            class="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400"
          >
            <lmn-rocket-launch [size]="24" tone="primary" />
            Angular Lab
          </a>
          <div class="flex items-center gap-2">
            <a routerLink="/">
              <volt-button variant="ghost" size="sm">
                <span class="flex items-center gap-2">
                  <lmn-home [size]="16" />
                  Home
                </span>
              </volt-button>
            </a>
            <a routerLink="/missions">
              <volt-button variant="ghost" size="sm">
                <span class="flex items-center gap-2">
                  <lmn-list-bullet [size]="16" />
                  Missions
                </span>
              </volt-button>
            </a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard">
                <volt-button variant="ghost" size="sm">
                  <span class="flex items-center gap-2">
                    <lmn-squares-2x2 [size]="16" />
                    Dashboard
                  </span>
                </volt-button>
              </a>
            }

            <volt-button
              variant="ghost"
              size="sm"
              class="ml-1"
              [attr.aria-label]="
                'Switch to ' + (theme.mode() === 'light' ? 'dark' : 'light') + ' theme'
              "
              [qzTooltip]="
                'Switch to ' + (theme.mode() === 'light' ? 'dark' : 'light') + ' mode'
              "
              tooltipPlacement="bottom"
              (click)="theme.toggle()"
            >
              @if (theme.mode() === 'light') {
                <lmn-moon [size]="20" ariaLabel="Switch to dark theme" />
              } @else {
                <lmn-sun [size]="20" ariaLabel="Switch to light theme" />
              }
            </volt-button>

            @if (auth.isAuthenticated()) {
              <span
                class="ml-2 hidden items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline-flex"
              >
                <lmn-user-circle [size]="16" />
                {{ auth.user()?.name }}
              </span>

              <volt-button
                variant="ghost"
                size="sm"
                class="ml-1"
                (click)="logout()"
              >
                <span class="flex items-center gap-2">
                  <lmn-arrow-left-start-on-rectangle [size]="16" />
                  Log out
                </span>
              </volt-button>
            } @else {
              <a routerLink="/login">
                <volt-button variant="outline" size="sm">
                  <span class="flex items-center gap-2">
                    <lmn-arrow-right-end-on-rectangle [size]="16" />
                    Log in
                  </span>
                </volt-button>
              </a>
            }
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
  private readonly router = inject(Router);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);

  logout(): void {
    this.auth.logout().subscribe(() => {
      void this.router.navigate(['/']);
    });
  }
}
