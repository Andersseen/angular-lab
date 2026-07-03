import { Component, input, output } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import type { Mission } from '../../core/models/mission.model';

@Component({
  selector: 'app-mission-completed',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, VoltButton],
  template: `
    <volt-card class="border-emerald-200 dark:border-emerald-900">
      <volt-card-header>
        <volt-card-title class="text-emerald-700 dark:text-emerald-300">
          🎉 Mission completed!
        </volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p class="text-lg text-slate-800 dark:text-slate-100">
          You finished <strong>{{ mission().title }}</strong>.
        </p>
        <p class="mt-2 text-slate-600 dark:text-slate-300">
          Estimated time: {{ mission().durationMinutes }} minutes · Track: {{ mission().track }}
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <volt-button (click)="explore.emit()">Explore more missions</volt-button>
          <volt-button variant="outline" (click)="replay.emit()">Replay mission</volt-button>
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
