import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { MoveEnterDirective, MoveHoverDirective } from 'angular-movement';

interface Feature {
  title: string;
  description: string;
  detail: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Missions',
    description: 'Step-by-step learning paths that combine theory and practice.',
    detail: 'Progress through tracks like Reactivity, Routing, and Testing.',
  },
  {
    title: 'Live Editor',
    description: 'Edit TypeScript and HTML directly in the browser.',
    detail: 'Changes compile and render instantly inside a sandboxed preview.',
  },
  {
    title: 'Comparisons',
    description: 'See two approaches side by side and learn when to use each.',
    detail: 'No single "right way" — understand the trade-offs.',
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    MoveEnterDirective,
    MoveHoverDirective,
  ],
  template: `
    <section class="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-16">
      <header moveEnter="fade-up" class="max-w-3xl text-center">
        <h1 class="text-5xl font-extrabold tracking-tight">
          Learn Angular by doing
        </h1>
        <p class="mt-6 text-xl text-slate-600 dark:text-slate-300">
          Guided missions, editable examples, and instant browser previews. No
          setup, no backend, just code.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a routerLink="/mission">
            <volt-button size="lg">Start Demo Mission</volt-button>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener">
            <volt-button variant="outline" size="lg">Contribute</volt-button>
          </a>
        </div>
      </header>

      <div class="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (feature of features; track feature.title; let i = $index) {
          <volt-card
            moveEnter="fade-up"
            [moveDelay]="i * 100"
            [moveWhileHover]="{ scale: [1, 1.03] }"
            [moveDuration]="200"
            class="transition-shadow hover:shadow-lg"
          >
            <volt-card-header>
              <volt-card-title>{{ feature.title }}</volt-card-title>
              <volt-card-description>
                {{ feature.description }}
              </volt-card-description>
            </volt-card-header>
            <volt-card-content>
              {{ feature.detail }}
            </volt-card-content>
          </volt-card>
        }
      </div>
    </section>
  `,
})
export default class Home {
  readonly features = FEATURES;
}
