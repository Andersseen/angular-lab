import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    TranslatePipe,
    AuthLayout,
    LmnArrowPathIcon,
    LmnCheckCircleIcon,
    LmnEnvelopeIcon,
    LmnXCircleIcon,
  ],
  template: `
    <app-auth-layout
      [heading]="'auth.verifyEmail.heading' | translate"
      [cardTitle]="'auth.verifyEmail.cardTitle' | translate"
    >
      <lmn-envelope data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        @switch (state()) {
          @case ('pending') {
            {{ 'auth.verifyEmail.pendingDescription' | translate }}
          }
          @case ('success') {
            {{ 'auth.verifyEmail.successDescription' | translate }}
          }
          @case ('error') {
            {{ 'auth.verifyEmail.errorDescription' | translate }}
          }
        }
      </span>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        @switch (state()) {
          @case ('pending') {
            <lmn-arrow-path [size]="32" class="animate-spin text-al-ink-muted" />
            <p class="text-sm text-al-ink-muted">
              {{ 'auth.verifyEmail.pendingMessage' | translate }}
            </p>
          }
          @case ('success') {
            <lmn-check-circle [size]="32" class="text-al-success" />
            <p class="text-sm text-al-ink-muted">
              {{ 'auth.verifyEmail.successMessage' | translate }}
            </p>
            <a routerLink="/dashboard">
              <volt-button>{{
                'auth.verifyEmail.goToDashboard' | translate
              }}</volt-button>
            </a>
          }
          @case ('error') {
            <lmn-x-circle [size]="32" class="text-al-danger" />
            <p class="text-sm text-al-ink-muted">{{ error() }}</p>
            <a routerLink="/dashboard">
              <volt-button variant="outline">{{
                'auth.verifyEmail.backToDashboard' | translate
              }}</volt-button>
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
  private readonly translate = inject(TranslateService);

  readonly state = signal<VerifyState>('pending');
  readonly error = signal(
    this.translate.instant('auth.verifyEmail.invalidLinkMessage')
  );

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
