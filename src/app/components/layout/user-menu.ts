import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoltButton, VoltTooltip, VoltTooltipContent } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowLeftStartOnRectangleIcon } from 'lumen-icons/arrow-left-start-on-rectangle';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnUserCircleIcon } from 'lumen-icons/user-circle';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    TranslatePipe,
    LmnUserCircleIcon,
    LmnArrowLeftStartOnRectangleIcon,
    LmnArrowRightEndOnRectangleIcon,
    VoltTooltip,
    VoltTooltipContent,
  ],
  template: `
    @if (isAuthenticated()) {
      <span
        class="ml-2 hidden items-center gap-1.5 rounded-full border border-al-line bg-al-surface-raised px-3 py-1 text-xs font-medium text-al-ink sm:inline-flex"
      >
        <lmn-user-circle [size]="14" />
        {{ userName() }}
      </span>

      <volt-button
        variant="ghost"
        size="sm"
        class="ml-1"
        [attr.aria-label]="'userMenu.logOut' | translate"
        [voltTooltip]="tooltipTpl"
        placement="bottom"
        (click)="logout.emit()"
      >
        <span class="flex items-center gap-2">
          <lmn-arrow-left-start-on-rectangle [size]="20" />
          <span class="sr-only sm:not-sr-only">{{ 'userMenu.logOut' | translate }}</span>
        </span>
      </volt-button>

      <ng-template #tooltipTpl>
        <volt-tooltip-content>{{ 'userMenu.logOut' | translate }}</volt-tooltip-content>
      </ng-template>
    } @else {
      <a routerLink="/login" [attr.aria-label]="'userMenu.logIn' | translate">
        <volt-button variant="outline" size="sm" [attr.aria-label]="'userMenu.logIn' | translate">
          <span class="flex items-center gap-2">
            <lmn-arrow-right-end-on-rectangle [size]="16" />
            <span class="sr-only sm:not-sr-only">{{ 'userMenu.logIn' | translate }}</span>
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
