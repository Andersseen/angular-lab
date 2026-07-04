import { Component, computed, inject, signal } from '@angular/core';
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
import { LmnCheckIcon } from 'lumen-icons/check';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  intermediate:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  advanced:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
};

@Component({
  selector: 'app-missions',
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
    LmnSquares2x2Icon,
    LmnRocketLaunchIcon,
    LmnCheckIcon,
    LmnClockIcon,
    LmnListBulletIcon,
    LmnArrowRightIcon,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:py-14"
      moveEnter="fade-up"
    >
      <header class="max-w-2xl">
        <div
          class="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
        >
          <lmn-rocket-launch [size]="12" />
          Learning paths
        </div>
        <h1
          class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl"
        >
          Missions
        </h1>
        <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Pick a mission and learn Angular by writing real code in the browser.
          No setup required.
        </p>
      </header>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
          [class]="pillClasses(selectedTrack() === null)"
          (click)="selectTrack(null)"
        >
          @if (selectedTrack() === null) {
            <lmn-check [size]="14" />
          } @else {
            <lmn-squares-2x2 [size]="14" />
          }
          All tracks
        </button>
        @for (track of tracks(); track track) {
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
            [class]="pillClasses(selectedTrack() === track)"
            (click)="selectTrack(track)"
          >
            @if (selectedTrack() === track) {
              <lmn-check [size]="14" />
            } @else {
              <lmn-rocket-launch [size]="14" />
            }
            {{ track }}
          </button>
        }
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (mission of filteredMissions(); track mission.id; let i = $index) {
          <volt-card
            [move]="'fade-up'"
            [moveDelay]="i * 80"
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
                  {{ mission.track }}
                </span>
                <span>·</span>
                <span class="inline-flex items-center gap-1">
                  <lmn-clock [size]="12" />
                  {{ mission.durationMinutes }} min
                </span>
              </div>
              <volt-card-title class="text-xl">{{ mission.title }}</volt-card-title>
              <volt-card-description>
                {{ mission.description }}
              </volt-card-description>
            </volt-card-header>
            <volt-card-content class="flex-1">
              <div class="flex flex-wrap gap-2">
                <span
                  class="rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize"
                  [class]="difficultyClasses(mission.difficulty)"
                >
                  {{ mission.difficulty }}
                </span>
                @for (tag of mission.tags; track tag) {
                  <volt-badge variant="outline">{{ tag }}</volt-badge>
                }
              </div>

              <div
                class="mt-5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
              >
                <lmn-list-bullet [size]="14" />
                {{ mission.steps.length }} steps
              </div>
            </volt-card-content>
            <volt-card-footer>
              <a routerLink="/mission/{{ mission.id }}">
                <volt-button>
                  <span class="flex items-center gap-2">
                    Start mission
                    <lmn-arrow-right [size]="14" />
                  </span>
                </volt-button>
              </a>
            </volt-card-footer>
          </volt-card>
        }
      </div>
    </section>
  `,
})
export default class Missions {
  private readonly catalog = inject(MissionCatalogService);

  readonly selectedTrack = signal<string | null>(null);
  readonly tracks = signal(this.catalog.getTracks());

  readonly filteredMissions = computed(() => {
    const missions = this.catalog.getAll();
    const track = this.selectedTrack();
    const filtered = track
      ? missions.filter((mission) => mission.track === track)
      : missions;
    return [...filtered].sort(
      (a, b) =>
        a.track.localeCompare(b.track) ||
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
    );
  });

  selectTrack(track: string | null): void {
    this.selectedTrack.set(track);
  }

  pillClasses(active: boolean): string {
    return active
      ? 'bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900'
      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800';
  }

  difficultyClasses(difficulty: string): string {
    return DIFFICULTY_STYLES[difficulty] ?? '';
  }
}
