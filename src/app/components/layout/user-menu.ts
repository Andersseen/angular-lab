import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnArrowLeftStartOnRectangleIcon } from 'lumen-icons/arrow-left-start-on-rectangle';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';
import { TooltipDirective } from 'quartz-headless';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    LmnUserCircleIcon,
    LmnArrowLeftStartOnRectangleIcon,
    LmnArrowRightEndOnRectangleIcon,
    TooltipDirective,
  ],
  template: `
    @if (isAuthenticated()) {
      <span
        class="ml-2 hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 sm:inline-flex"
      >
        <lmn-user-circle [size]="14" />
        {{ userName() }}
      </span>

      <volt-button
        variant="ghost"
        size="sm"
        class="ml-1"
        aria-label="Log out"
        [qzTooltip]="'Log out'"
        tooltipPlacement="bottom"
        (click)="logout.emit()"
      >
        <span class="flex items-center gap-2">
          <lmn-arrow-left-start-on-rectangle [size]="20" />
          <span class="hidden sm:inline">Log out</span>
        </span>
      </volt-button>
    } @else {
      <a routerLink="/login" aria-label="Log in">
        <volt-button variant="outline" size="sm" aria-label="Log in">
          <span class="flex items-center gap-2">
            <lmn-arrow-right-end-on-rectangle [size]="16" />
            <span class="hidden sm:inline">Log in</span>
          </span>
        </volt-button>
      </a>
    }
  `,
})
export class UserMenu {
  readonly isAuthenticated = input.required<boolean>();
  readonly userName = input<string | undefined>();

  readonly logout = output<void>();
}
