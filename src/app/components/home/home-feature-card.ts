import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { LmnArrowsRightLeftIcon } from 'lumen-icons/arrows-right-left';
import { LmnCodeBracketSquareIcon } from 'lumen-icons/code-bracket-square';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';

export interface Feature {
  title: string;
  description: string;
  detail: string;
  icon: 'rocket' | 'editor' | 'compare';
  tone: 'blue' | 'violet' | 'amber';
}

const TONE_STYLES: Record<Feature['tone'], string> = {
  blue: 'from-blue-500 to-sky-400 shadow-blue-500/25',
  violet: 'from-violet-500 to-fuchsia-500 shadow-violet-500/25',
  amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
};

@Component({
  selector: 'app-home-feature-card',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardFooter,
    VoltCardHeader,
    VoltCardTitle,
    ...MOVEMENT_DIRECTIVES,
    LmnRocketLaunchIcon,
    LmnCodeBracketSquareIcon,
    LmnArrowsRightLeftIcon,
  ],
  template: `
    <volt-card
      [move]="'fade-up'"
      [moveDelay]="delay()"
      [moveWhileHover]="{ y: [0, -6], scale: [1, 1.02] }"
      [moveDuration]="200"
      class="group overflow-hidden border-zinc-200 transition-shadow hover:shadow-xl dark:border-zinc-800"
    >
      <div
        class="h-1.5 w-full bg-gradient-to-r {{ toneGradient() }}"
      ></div>
      <volt-card-header>
        <div
          class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br {{ toneGradient() }} text-white shadow-lg"
        >
          @switch (feature().icon) {
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
        <volt-card-title>{{ feature().title }}</volt-card-title>
        <volt-card-description>
          {{ feature().description }}
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        {{ feature().detail }}
      </volt-card-content>
      <volt-card-footer>
        <span
          class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          Included in demo
        </span>
      </volt-card-footer>
    </volt-card>
  `,
})
export class HomeFeatureCard {
  readonly feature = input.required<Feature>();
  readonly delay = input<number>(0);

  toneGradient(): string {
    return TONE_STYLES[this.feature().tone];
  }
}
