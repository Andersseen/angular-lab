import { Component, computed, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { DifficultyFilter } from '../components/mission/difficulty-filter';
import { MissionCard } from '../components/mission/mission-card';
import { MissionsHeader } from '../components/mission/missions-header';
import { TrackFilter } from '../components/mission/track-filter';
import type { Difficulty } from '../core/models/mission.model';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

export const routeMeta: RouteMeta = {
  title: 'Missions — Angular Lab',
  meta: [
    {
      name: 'description',
      content:
        'Browse guided Angular missions across Fundamentals, Reactivity with Signals, and Routing & Data — filter by track and difficulty.',
    },
    { property: 'og:title', content: 'Missions — Angular Lab' },
    {
      property: 'og:description',
      content: 'Browse guided Angular missions across three tracks.',
    },
    { property: 'og:type', content: 'website' },
  ],
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [
    MOVEMENT_DIRECTIVES,
    MissionsHeader,
    TrackFilter,
    DifficultyFilter,
    MissionCard,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:py-14"
      moveEnter="fade-up"
    >
      <app-missions-header />

      <div class="flex flex-col gap-4">
        <app-track-filter
          [tracks]="tracks()"
          [selectedTrack]="selectedTrack()"
          (selectTrack)="selectTrack($event)"
        />

        <app-difficulty-filter
          [difficulties]="difficulties()"
          [selectedDifficulty]="selectedDifficulty()"
          (selectDifficulty)="selectDifficulty($event)"
        />
      </div>

      @if (filteredMissions().length > 0) {
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          @for (
            mission of filteredMissions();
            track mission.id;
            let i = $index
          ) {
            <app-mission-card [mission]="mission" [delay]="i * 80" />
          }
        </div>
      } @else {
        <p
          class="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          No missions match this filter yet.
        </p>
      }
    </section>
  `,
})
export default class Missions {
  private readonly catalog = inject(MissionCatalogService);

  readonly selectedTrack = signal<string | null>(null);
  readonly selectedDifficulty = signal<Difficulty | null>(null);
  readonly tracks = signal(this.catalog.getTracks());

  readonly difficulties = computed<readonly Difficulty[]>(() => {
    const present = new Set(
      this.catalog.getAll().map((mission) => mission.difficulty)
    );
    return (['beginner', 'intermediate', 'advanced'] as const).filter(
      (difficulty) => present.has(difficulty)
    );
  });

  readonly filteredMissions = computed(() => {
    const track = this.selectedTrack();
    const difficulty = this.selectedDifficulty();
    const filtered = this.catalog.getAll().filter((mission) => {
      const matchesTrack = !track || mission.track === track;
      const matchesDifficulty = !difficulty || mission.difficulty === difficulty;
      return matchesTrack && matchesDifficulty;
    });
    return [...filtered].sort(
      (a, b) =>
        a.track.localeCompare(b.track) ||
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
    );
  });

  selectTrack(track: string | null): void {
    this.selectedTrack.set(track);
  }

  selectDifficulty(difficulty: Difficulty | null): void {
    this.selectedDifficulty.set(difficulty);
  }
}
