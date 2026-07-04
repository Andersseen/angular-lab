import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnHomeIcon } from 'lumen-icons/home';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';

@Component({
  selector: 'app-nav-links',
  standalone: true,
  imports: [RouterLink, VoltButton, LmnHomeIcon, LmnListBulletIcon, LmnSquares2x2Icon],
  template: `
    <a routerLink="/">
      <volt-button variant="ghost" size="sm">
        <span class="flex items-center gap-2">
          <lmn-home [size]="16" />
          <span class="hidden sm:inline">Home</span>
        </span>
      </volt-button>
    </a>
    <a routerLink="/missions">
      <volt-button variant="ghost" size="sm">
        <span class="flex items-center gap-2">
          <lmn-list-bullet [size]="16" />
          <span class="hidden sm:inline">Missions</span>
        </span>
      </volt-button>
    </a>

    @if (isAuthenticated()) {
      <a routerLink="/dashboard">
        <volt-button variant="ghost" size="sm">
          <span class="flex items-center gap-2">
            <lmn-squares-2x2 [size]="16" />
            <span class="hidden sm:inline">Dashboard</span>
          </span>
        </volt-button>
      </a>
    }
  `,
})
export class NavLinks {
  readonly isAuthenticated = input.required<boolean>();
}
