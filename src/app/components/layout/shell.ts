import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MoveEnterDirective } from 'angular-movement';
import { ToastContainerComponent, ToastService } from 'quartz-headless';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { AppLogo } from './app-logo';
import { EmailVerificationBanner } from './email-verification-banner';
import { LanguageSwitcher } from './language-switcher';
import { NavLinks } from './nav-links';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MoveEnterDirective,
    TranslatePipe,
    AppLogo,
    NavLinks,
    ThemeToggle,
    LanguageSwitcher,
    UserMenu,
    EmailVerificationBanner,
    ToastContainerComponent,
  ],
  template: `
    <div
      class="flex min-h-screen flex-col bg-al-surface text-al-ink"
    >
      <header
        moveEnter="fade-down"
        class="app-glass sticky top-0 z-20 border-b border-al-line px-6 py-3.5 shadow-sm"
      >
        <nav class="mx-auto flex max-w-7xl items-center justify-between">
          <app-logo />

          <div class="flex items-center gap-1 sm:gap-2">
            <app-nav-links [isAuthenticated]="auth.isAuthenticated()" />
            <app-theme-toggle />
            <app-language-switcher />
            <app-user-menu
              [isAuthenticated]="auth.isAuthenticated()"
              [userName]="auth.user()?.name"
              (logout)="logout()"
            />
          </div>
        </nav>
      </header>

      <app-email-verification-banner />

      <main class="flex-1">
        <router-outlet />
      </main>

      <qz-toast-container />

      <footer
        class="border-t border-al-line bg-al-surface px-6 py-8 text-center text-sm text-al-ink-muted"
      >
        <p class="font-medium">Angular Lab</p>
        <p class="mt-1">{{ 'shell.footerTagline' | translate }}</p>
      </footer>
    </div>
  `,
})
export class Shell {
  private readonly router = inject(Router);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.toast.info(
        this.translate.instant('shell.loggedOutToastMessage'),
        this.translate.instant('shell.loggedOutToastTitle')
      );
      void this.router.navigate(['/']);
    });
  }
}
