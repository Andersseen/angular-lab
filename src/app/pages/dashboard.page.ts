import { Component, effect, inject } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { Router } from '@angular/router';
import {
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { LmnChartPieIcon } from 'lumen-icons/chart-pie';
import { LmnCog6ToothIcon } from 'lumen-icons/cog-6-tooth';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import { ProfileTab } from '../components/dashboard/profile-tab';
import { ProgressTab } from '../components/dashboard/progress-tab';
import { SettingsTab } from '../components/dashboard/settings-tab';
import { AuthService } from '../core/services/auth.service';

export const routeMeta: RouteMeta = {
  title: 'Dashboard — Angular Lab',
  meta: [{ name: 'robots', content: 'noindex' }],
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    VoltTabs,
    VoltTabsContent,
    VoltTabsList,
    VoltTabsTrigger,
    ProfileTab,
    ProgressTab,
    SettingsTab,
    LmnUserCircleIcon,
    LmnChartPieIcon,
    LmnCog6ToothIcon,
  ],
  template: `
    <section class="mx-auto w-full max-w-5xl px-6 py-10">
      <header class="mb-8">
        <h1
          class="text-3xl font-bold tracking-tight text-ink"
        >
          Dashboard
        </h1>
        <p class="mt-2 text-ink-muted">
          Manage your account and track your learning progress.
        </p>
      </header>

      <volt-tabs value="profile" class="w-full">
        <volt-tabs-list
          class="mb-6 grid w-full grid-cols-3 rounded-xl border border-line bg-surface-raised p-1 shadow-sm sm:w-fit"
        >
          <volt-tabs-trigger value="profile">
            <span class="flex items-center justify-center gap-2">
              <lmn-user-circle [size]="16" />
              <span class="hidden sm:inline">Profile</span>
            </span>
          </volt-tabs-trigger>
          <volt-tabs-trigger value="progress">
            <span class="flex items-center justify-center gap-2">
              <lmn-chart-pie [size]="16" />
              <span class="hidden sm:inline">Progress</span>
            </span>
          </volt-tabs-trigger>
          <volt-tabs-trigger value="settings">
            <span class="flex items-center justify-center gap-2">
              <lmn-cog-6-tooth [size]="16" />
              <span class="hidden sm:inline">Settings</span>
            </span>
          </volt-tabs-trigger>
        </volt-tabs-list>

        <volt-tabs-content value="profile">
          <app-profile-tab [user]="user()" (logout)="logout()" />
        </volt-tabs-content>

        <volt-tabs-content value="progress">
          <app-progress-tab />
        </volt-tabs-content>

        <volt-tabs-content value="settings">
          <app-settings-tab />
        </volt-tabs-content>
      </volt-tabs>
    </section>
  `,
})
export default class Dashboard {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly user = this.auth.user.asReadonly();

  constructor() {
    effect(() => {
      if (this.auth.isGuest()) {
        void this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      void this.router.navigate(['/']);
    });
  }
}
