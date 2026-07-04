import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnChartPieIcon } from 'lumen-icons/chart-pie';
import { LmnCog6ToothIcon } from 'lumen-icons/cog-6-tooth';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    VoltTabs,
    VoltTabsContent,
    VoltTabsList,
    VoltTabsTrigger,
    LmnUserCircleIcon,
    LmnChartPieIcon,
    LmnCog6ToothIcon,
    LmnRocketLaunchIcon,
    LmnArrowRightEndOnRectangleIcon,
  ],
  template: `
    <section class="mx-auto w-full max-w-5xl px-6 py-10">
      <header class="mb-8">
        <h1
          class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white"
        >
          Dashboard
        </h1>
        <p class="mt-2 text-zinc-600 dark:text-zinc-300">
          Manage your account and track your learning progress.
        </p>
      </header>

      <volt-tabs value="profile" class="w-full">
        <volt-tabs-list
          class="mb-6 grid w-full grid-cols-3 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit"
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
          <volt-card class="border-zinc-200 dark:border-zinc-800">
            <volt-card-header>
              <volt-card-title>Your profile</volt-card-title>
              <volt-card-description>
                This is the information we have on file for you.
              </volt-card-description>
            </volt-card-header>
            <volt-card-content class="space-y-4">
              @if (user(); as user) {
                <div class="grid gap-4 sm:grid-cols-2">
                  <div
                    class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">Name</p>
                    <p
                      class="text-lg font-semibold text-zinc-950 dark:text-white"
                    >
                      {{ user.name }}
                    </p>
                  </div>
                  <div
                    class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
                    <p
                      class="text-lg font-semibold text-zinc-950 dark:text-white"
                    >
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              }
              <div class="flex justify-end">
                <volt-button variant="outline" (click)="logout()">
                  <span class="flex items-center gap-2">
                    <lmn-arrow-right-end-on-rectangle [size]="16" />
                    Log out
                  </span>
                </volt-button>
              </div>
            </volt-card-content>
          </volt-card>
        </volt-tabs-content>

        <volt-tabs-content value="progress">
          <volt-card class="border-zinc-200 dark:border-zinc-800">
            <volt-card-header>
              <volt-card-title>Learning progress</volt-card-title>
              <volt-card-description>
                Your mission progress is stored locally in this demo. Cloud sync
                is coming soon.
              </volt-card-description>
            </volt-card-header>
            <volt-card-content>
              <div
                class="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700"
              >
                <p class="text-zinc-600 dark:text-zinc-300">
                  Complete missions to see your progress here.
                </p>
                <a routerLink="/missions">
                  <volt-button>
                    <span class="flex items-center gap-2">
                      <lmn-rocket-launch [size]="16" />
                      Browse missions
                    </span>
                  </volt-button>
                </a>
              </div>
            </volt-card-content>
          </volt-card>
        </volt-tabs-content>

        <volt-tabs-content value="settings">
          <volt-card class="border-zinc-200 dark:border-zinc-800">
            <volt-card-header>
              <volt-card-title>Account settings</volt-card-title>
              <volt-card-description>
                More settings will be available as the platform grows.
              </volt-card-description>
            </volt-card-header>
            <volt-card-content>
              <p class="text-sm text-zinc-600 dark:text-zinc-300">
                You are currently logged in as a free user. No payment methods
                are configured.
              </p>
            </volt-card-content>
          </volt-card>
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
