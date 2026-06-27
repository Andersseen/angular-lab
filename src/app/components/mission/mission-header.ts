import { Component, computed, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
import type { Mission, MissionProgress } from '../../core/models/mission.model';

@Component({
  selector: 'app-mission-header',
  standalone: true,
  imports: [VoltBadge, VoltProgress],
  template: `
    <header class="mb-8 flex flex-col gap-5">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-bold text-slate-950 dark:text-white">
              {{ mission().title }}
            </h1>
            <volt-badge variant="secondary">{{ difficultyLabel() }}</volt-badge>
          </div>
          <p class="max-w-2xl text-slate-600 dark:text-slate-300">
            {{ mission().description }}
          </p>
        </div>
        <div class="min-w-56">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-medium">Mission progress</span>
            <span class="text-slate-500 dark:text-slate-400">
              {{ progress().percentage }}%
            </span>
          </div>
          <volt-progress [value]="progress().percentage" />
        </div>
      </div>
    </header>
  `,
})
export class MissionHeader {
  readonly mission = input.required<Mission>();
  readonly progress = input.required<MissionProgress>();

  readonly difficultyLabel = computed(
    () =>
      this.mission().difficulty.charAt(0).toUpperCase() +
      this.mission().difficulty.slice(1)
  );
}
