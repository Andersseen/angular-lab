import { Component, inject } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { HomeFeatures } from '../components/home/home-features';
import { HomeHero } from '../components/home/home-hero';
import { HomeStats } from '../components/home/home-stats';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

export const routeMeta: RouteMeta = {
  title: 'Angular Lab — Learn Modern Angular by Doing',
  meta: [
    {
      name: 'description',
      content:
        'Interactive Angular Lab: guided missions, live in-browser code editing, and instant previews. Learn signals, reactivity, and routing by doing.',
    },
    { property: 'og:title', content: 'Angular Lab' },
    {
      property: 'og:description',
      content:
        'Interactive missions and a live code playground for learning modern Angular.',
    },
    { property: 'og:type', content: 'website' },
  ],
};

const FEATURES = [
  {
    titleKey: 'home.features.missions.title',
    descriptionKey: 'home.features.missions.description',
    detailKey: 'home.features.missions.detail',
    icon: 'rocket' as const,
  },
  {
    titleKey: 'home.features.liveEditor.title',
    descriptionKey: 'home.features.liveEditor.description',
    detailKey: 'home.features.liveEditor.detail',
    icon: 'editor' as const,
  },
  {
    titleKey: 'home.features.comparisons.title',
    descriptionKey: 'home.features.comparisons.description',
    detailKey: 'home.features.comparisons.detail',
    icon: 'compare' as const,
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
