import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { GradientIcon } from './gradient-icon';

/**
 * Centered auth shell: blueprint background, gradient icon header, and a Volt
 * card. Project the header icon with `data-slot="icon"`, an optional rich card
 * description with `data-slot="card-description"`, and the form as default
 * content.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    GradientIcon,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
  ],
  template: `
    <section
      class="app-blueprint mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-6 py-12"
    >
      <div class="mb-8 text-center">
        <div class="mb-4 flex justify-center">
          <app-gradient-icon size="md">
            <ng-content select="[data-slot=icon]" />
          </app-gradient-icon>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-ink">
          {{ heading() }}
        </h1>
        @if (subtitle()) {
          <p class="mt-2 text-sm text-ink-muted">{{ subtitle() }}</p>
        }
      </div>

      <volt-card class="border-line shadow-xl">
        <volt-card-header>
          <volt-card-title>{{ cardTitle() }}</volt-card-title>
          <volt-card-description>
            <ng-content select="[data-slot=card-description]" />
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          <ng-content />
        </volt-card-content>
      </volt-card>
    </section>
  `,
})
export class AuthLayout {
  readonly heading = input.required<string>();
  readonly subtitle = input<string>();
  readonly cardTitle = input.required<string>();
}
