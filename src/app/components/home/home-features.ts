import { Component, input } from '@angular/core';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { HomeFeatureCard, type Feature } from './home-feature-card';

@Component({
  selector: 'app-home-features',
  standalone: true,
  imports: [MOVEMENT_DIRECTIVES, HomeFeatureCard],
  template: `
    <div
      [moveStagger]="80"
      class="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      @for (feature of features(); track feature.titleKey; let i = $index) {
        <app-home-feature-card [feature]="feature" [delay]="i * 100" />
      }
    </div>
  `,
})
export class HomeFeatures {
  readonly features = input.required<readonly Feature[]>();
}
