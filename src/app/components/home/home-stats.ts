import { Component, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnGlobeAltIcon } from 'lumen-icons/globe-alt';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';

@Component({
  selector: 'app-home-stats',
  standalone: true,
  imports: [VoltBadge, VoltProgress, LmnListBulletIcon, LmnClockIcon, LmnGlobeAltIcon],
  template: `
    <aside
      class="app-glass rounded-2xl border border-zinc-200 p-6 shadow-xl dark:border-zinc-800"
      aria-label="Demo platform snapshot"
    >
      <div
        class="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800"
      >
        <div>
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Available missions
          </p>
          <h2 class="text-3xl font-bold">{{ missionCount() }}</h2>
        </div>
        <volt-badge>Live demo</volt-badge>
      </div>

      <div class="py-6">
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="font-medium">Platform readiness</span>
          <span class="text-zinc-500 dark:text-zinc-400">75%</span>
        </div>
        <volt-progress [value]="75" />
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <div
          class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <lmn-list-bullet [size]="14" />
            <span class="text-[10px] font-semibold uppercase tracking-wide">
              guided missions
            </span>
          </div>
          <p class="text-xl font-bold">{{ missionCount() }}</p>
        </div>
        <div
          class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <lmn-clock [size]="14" />
            <span class="text-[10px] font-semibold uppercase tracking-wide">
              to first edit
            </span>
          </div>
          <p class="text-xl font-bold">&lt;1 min</p>
        </div>
        <div
          class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <lmn-globe-alt [size]="14" />
            <span class="text-[10px] font-semibold uppercase tracking-wide">
              browser based
            </span>
          </div>
          <p class="text-xl font-bold">100%</p>
        </div>
      </div>
    </aside>
  `,
})
export class HomeStats {
  readonly missionCount = input.required<number>();
}
