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
import { ToastContainerComponent, ToastService, TooltipDirective } from 'quartz-headless';
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
    ToastContainerComponent,
  ],
  template: `
    <div
      class="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <header
        moveEnter="fade-down"
        class="app-glass sticky top-0 z-20 border-b border-zinc-200 px-6 py-3.5 shadow-sm dark:border-zinc-800"
      >
        <nav class="mx-auto flex max-w-7xl items-center justify-between">
          <a
            routerLink="/"
            class="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-950 dark:text-white"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-md"
            >
              <lmn-rocket-launch [size]="20" />
            </span>
            Angular Lab
          </a>

          <div class="flex items-center gap-1 sm:gap-2">
            <a routerLink="/">
              <volt-button variant="ghost" size="sm">
                <span class="flex items-center gap-2">
                  <lmn-home [size]="16" />
                  <span class="hidden sm:inline">Home</span>
                </span>
              </volt-button>
            </a>
            <a routerLink="/missions">
              <volt-button variant="ghost" size="sm">
                <span class="flex items-center gap-2">
                  <lmn-list-bullet [size]="16" />
                  <span class="hidden sm:inline">Missions</span>
                </span>
              </volt-button>
            </a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard">
                <volt-button variant="ghost" size="sm">
                  <span class="flex items-center gap-2">
                    <lmn-squares-2x2 [size]="16" />
                    <span class="hidden sm:inline">Dashboard</span>
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
                class="ml-2 hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 sm:inline-flex"
              >
                <lmn-user-circle [size]="14" />
                {{ auth.user()?.name }}
              </span>

              <volt-button
                variant="ghost"
                size="sm"
                class="ml-1"
                [qzTooltip]="'Log out'"
                tooltipPlacement="bottom"
                (click)="logout()"
              >
                <span class="flex items-center gap-2">
                  <lmn-arrow-left-start-on-rectangle [size]="20" />
                  <span class="hidden sm:inline">Log out</span>
                </span>
              </volt-button>
            } @else {
              <a routerLink="/login">
                <volt-button variant="outline" size="sm">
                  <span class="flex items-center gap-2">
                    <lmn-arrow-right-end-on-rectangle [size]="16" />
                    <span class="hidden sm:inline">Log in</span>
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

      <qz-toast-container />

      <footer
        class="border-t border-zinc-200 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
      >
        <p class="font-medium">Angular Lab</p>
        <p class="mt-1">Open source learning platform · Licensed under MIT</p>
      </footer>
    </div>
  `,
})
export class Shell {
  private readonly router = inject(Router);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.toast.info('You have been logged out.', 'See you soon');
      void this.router.navigate(['/']);
    });
  }
}
