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
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowsRightLeftIcon } from 'lumen-icons/arrows-right-left';
import { LmnCodeBracketSquareIcon } from 'lumen-icons/code-bracket-square';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { GradientIcon } from '../ui/gradient-icon';

export interface Feature {
  titleKey: string;
  descriptionKey: string;
  detailKey: string;
  icon: 'rocket' | 'editor' | 'compare';
}

@Component({
  selector: 'app-home-feature-card',
  standalone: true,
  // The grid stretches its items, but a custom element is inline by default,
  // so the card needs a block host with full height for footers to line up.
  host: { class: 'block h-full' },
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardFooter,
    VoltCardHeader,
    VoltCardTitle,
    ...MOVEMENT_DIRECTIVES,
    TranslatePipe,
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
      class="group flex h-full flex-col overflow-hidden border-al-line transition-shadow hover:shadow-xl"
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
        <volt-card-title>{{ feature().titleKey | translate }}</volt-card-title>
        <volt-card-description>
          {{ feature().descriptionKey | translate }}
        </volt-card-description>
      </volt-card-header>
      <volt-card-content class="flex-1">
        {{ feature().detailKey | translate }}
      </volt-card-content>
      <volt-card-footer>
        <span
          class="font-mono text-xs font-medium uppercase tracking-wide text-al-ink-muted"
        >
          {{ 'home.features.includedInDemo' | translate }}
        </span>
      </volt-card-footer>
    </volt-card>
  `,
})
export class HomeFeatureCard {
  readonly feature = input.required<Feature>();
  readonly delay = input<number>(0);
}
