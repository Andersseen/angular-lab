import { Component, input, output } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnArrowPathIcon } from 'lumen-icons/arrow-path';
import { LmnCheckBadgeIcon } from 'lumen-icons/check-badge';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import type { Mission } from '../../core/models/mission.model';

@Component({
  selector: 'app-mission-completed',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltButton, LmnCheckBadgeIcon, LmnRocketLaunchIcon, LmnArrowPathIcon],
  template: `
    <volt-card
      class="overflow-hidden border-emerald-200 dark:border-emerald-900"
    >
      <div
        class="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500"
      ></div>
      <volt-card-header>
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
        >
          <lmn-check-badge [size]="24" />
        </div>
        <volt-card-title class="text-2xl text-emerald-700 dark:text-emerald-300">
          Mission completed!
        </volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p class="text-lg text-zinc-800 dark:text-zinc-100">
          You finished <strong>{{ mission().title }}</strong>.
        </p>
        <p class="mt-2 text-zinc-600 dark:text-zinc-300">
          Estimated time: {{ mission().durationMinutes }} minutes · Track:
          {{ mission().track }}
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <volt-button (click)="explore.emit()">
            <span class="flex items-center gap-2">
              <lmn-rocket-launch [size]="16" />
              Explore more missions
            </span>
          </volt-button>
          <volt-button variant="outline" (click)="replay.emit()">
            <span class="flex items-center gap-2">
              <lmn-arrow-path [size]="16" />
              Replay mission
            </span>
          </volt-button>
        </div>
      </volt-card-content>
    </volt-card>
  `,
})
export class MissionCompleted {
  readonly mission = input.required<Mission>();
  readonly explore = output<void>();
  readonly replay = output<void>();
}
