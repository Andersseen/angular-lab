import { Component, computed, inject, input, output } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowPathIcon } from 'lumen-icons/arrow-path';
import { LmnCheckBadgeIcon } from 'lumen-icons/check-badge';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import type { Mission } from '../../core/models/mission.model';
import { AchievementsService } from '../../core/services/achievements.service';
import { BadgeTile } from '../ui/badge-tile';
import { CompletionCard } from './completion-card';

@Component({
  selector: 'app-mission-completed',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardHeader,
    VoltCardTitle,
    VoltButton,
    TranslatePipe,
    BadgeTile,
    CompletionCard,
    LmnCheckBadgeIcon,
    LmnRocketLaunchIcon,
    LmnArrowPathIcon,
  ],
  template: `
    <volt-card class="overflow-hidden border-al-success/30">
      <div class="h-1.5 w-full bg-gradient-brand"></div>
      <volt-card-header>
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-al-success/10 text-al-success"
        >
          <lmn-check-badge [size]="24" />
        </div>
        <volt-card-title class="text-2xl text-al-success">
          {{ 'mission.completed.title' | translate }}
        </volt-card-title>
      </volt-card-header>
      <volt-card-content>
        <p class="text-lg text-al-ink">
          {{ 'mission.completed.finishedMessage' | translate: { title: mission().title } }}
        </p>
        <p class="mt-2 text-al-ink-muted">
          {{
            'mission.completed.estimatedTime'
              | translate
                : { minutes: mission().durationMinutes, track: mission().track }
          }}
        </p>

        @if (newBadges().length > 0) {
          <h3
            class="mt-6 mb-3 text-sm font-semibold uppercase tracking-wide text-al-ink-muted"
          >
            {{
              (newBadges().length === 1
                ? 'mission.completed.badgeUnlocked'
                : 'mission.completed.badgesUnlocked'
              ) | translate
            }}
          </h3>
          <ul class="grid list-none gap-3 p-0 sm:grid-cols-2">
            @for (badge of newBadges(); track badge.id) {
              <li><app-badge-tile [badge]="badge" /></li>
            }
          </ul>
        }

        <div class="mt-6">
          <app-completion-card [mission]="mission()" />
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <volt-button (click)="explore.emit()">
            <span class="flex items-center gap-2">
              <lmn-rocket-launch [size]="16" />
              {{ 'mission.completed.exploreMore' | translate }}
            </span>
          </volt-button>
          <volt-button variant="outline" (click)="replay.emit()">
            <span class="flex items-center gap-2">
              <lmn-arrow-path [size]="16" />
              {{ 'mission.completed.replay' | translate }}
            </span>
          </volt-button>
        </div>
      </volt-card-content>
    </volt-card>
  `,
})
export class MissionCompleted {
  private readonly achievements = inject(AchievementsService);

  readonly mission = input.required<Mission>();
  readonly explore = output<void>();
  readonly replay = output<void>();

  readonly newBadges = computed(() =>
    this.achievements.badgesEarnedByMission(this.mission().id)
  );
}
