import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltProgress,
} from '@voltui/components';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { AuthService } from '../../core/services/auth.service';
import { MissionCatalogService } from '../../core/services/mission-catalog.service';
import { ProgressSyncService } from '../../core/services/progress-sync.service';

@Component({
  selector: 'app-progress-tab',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    VoltProgress,
    LmnRocketLaunchIcon,
  ],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <volt-card-title>Learning progress</volt-card-title>
        <volt-card-description>
          @if (auth.isAuthenticated()) {
            Synced across devices when you are signed in.
          } @else {
            Stored locally on this device while you browse as a guest.
          }
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        @if (summary().started === 0) {
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
        } @else {
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Started</p>
              <p class="mt-1 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                {{ summary().started }}
              </p>
            </div>
            <div class="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Completed</p>
              <p class="mt-1 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                {{ summary().completed }}
              </p>
            </div>
            <div class="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Catalog</p>
              <p class="mt-1 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                {{ summary().total }}
              </p>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            @for (item of missionProgress(); track item.id) {
              <a
                [routerLink]="['/mission', item.id]"
                class="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-medium text-zinc-950 dark:text-zinc-50">
                      {{ item.title }}
                    </p>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">
                      Step {{ item.currentStep }} of {{ item.totalSteps }}
                    </p>
                  </div>
                  <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {{ item.percentage }}%
                  </span>
                </div>
                <volt-progress class="mt-3" [value]="item.percentage" />
              </a>
            }
          </div>
        }
      </volt-card-content>
    </volt-card>
  `,
})
export class ProgressTab {
  readonly auth = inject(AuthService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly progressSync = inject(ProgressSyncService);

  readonly missionProgress = computed(() =>
    this.progressSync.localProgress()
      .map((entry) => {
        const mission = this.catalog.getById(entry.missionId);
        if (!mission) {
          return undefined;
        }
        const stepIndex = mission.steps.findIndex((step) => step.id === entry.currentStepId);
        const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;
        const totalSteps = mission.steps.length;
        return {
          id: mission.id,
          title: mission.title,
          currentStep,
          totalSteps,
          percentage: entry.completed
            ? 100
            : Math.round((currentStep / totalSteps) * 100),
          completed: entry.completed,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item)
  );

  readonly summary = computed(() => {
    const progress = this.missionProgress();
    return {
      started: progress.length,
      completed: progress.filter((item) => item.completed).length,
      total: this.catalog.getAll().length,
    };
  });
}
