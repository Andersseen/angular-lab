import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnSparklesIcon } from 'lumen-icons/sparkles';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    ...MOVEMENT_DIRECTIVES,
    TranslatePipe,
    LmnSparklesIcon,
    LmnArrowRightIcon,
    LmnRocketLaunchIcon,
  ],
  template: `
    <header
      [move]="{ opacity: [0, 1], y: [28, 0], scale: [0.98, 1] }"
      class="max-w-3xl"
    >
      <div
        class="app-glass inline-flex items-center gap-2 rounded-full border border-al-line px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-al-ink-muted shadow-sm"
      >
        <lmn-sparkles [size]="12" />
        {{ 'home.badge' | translate }}
      </div>

      <h1
        class="mt-6 text-5xl font-extrabold tracking-tight text-al-ink sm:text-6xl lg:text-7xl"
      >
        {{ 'home.heading' | translate }}
        <span class="text-gradient-brand block">{{
          'home.headingSuffix' | translate
        }}</span>
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-al-ink-muted">
        {{ 'home.subtitle' | translate }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a routerLink="/missions">
          <volt-button size="lg">
            <span class="flex items-center gap-2">
              {{ 'home.browseMissions' | translate }}
              <lmn-arrow-right [size]="16" />
            </span>
          </volt-button>
        </a>
        <a href="https://github.com" target="_blank" rel="noopener">
          <volt-button variant="outline" size="lg">{{
            'home.contribute' | translate
          }}</volt-button>
        </a>
      </div>
    </header>
  `,
})
export class HomeHero {}
