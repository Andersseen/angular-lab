import { Component, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
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
    LmnListBulletIcon,
    LmnClockIcon,
    LmnGlobeAltIcon,
  ],
  template: `
    <aside
      class="app-glass rounded-2xl border border-al-line p-6 shadow-xl"
      aria-label="Demo platform snapshot"
    >
      <div
        class="flex items-center justify-between gap-4 border-b border-al-line pb-5"
      >
        <div>
          <p class="text-sm font-medium text-al-ink-muted">Available missions</p>
          <h2 class="font-mono text-3xl font-bold text-al-ink">
            {{ missionCount() }}
          </h2>
        </div>
        <volt-badge>Live demo</volt-badge>
      </div>

      <div class="py-6">
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="font-medium text-al-ink">Platform readiness</span>
          <span class="font-mono text-al-ink-muted">75%</span>
        </div>
        <volt-progress [value]="75" aria-label="Platform readiness: 75%" />
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <app-stat-tile label="guided missions" [value]="missionCount()">
          <lmn-list-bullet data-slot="icon" [size]="14" />
        </app-stat-tile>
        <app-stat-tile label="to first edit" [value]="'<1 min'">
          <lmn-clock data-slot="icon" [size]="14" />
        </app-stat-tile>
        <app-stat-tile label="browser based" [value]="'100%'">
          <lmn-globe-alt data-slot="icon" [size]="14" />
        </app-stat-tile>
      </div>
    </aside>
  `,
})
export class HomeStats {
  readonly missionCount = input.required<number>();
}
