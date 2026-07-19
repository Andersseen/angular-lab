import { Component, model } from '@angular/core';
import { LmnEyeIcon } from 'lumen-icons/eye';
import { LmnEyeSlashIcon } from 'lumen-icons/eye-slash';

/**
 * Show/hide switch for a password input. Positions itself against the
 * `relative` wrapper inside `FormField`, so project it as `data-slot="trailing"`
 * and bind the input's `type` to the same signal.
 */
@Component({
  selector: 'app-password-toggle',
  standalone: true,
  imports: [LmnEyeIcon, LmnEyeSlashIcon],
  template: `
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-al-ink-muted transition-colors hover:text-al-ink"
      [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
      [attr.aria-pressed]="visible()"
      (click)="visible.set(!visible())"
    >
      @if (visible()) {
        <lmn-eye-slash [size]="16" />
      } @else {
        <lmn-eye [size]="16" />
      }
    </button>
  `,
})
export class PasswordToggle {
  readonly visible = model(false);
}
