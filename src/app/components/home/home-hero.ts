import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSparklesIcon } from 'lumen-icons/sparkles';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink, VoltButton, ...MOVEMENT_DIRECTIVES, LmnSparklesIcon, LmnArrowRightIcon, LmnRocketLaunchIcon],
  template: `
    <header
      [move]="{ opacity: [0, 1], y: [28, 0], scale: [0.98, 1] }"
      class="max-w-3xl"
    >
      <div
        class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
      >
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
  `,
})
export class HomeHero {}
