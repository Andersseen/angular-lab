import { Component, effect, inject } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { Router } from '@angular/router';
import {
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnChartPieIcon } from 'lumen-icons/chart-pie';
import { LmnCog6ToothIcon } from 'lumen-icons/cog-6-tooth';
import { LmnTrophyIcon } from 'lumen-icons/trophy';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import { AchievementsTab } from '../components/dashboard/achievements-tab';
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
    TranslatePipe,
    AchievementsTab,
    ProfileTab,
    ProgressTab,
    SettingsTab,
    LmnUserCircleIcon,
    LmnChartPieIcon,
    LmnTrophyIcon,
    LmnCog6ToothIcon,
  ],
  template: `
    <section class="mx-auto w-full max-w-5xl px-6 py-10">
      <header class="mb-8">
        <h1
          class="text-3xl font-bold tracking-tight text-al-ink"
        >
          {{ 'dashboard.heading' | translate }}
        </h1>
        <p class="mt-2 text-al-ink-muted">
          {{ 'dashboard.subtitle' | translate }}
        </p>
      </header>

      <volt-tabs value="profile" class="w-full">
        <!--
          Labels use sr-only (not hidden) so the icon-only mobile tabs keep an
          accessible name — same fix as the nav/user menu in Phase 07.
        -->
        <volt-tabs-list
          class="mb-6 grid w-full grid-cols-4 rounded-xl border border-al-line bg-al-surface-raised p-1 shadow-sm sm:w-fit"
        >
          <volt-tabs-trigger value="profile">
            <span class="flex items-center justify-center gap-2">
              <lmn-user-circle [size]="16" />
              <span class="sr-only sm:not-sr-only">{{
                'dashboard.tabs.profile' | translate
              }}</span>
            </span>
          </volt-tabs-trigger>
          <volt-tabs-trigger value="progress">
            <span class="flex items-center justify-center gap-2">
              <lmn-chart-pie [size]="16" />
              <span class="sr-only sm:not-sr-only">{{
                'dashboard.tabs.progress' | translate
              }}</span>
            </span>
          </volt-tabs-trigger>
          <volt-tabs-trigger value="achievements">
            <span class="flex items-center justify-center gap-2">
              <lmn-trophy [size]="16" />
              <span class="sr-only sm:not-sr-only">{{
                'dashboard.tabs.achievements' | translate
              }}</span>
            </span>
          </volt-tabs-trigger>
          <volt-tabs-trigger value="settings">
            <span class="flex items-center justify-center gap-2">
              <lmn-cog-6-tooth [size]="16" />
              <span class="sr-only sm:not-sr-only">{{
                'dashboard.tabs.settings' | translate
              }}</span>
            </span>
          </volt-tabs-trigger>
        </volt-tabs-list>

        <volt-tabs-content value="profile">
          <app-profile-tab [user]="user()" (logout)="logout()" />
        </volt-tabs-content>

        <volt-tabs-content value="progress">
          <app-progress-tab />
        </volt-tabs-content>

        <volt-tabs-content value="achievements">
          <app-achievements-tab />
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
