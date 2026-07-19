import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnArrowPathIcon } from 'lumen-icons/arrow-path';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';
import { AuthService } from '../core/services/auth.service';
import { AuthLayout } from '../components/ui/auth-layout';

export const routeMeta: RouteMeta = {
  title: 'Verify email — Angular Lab',
};

type VerifyState = 'pending' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    AuthLayout,
    LmnArrowPathIcon,
    LmnCheckCircleIcon,
    LmnEnvelopeIcon,
    LmnXCircleIcon,
  ],
  template: `
    <app-auth-layout heading="Verify your email" cardTitle="Email verification">
      <lmn-envelope data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        @switch (state()) {
          @case ('pending') {
            Confirming your email…
          }
          @case ('success') {
            You're all set.
          }
          @case ('error') {
            We couldn't confirm this link.
          }
        }
      </span>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        @switch (state()) {
          @case ('pending') {
            <lmn-arrow-path [size]="32" class="animate-spin text-ink-muted" />
            <p class="text-sm text-ink-muted">
              Verifying your email address.
            </p>
          }
          @case ('success') {
            <lmn-check-circle [size]="32" class="text-success" />
            <p class="text-sm text-ink-muted">Your email is verified. Thanks!</p>
            <a routerLink="/dashboard">
              <volt-button>Go to dashboard</volt-button>
            </a>
          }
          @case ('error') {
            <lmn-x-circle [size]="32" class="text-danger" />
            <p class="text-sm text-ink-muted">{{ error() }}</p>
            <a routerLink="/dashboard">
              <volt-button variant="outline">Back to dashboard</volt-button>
            </a>
          }
        }
      </div>
    </app-auth-layout>
  `,
})
export default class VerifyEmail {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<VerifyState>('pending');
  readonly error = signal('This verification link is invalid or has expired.');

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('error');
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: () => this.state.set('success'),
      error: (message: string) => {
        this.error.set(message);
        this.state.set('error');
      },
    });
  }
}
