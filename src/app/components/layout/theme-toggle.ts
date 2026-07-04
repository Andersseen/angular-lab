import { Component, inject } from '@angular/core';
import { VoltButton } from '@voltui/components';
import { LmnMoonIcon } from 'lumen-icons/moon';
import { LmnSunIcon } from 'lumen-icons/sun';
import { TooltipDirective } from 'quartz-headless';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [VoltButton, LmnMoonIcon, LmnSunIcon, TooltipDirective],
  template: `
    <volt-button
      variant="ghost"
      size="sm"
      class="ml-1"
      [attr.aria-label]="
        'Switch to ' + (theme.mode() === 'light' ? 'dark' : 'light') + ' theme'
      "
      [qzTooltip]="
        'Switch to ' + (theme.mode() === 'light' ? 'dark' : 'light') + ' mode'
      "
      tooltipPlacement="bottom"
      (click)="theme.toggle()"
    >
      @if (theme.mode() === 'light') {
        <lmn-moon [size]="20" ariaLabel="Switch to dark theme" />
      } @else {
        <lmn-sun [size]="20" ariaLabel="Switch to light theme" />
      }
    </volt-button>
  `,
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
