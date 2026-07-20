import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnHomeIcon } from 'lumen-icons/home';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnSquares2x2Icon } from 'lumen-icons/squares-2x2';

/**
 * The active route is marked three ways so it never depends on colour alone:
 * `aria-current="page"`, a brand tint on the anchor, and brand ink on the
 * label. Volt's ghost button is transparent, so the anchor's own tint shows
 * through without touching Volt's internals (see context.md Decision 14).
 */
@Component({
  selector: 'app-nav-links',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoltButton,
    TranslatePipe,
    LmnHomeIcon,
    LmnListBulletIcon,
    LmnSquares2x2Icon,
  ],
  template: `
    <a
      routerLink="/"
      routerLinkActive
      #homeLink="routerLinkActive"
      [routerLinkActiveOptions]="{ exact: true }"
      [attr.aria-current]="homeLink.isActive ? 'page' : null"
      [class]="anchorClass(homeLink.isActive)"
      [attr.aria-label]="'nav.home' | translate"
    >
      <volt-button variant="ghost" size="sm" [attr.aria-label]="'nav.home' | translate">
        <span class="flex items-center gap-2" [class]="labelClass(homeLink.isActive)">
          <lmn-home [size]="16" />
          <span class="sr-only sm:not-sr-only">{{ 'nav.home' | translate }}</span>
        </span>
      </volt-button>
    </a>
    <a
      routerLink="/missions"
      routerLinkActive
      #missionsLink="routerLinkActive"
      [attr.aria-current]="missionsLink.isActive ? 'page' : null"
      [class]="anchorClass(missionsLink.isActive)"
      [attr.aria-label]="'nav.missions' | translate"
    >
      <volt-button variant="ghost" size="sm" [attr.aria-label]="'nav.missions' | translate">
        <span
          class="flex items-center gap-2"
          [class]="labelClass(missionsLink.isActive)"
        >
          <lmn-list-bullet [size]="16" />
          <span class="sr-only sm:not-sr-only">{{ 'nav.missions' | translate }}</span>
        </span>
      </volt-button>
    </a>

    @if (isAuthenticated()) {
      <a
        routerLink="/dashboard"
        routerLinkActive
        #dashboardLink="routerLinkActive"
        [attr.aria-current]="dashboardLink.isActive ? 'page' : null"
        [class]="anchorClass(dashboardLink.isActive)"
        [attr.aria-label]="'nav.dashboard' | translate"
      >
        <volt-button variant="ghost" size="sm" [attr.aria-label]="'nav.dashboard' | translate">
          <span
            class="flex items-center gap-2"
            [class]="labelClass(dashboardLink.isActive)"
          >
            <lmn-squares-2x2 [size]="16" />
            <span class="sr-only sm:not-sr-only">{{ 'nav.dashboard' | translate }}</span>
          </span>
        </volt-button>
      </a>
    }
  `,
})
export class NavLinks {
  readonly isAuthenticated = input.required<boolean>();

  // [class.x] cannot express token classes containing `/`; return the full string.
  anchorClass(active: boolean): string {
    return active ? 'rounded-lg bg-al-brand/10' : 'rounded-lg';
  }

  labelClass(active: boolean): string {
    return active ? 'font-semibold text-al-brand' : '';
  }
}
