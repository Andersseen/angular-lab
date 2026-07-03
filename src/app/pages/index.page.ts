import { Component, inject } from '@angular/core';
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
  VoltProgress,
} from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

interface Feature {
  title: string;
  description: string;
  detail: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Missions',
    description: 'Step-by-step learning paths that combine theory and practice.',
    detail: 'Progress through tracks like Fundamentals, Routing, and Testing.',
    accent: 'bg-blue-500',
  },
  {
    title: 'Live Editor',
    description: 'Edit TypeScript and HTML directly in the browser.',
    detail: 'Mock previews show the expected result while the engine is built.',
    accent: 'bg-emerald-500',
  },
  {
    title: 'Comparisons',
    description: 'See two approaches side by side and learn when to use each.',
    detail: 'No single "right way" — understand the trade-offs.',
    accent: 'bg-amber-500',
  },
];

@Component({
  selector: 'app-home',
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
    VoltProgress,
    ...MOVEMENT_DIRECTIVES,
  ],
  template: `
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:py-14">
      <div class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <header
          [move]="{ opacity: [0, 1], y: [28, 0], scale: [0.98, 1] }"
          class="max-w-3xl"
        >
          <volt-badge variant="secondary">Angular 22 demo lab</volt-badge>
          <h1 class="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Learn Angular by doing
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Guided missions, editable examples, and instant browser previews. No
            setup, no backend, just code.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/missions">
              <volt-button size="lg">Browse Missions</volt-button>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener">
              <volt-button variant="outline" size="lg">Contribute</volt-button>
            </a>
          </div>
        </header>

        <aside
          [move]="'blur-in'"
          [moveDuration]="420"
          class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Demo platform snapshot"
        >
          <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                Available missions
              </p>
              <h2 class="text-2xl font-bold">{{ missionCount() }}</h2>
            </div>
            <volt-badge>Live demo</volt-badge>
          </div>

          <div class="py-5">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium">Platform readiness</span>
              <span class="text-slate-500 dark:text-slate-400">75%</span>
            </div>
            <volt-progress [value]="75" />
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            @for (stat of stats; track stat.label) {
              <div class="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
                <p class="text-xl font-bold">{{ stat.value }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ stat.label }}
                </p>
              </div>
            }
          </div>
        </aside>
      </div>

      <div
        [moveStagger]="80"
        class="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        @for (feature of features; track feature.title; let i = $index) {
          <volt-card
            [move]="'fade-up'"
            [moveDelay]="i * 100"
            [moveWhileHover]="{ y: [0, -6], scale: [1, 1.02] }"
            [moveDuration]="200"
            class="transition-shadow hover:shadow-lg"
          >
            <volt-card-header>
              <span class="mb-1 block h-1.5 w-10 rounded-full {{ feature.accent }}"></span>
              <volt-card-title>{{ feature.title }}</volt-card-title>
              <volt-card-description>
                {{ feature.description }}
              </volt-card-description>
            </volt-card-header>
            <volt-card-content>
              {{ feature.detail }}
            </volt-card-content>
            <volt-card-footer>
              <span class="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                Included in demo
              </span>
            </volt-card-footer>
          </volt-card>
        }
      </div>
    </section>
  `,
})
export default class Home {
  private readonly catalog = inject(MissionCatalogService);

  readonly missionCount = () => this.catalog.getAll().length;
  readonly features = FEATURES;
  readonly stats = [
    { value: this.missionCount().toString(), label: 'guided missions' },
    { value: '<1 min', label: 'to first edit' },
    { value: '100%', label: 'browser based' },
  ];
}
