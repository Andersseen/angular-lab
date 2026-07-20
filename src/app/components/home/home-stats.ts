import { Component, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnGlobeAltIcon } from 'lumen-icons/globe-alt';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { StatTile } from '../ui/stat-tile';

@Component({
  selector: 'app-home-stats',
  standalone: true,
  imports: [
    VoltBadge,
    VoltProgress,
    StatTile,
    TranslatePipe,
    LmnListBulletIcon,
    LmnClockIcon,
    LmnGlobeAltIcon,
  ],
  template: `
    <aside
      class="app-glass rounded-2xl border border-al-line p-6 shadow-xl"
      [attr.aria-label]="'home.stats.ariaLabel' | translate"
    >
      <div
        class="flex items-center justify-between gap-4 border-b border-al-line pb-5"
      >
        <div>
          <p class="text-sm font-medium text-al-ink-muted">
            {{ 'home.stats.availableMissions' | translate }}
          </p>
          <h2 class="font-mono text-3xl font-bold text-al-ink">
            {{ missionCount() }}
          </h2>
        </div>
        <volt-badge>{{ 'home.stats.liveDemo' | translate }}</volt-badge>
      </div>

      <div class="py-6">
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="font-medium text-al-ink">{{
            'home.stats.platformReadiness' | translate
          }}</span>
          <span class="font-mono text-al-ink-muted">75%</span>
        </div>
        <volt-progress
          [value]="75"
          [attr.aria-label]="'home.stats.platformReadinessAria' | translate"
        />
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <app-stat-tile
          [label]="'home.stats.guidedMissions' | translate"
          [value]="missionCount()"
        >
          <lmn-list-bullet data-slot="icon" [size]="14" />
        </app-stat-tile>
        <app-stat-tile
          [label]="'home.stats.toFirstEdit' | translate"
          [value]="'home.stats.firstEditValue' | translate"
        >
          <lmn-clock data-slot="icon" [size]="14" />
        </app-stat-tile>
        <app-stat-tile
          [label]="'home.stats.browserBased' | translate"
          [value]="'home.stats.browserBasedValue' | translate"
        >
          <lmn-globe-alt data-slot="icon" [size]="14" />
        </app-stat-tile>
      </div>
    </aside>
  `,
})
export class HomeStats {
  readonly missionCount = input.required<number>();
}
