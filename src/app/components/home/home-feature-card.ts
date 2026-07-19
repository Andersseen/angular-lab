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
import { GradientIcon } from '../ui/gradient-icon';

export interface Feature {
  title: string;
  description: string;
  detail: string;
  icon: 'rocket' | 'editor' | 'compare';
}

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
    GradientIcon,
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
      class="group overflow-hidden border-line transition-shadow hover:shadow-xl"
    >
      <div class="bg-gradient-brand h-1.5 w-full"></div>
      <volt-card-header>
        <div class="mb-3">
          <app-gradient-icon size="sm">
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
          </app-gradient-icon>
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
          class="font-mono text-xs font-medium uppercase tracking-wide text-ink-muted"
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
}
