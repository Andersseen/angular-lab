import { Component, inject } from '@angular/core';
import { HomeFeatures } from '../components/home/home-features';
import { HomeHero } from '../components/home/home-hero';
import { HomeStats } from '../components/home/home-stats';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

const FEATURES = [
  {
    title: 'Missions',
    description: 'Step-by-step learning paths that combine theory and practice.',
    detail: 'Progress through tracks like Fundamentals, Routing, and Testing.',
    icon: 'rocket' as const,
    tone: 'blue' as const,
  },
  {
    title: 'Live Editor',
    description: 'Edit TypeScript and HTML directly in the browser.',
    detail: 'Mock previews show the expected result while the engine is built.',
    icon: 'editor' as const,
    tone: 'violet' as const,
  },
  {
    title: 'Comparisons',
    description: 'See two approaches side by side and learn when to use each.',
    detail: 'No single "right way" — understand the trade-offs.',
    icon: 'compare' as const,
    tone: 'amber' as const,
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeHero, HomeStats, HomeFeatures],
  template: `
    <section
      class="app-gradient mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-10 sm:py-16"
    >
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <app-home-hero />
        <app-home-stats [missionCount]="missionCount()" />
      </div>

      <app-home-features [features]="features" />
    </section>
  `,
})
export default class Home {
  private readonly catalog = inject(MissionCatalogService);

  readonly missionCount = () => this.catalog.getAll().length;
  readonly features = FEATURES;
}
