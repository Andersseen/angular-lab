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
import { MissionCatalogService } from '../core/services/mission-catalog.service';

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
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
  ],
  template: `
    <section
      class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10"
      moveEnter="fade-up"
    >
      <header class="max-w-2xl">
        <h1
          class="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white"
        >
          Missions
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Pick a mission and learn Angular by writing real code in the browser.
          No setup required.
        </p>
      </header>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          [class.bg-blue-600]="selectedTrack() === null"
          [class.text-white]="selectedTrack() === null"
          [class.bg-slate-100]="selectedTrack() !== null"
          [class.text-slate-700]="selectedTrack() !== null"
          [class.dark:bg-slate-800]="selectedTrack() !== null"
          [class.dark:text-slate-200]="selectedTrack() !== null"
          (click)="selectTrack(null)"
        >
          All tracks
        </button>
        @for (track of tracks(); track track) {
          <button
            type="button"
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            [class.bg-blue-600]="selectedTrack() === track"
            [class.text-white]="selectedTrack() === track"
            [class.bg-slate-100]="selectedTrack() !== track"
            [class.text-slate-700]="selectedTrack() !== track"
            [class.dark:bg-slate-800]="selectedTrack() !== track"
            [class.dark:text-slate-200]="selectedTrack() !== track"
            (click)="selectTrack(track)"
          >
            {{ track }}
          </button>
        }
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (mission of filteredMissions(); track mission.id; let i = $index) {
          <volt-card
            [move]="'fade-up'"
            [moveDelay]="i * 80"
            class="flex flex-col transition-shadow hover:shadow-lg"
          >
            <volt-card-header>
              <div class="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                <span>{{ mission.track }}</span>
                <span>·</span>
                <span>{{ mission.durationMinutes }} min</span>
              </div>
              <volt-card-title>{{ mission.title }}</volt-card-title>
              <volt-card-description>
                {{ mission.description }}
              </volt-card-description>
            </volt-card-header>
            <volt-card-content class="flex-1">
              <div class="flex flex-wrap gap-2">
                <volt-badge variant="secondary">{{ mission.difficulty }}</volt-badge>
                @for (tag of mission.tags; track tag) {
                  <volt-badge variant="outline">{{ tag }}</volt-badge>
                }
              </div>
            </volt-card-content>
            <volt-card-footer>
              <a routerLink="/mission/{{ mission.id }}">
                <volt-button>Start mission</volt-button>
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
}
