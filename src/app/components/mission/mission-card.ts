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
  beginner:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  intermediate:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  advanced:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
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
      class="group flex flex-col overflow-hidden border-zinc-200 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800"
    >
      <div
        class="h-1.5 w-full bg-gradient-to-r from-blue-500 to-violet-500"
      ></div>
      <volt-card-header>
        <div
          class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          <span
            class="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {{ mission().track }}
          </span>
          <span>·</span>
          <span class="inline-flex items-center gap-1">
            <lmn-clock [size]="12" />
            {{ mission().durationMinutes }} min
          </span>
          @if (mission().previewMode === 'live') {
            <span>·</span>
            <span
              class="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400"
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
          class="mt-5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
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
