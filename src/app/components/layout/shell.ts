import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MoveEnterDirective } from 'angular-movement';
import { ToastContainerComponent, ToastService } from 'quartz-headless';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { AppLogo } from './app-logo';
import { NavLinks } from './nav-links';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MoveEnterDirective,
    AppLogo,
    NavLinks,
    ThemeToggle,
    UserMenu,
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
          <app-logo />

          <div class="flex items-center gap-1 sm:gap-2">
            <app-nav-links [isAuthenticated]="auth.isAuthenticated()" />
            <app-theme-toggle />
            <app-user-menu
              [isAuthenticated]="auth.isAuthenticated()"
              [userName]="auth.user()?.name"
              (logout)="logout()"
            />
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
