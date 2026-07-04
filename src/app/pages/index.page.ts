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
import { NgTemplateOutlet } from '@angular/common';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnArrowsRightLeftIcon } from 'lumen-icons/arrows-right-left';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnCodeBracketSquareIcon } from 'lumen-icons/code-bracket-square';
import { LmnGlobeAltIcon } from 'lumen-icons/globe-alt';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSparklesIcon } from 'lumen-icons/sparkles';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

interface Feature {
  title: string;
  description: string;
  detail: string;
  icon: string;
  tone: 'blue' | 'violet' | 'amber';
}

const FEATURES: Feature[] = [
  {
    title: 'Missions',
    description: 'Step-by-step learning paths that combine theory and practice.',
    detail: 'Progress through tracks like Fundamentals, Routing, and Testing.',
    icon: 'rocket',
    tone: 'blue',
  },
  {
    title: 'Live Editor',
    description: 'Edit TypeScript and HTML directly in the browser.',
    detail: 'Mock previews show the expected result while the engine is built.',
    icon: 'editor',
    tone: 'violet',
  },
  {
    title: 'Comparisons',
    description: 'See two approaches side by side and learn when to use each.',
    detail: 'No single "right way" — understand the trade-offs.',
    icon: 'compare',
    tone: 'amber',
  },
];

const TONE_STYLES: Record<Feature['tone'], string> = {
  blue: 'from-blue-500 to-sky-400 shadow-blue-500/25',
  violet: 'from-violet-500 to-fuchsia-500 shadow-violet-500/25',
  amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
};

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
    NgTemplateOutlet,
    ...MOVEMENT_DIRECTIVES,
    LmnRocketLaunchIcon,
    LmnCodeBracketSquareIcon,
    LmnArrowsRightLeftIcon,
    LmnListBulletIcon,
    LmnClockIcon,
    LmnGlobeAltIcon,
    LmnSparklesIcon,
    LmnArrowRightIcon,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-10 sm:py-16"
    >
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <header
          [move]="{ opacity: [0, 1], y: [28, 0], scale: [0.98, 1] }"
          class="max-w-3xl"
        >
          <div class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            <lmn-sparkles [size]="12" />
            Angular 22 demo lab
          </div>

          <h1
            class="mt-6 text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Learn Angular
            <span
              class="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
            >
              by doing
            </span>
          </h1>
          <p
            class="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300"
          >
            Guided missions, editable examples, and instant browser previews. No
            setup, no backend, just code.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/missions">
              <volt-button size="lg">
                <span class="flex items-center gap-2">
                  Browse Missions
                  <lmn-arrow-right [size]="16" />
                </span>
              </volt-button>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener">
              <volt-button variant="outline" size="lg">Contribute</volt-button>
            </a>
          </div>
        </header>

        <aside
          [move]="'blur-in'"
          [moveDuration]="420"
          class="app-glass rounded-2xl border border-zinc-200 p-6 shadow-xl dark:border-zinc-800"
          aria-label="Demo platform snapshot"
        >
          <div
            class="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800"
          >
            <div>
              <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Available missions
              </p>
              <h2 class="text-3xl font-bold">{{ missionCount() }}</h2>
            </div>
            <volt-badge>Live demo</volt-badge>
          </div>

          <div class="py-6">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium">Platform readiness</span>
              <span class="text-zinc-500 dark:text-zinc-400">75%</span>
            </div>
            <volt-progress [value]="75" />
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div
              class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <lmn-list-bullet [size]="14" />
                <span class="text-[10px] font-semibold uppercase tracking-wide">
                  guided missions
                </span>
              </div>
              <p class="text-xl font-bold">{{ missionCount() }}</p>
            </div>
            <div
              class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <lmn-clock [size]="14" />
                <span class="text-[10px] font-semibold uppercase tracking-wide">
                  to first edit
                </span>
              </div>
              <p class="text-xl font-bold">&lt;1 min</p>
            </div>
            <div
              class="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div class="mb-1 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <lmn-globe-alt [size]="14" />
                <span class="text-[10px] font-semibold uppercase tracking-wide">
                  browser based
                </span>
              </div>
              <p class="text-xl font-bold">100%</p>
            </div>
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
            class="group overflow-hidden border-zinc-200 transition-shadow hover:shadow-xl dark:border-zinc-800"
          >
            <div class="h-1.5 w-full bg-gradient-to-r {{ toneGradient(feature.tone) }}"></div>
            <volt-card-header>
              <div
                class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br {{ toneGradient(feature.tone) }} text-white shadow-lg"
              >
                @switch (feature.icon) {
                  @case ('rocket') {
                    <lmn-rocket-launch [size]="20" />
                  }
                  @case ('editor') {
                    <lmn-code-bracket-square [size]="20" />
                  }
                  @case ('compare') {
                    <lmn-arrows-right-left [size]="20" />
                  }
                }
              </div>
              <volt-card-title>{{ feature.title }}</volt-card-title>
              <volt-card-description>
                {{ feature.description }}
              </volt-card-description>
            </volt-card-header>
            <volt-card-content>
              {{ feature.detail }}
            </volt-card-content>
            <volt-card-footer>
              <span
                class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
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


  toneGradient(tone: Feature['tone']): string {
    return TONE_STYLES[tone];
  }
}
