import { Component, computed, inject, signal } from '@angular/core';
import { ToastService } from 'quartz-headless';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnXMarkIcon } from 'lumen-icons/x-mark';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-email-verification-banner',
  standalone: true,
  imports: [LmnEnvelopeIcon, LmnXMarkIcon],
  template: `
    @if (show()) {
      <div
        role="status"
        class="border-b border-warning/40 bg-warning/10 px-6 py-2.5 text-sm text-warning"
      >
        <div class="mx-auto flex max-w-7xl items-center gap-3">
          <lmn-envelope [size]="16" class="shrink-0" />
          <p class="flex-1">
            Please verify your email to secure your account.
          </p>
          <button
            type="button"
            class="font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-60"
            [disabled]="sending()"
            (click)="resend()"
          >
            {{ sending() ? 'Sending…' : 'Resend email' }}
          </button>
          <button
            type="button"
            class="rounded p-1 hover:bg-warning/10"
            aria-label="Dismiss"
            (click)="dismiss()"
          >
            <lmn-x-mark [size]="16" />
          </button>
        </div>
      </div>
    }
  `,
})
export class EmailVerificationBanner {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly dismissed = signal(false);
  readonly sending = signal(false);

  readonly show = computed(
    () =>
      !this.dismissed() &&
      this.auth.isAuthenticated() &&
      this.auth.user()?.emailVerified === false
  );

  resend(): void {
    this.sending.set(true);
    this.auth.resendVerification().subscribe({
      next: (response) => {
        this.sending.set(false);
        if (response.alreadyVerified) {
          this.toast.success('Your email is already verified.', 'All set');
        } else {
          this.toast.info('Verification email sent.', 'Check your inbox');
        }
      },
      error: () => {
        this.sending.set(false);
        this.toast.error('Could not send the email. Please try again.', 'Oops');
      },
    });
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
