import { Component, inject } from '@angular/core';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnMoonIcon } from 'lumen-icons/moon';
import { LmnSunIcon } from 'lumen-icons/sun';
import { TooltipDirective } from 'quartz-headless';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [VoltButton, TranslatePipe, LmnMoonIcon, LmnSunIcon, TooltipDirective],
  template: `
    <volt-button
      variant="ghost"
      size="sm"
      class="ml-1"
      [attr.aria-label]="
        (theme.mode() === 'light' ? 'theme.ariaSwitchToDark' : 'theme.ariaSwitchToLight')
          | translate
      "
      [qzTooltip]="
        (theme.mode() === 'light' ? 'theme.tooltipSwitchToDark' : 'theme.tooltipSwitchToLight')
          | translate
      "
      tooltipPlacement="bottom"
      (click)="theme.toggle()"
    >
      @if (theme.mode() === 'light') {
        <lmn-moon [size]="20" [ariaLabel]="'theme.ariaSwitchToDark' | translate" />
      } @else {
        <lmn-sun [size]="20" [ariaLabel]="'theme.ariaSwitchToLight' | translate" />
      }
    </volt-button>
  `,
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
