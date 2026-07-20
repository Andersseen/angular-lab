import { Component, inject } from '@angular/core';
import { VoltButton, VoltTooltip, VoltTooltipContent } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnMoonIcon } from 'lumen-icons/moon';
import { LmnSunIcon } from 'lumen-icons/sun';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [VoltButton, TranslatePipe, LmnMoonIcon, LmnSunIcon, VoltTooltip, VoltTooltipContent],
  template: `
    <volt-button
      variant="ghost"
      size="sm"
      class="ml-1"
      [attr.aria-label]="
        (theme.mode() === 'light' ? 'theme.ariaSwitchToDark' : 'theme.ariaSwitchToLight')
          | translate
      "
      [voltTooltip]="tooltipTpl"
      placement="bottom"
      (click)="theme.toggle()"
    >
      @if (theme.mode() === 'light') {
        <lmn-moon [size]="20" [ariaLabel]="'theme.ariaSwitchToDark' | translate" />
      } @else {
        <lmn-sun [size]="20" [ariaLabel]="'theme.ariaSwitchToLight' | translate" />
      }
    </volt-button>

    <ng-template #tooltipTpl>
      <volt-tooltip-content>
        {{
          (theme.mode() === 'light' ? 'theme.tooltipSwitchToDark' : 'theme.tooltipSwitchToLight')
            | translate
        }}
      </volt-tooltip-content>
    </ng-template>
  `,
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
