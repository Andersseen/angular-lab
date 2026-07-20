import { Component, computed, inject, signal } from '@angular/core';
import { ToastService } from 'quartz-headless';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnXMarkIcon } from 'lumen-icons/x-mark';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-email-verification-banner',
  standalone: true,
  imports: [TranslatePipe, LmnEnvelopeIcon, LmnXMarkIcon],
  template: `
    @if (show()) {
      <div
        role="status"
        class="border-b border-al-warning/40 bg-al-warning/10 px-6 py-2.5 text-sm text-al-warning"
      >
        <div class="mx-auto flex max-w-7xl items-center gap-3">
          <lmn-envelope [size]="16" class="shrink-0" />
          <p class="flex-1">
            {{ 'emailBanner.message' | translate }}
          </p>
          <button
            type="button"
            class="font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-60"
            [disabled]="sending()"
            (click)="resend()"
          >
            {{ (sending() ? 'emailBanner.sending' : 'emailBanner.resend') | translate }}
          </button>
          <button
            type="button"
            class="rounded p-1 hover:bg-al-warning/10"
            [attr.aria-label]="'emailBanner.dismiss' | translate"
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
  private readonly translate = inject(TranslateService);

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
          this.toast.success(
            this.translate.instant('emailBanner.alreadyVerifiedToastMessage'),
            this.translate.instant('emailBanner.alreadyVerifiedToastTitle')
          );
        } else {
          this.toast.info(
            this.translate.instant('emailBanner.sentToastMessage'),
            this.translate.instant('emailBanner.sentToastTitle')
          );
        }
      },
      error: () => {
        this.sending.set(false);
        this.toast.error(
          this.translate.instant('emailBanner.errorToastMessage'),
          this.translate.instant('emailBanner.errorToastTitle')
        );
      },
    });
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
