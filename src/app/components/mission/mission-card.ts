import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VoltBadge,
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import type { Mission } from '../../core/models/mission.model';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'border-success/30 bg-success/10 text-success',
  intermediate: 'border-warning/40 bg-warning/10 text-warning',
  advanced: 'border-danger/30 bg-danger/10 text-danger',
};

@Component({
  selector: 'app-mission-card',
  standalone: true,
  imports: [
    RouterLink,
    VoltBadge,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardFooter,
    VoltCardHeader,
    VoltCardTitle,
    ...MOVEMENT_DIRECTIVES,
    LmnClockIcon,
    LmnListBulletIcon,
    LmnArrowRightIcon,
  ],
  template: `
    <volt-card
      [move]="'fade-up'"
      [moveDelay]="delay()"
      class="group flex flex-col overflow-hidden border-line transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div class="bg-gradient-brand h-1.5 w-full"></div>
      <volt-card-header>
        <div
          class="mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          <span class="rounded-md border border-line bg-surface px-2 py-0.5">
            {{ mission().track }}
          </span>
          <span>·</span>
          <span class="inline-flex items-center gap-1">
            <lmn-clock [size]="12" />
            {{ mission().durationMinutes }} min
          </span>
          @if (mission().previewMode === 'live') {
            <span
              class="inline-flex items-center gap-1 rounded-full border border-accent/50 px-2 py-0.5 text-accent"
            >
              Live
            </span>
          }
        </div>
        <volt-card-title class="text-xl">{{ mission().title }}</volt-card-title>
        <volt-card-description>
          {{ mission().description }}
        </volt-card-description>
      </volt-card-header>
      <volt-card-content class="flex-1">
        <div class="flex flex-wrap gap-2">
          <span
            class="rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize"
            [class]="difficultyClasses()"
          >
            {{ mission().difficulty }}
          </span>
          @for (tag of mission().tags; track tag) {
            <volt-badge variant="outline">{{ tag }}</volt-badge>
          }
        </div>

        <div
          class="mt-5 flex items-center gap-2 font-mono text-xs text-ink-muted"
        >
          <lmn-list-bullet [size]="14" />
          {{ mission().steps.length }} steps
        </div>
      </volt-card-content>
      <volt-card-footer>
        <a routerLink="/mission/{{ mission().id }}">
          <volt-button>
            <span class="flex items-center gap-2">
              Start mission
              <lmn-arrow-right [size]="14" />
            </span>
          </volt-button>
        </a>
      </volt-card-footer>
    </volt-card>
  `,
})
export class MissionCard {
  readonly mission = input.required<Mission>();
  readonly delay = input<number>(0);

  difficultyClasses(): string {
    return DIFFICULTY_STYLES[this.mission().difficulty] ?? '';
  }
}
