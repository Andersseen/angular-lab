import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink, LmnRocketLaunchIcon],
  template: `
    <a
      routerLink="/"
      class="flex items-center gap-2 text-xl font-bold tracking-tight text-al-ink"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-al-brand-ink shadow-md"
      >
        <lmn-rocket-launch [size]="20" />
      </span>
      Angular Lab
    </a>
  `,
})
export class AppLogo {}
