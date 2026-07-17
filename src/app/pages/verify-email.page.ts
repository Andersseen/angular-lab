import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnArrowPathIcon } from 'lumen-icons/arrow-path';
import { LmnCheckCircleIcon } from 'lumen-icons/check-circle';
import { LmnXCircleIcon } from 'lumen-icons/x-circle';
import { AuthService } from '../core/services/auth.service';

type VerifyState = 'pending' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    LmnArrowPathIcon,
    LmnCheckCircleIcon,
    LmnXCircleIcon,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-6 py-12"
    >
      <volt-card class="border-zinc-200 shadow-xl dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Email verification</volt-card-title>
          <volt-card-description>
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
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          <div class="flex flex-col items-center gap-4 py-4 text-center">
            @switch (state()) {
              @case ('pending') {
                <lmn-arrow-path
                  [size]="32"
                  class="animate-spin text-zinc-400"
                />
                <p class="text-sm text-zinc-600 dark:text-zinc-300">
                  Verifying your email address.
                </p>
              }
              @case ('success') {
                <lmn-check-circle
                  [size]="32"
                  class="text-emerald-500"
                />
                <p class="text-sm text-zinc-600 dark:text-zinc-300">
                  Your email is verified. Thanks!
                </p>
                <a routerLink="/dashboard">
                  <volt-button>Go to dashboard</volt-button>
                </a>
              }
              @case ('error') {
                <lmn-x-circle [size]="32" class="text-rose-500" />
                <p class="text-sm text-zinc-600 dark:text-zinc-300">
                  {{ error() }}
                </p>
                <a routerLink="/dashboard">
                  <volt-button variant="outline">Back to dashboard</volt-button>
                </a>
              }
            }
          </div>
        </volt-card-content>
      </volt-card>
    </section>
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
