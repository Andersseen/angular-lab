import { Component, computed, inject, signal } from '@angular/core';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { MissionCard } from '../components/mission/mission-card';
import { MissionsHeader } from '../components/mission/missions-header';
import { TrackFilter } from '../components/mission/track-filter';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [MOVEMENT_DIRECTIVES, MissionsHeader, TrackFilter, MissionCard],
  template: `
    <section
      class="app-gradient mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:py-14"
      moveEnter="fade-up"
    >
      <app-missions-header />

      <app-track-filter
        [tracks]="tracks()"
        [selectedTrack]="selectedTrack()"
        (selectTrack)="selectTrack($event)"
      />

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (mission of filteredMissions(); track mission.id; let i = $index) {
          <app-mission-card [mission]="mission" [delay]="i * 80" />
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
