import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltLabel,
} from '@voltui/components';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnKeyIcon } from 'lumen-icons/key';
import { AuthService } from '../core/services/auth.service';

export const routeMeta: RouteMeta = {
  title: 'Forgot password — Angular Lab',
};

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    VoltLabel,
    LmnEnvelopeIcon,
    LmnKeyIcon,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-6 py-12"
    >
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg"
        >
          <lmn-key [size]="24" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Forgot your password?
        </h1>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          We'll email you a link to choose a new one.
        </p>
      </div>

      <volt-card class="border-zinc-200 shadow-xl dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Reset password</volt-card-title>
          <volt-card-description>
            Enter the email associated with your account.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          @if (sent()) {
            <div
              class="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
            >
              <p>
                If that email is registered, a reset link is on its way. Check
                your inbox.
              </p>
              @if (devLink()) {
                <a
                  [href]="devLink()"
                  class="break-all font-medium underline"
                  data-testid="dev-reset-link"
                >
                  {{ devLink() }}
                </a>
              }
            </div>
          } @else {
            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-4"
            >
              <div class="flex flex-col gap-2">
                <volt-label for="email">Email</volt-label>
                <div class="relative">
                  <span
                    class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    <lmn-envelope [size]="16" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    volt-input
                    formControlName="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="pl-9"
                  />
                </div>
              </div>

              <volt-button
                type="submit"
                class="w-full"
                [disabled]="form.invalid || loading()"
              >
                {{ loading() ? 'Sending...' : 'Send reset link' }}
              </volt-button>
            </form>
          }

          <p class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">
            Remembered it?
            <a
              routerLink="/login"
              class="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >Back to log in</a
            >
          </p>
        </volt-card-content>
      </volt-card>
    </section>
  `,
})
export default class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly sent = signal(false);
  readonly devLink = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.auth.requestPasswordReset(this.form.value.email).subscribe({
      next: (response) => {
        this.devLink.set(response.devLink ?? null);
        this.sent.set(true);
        this.loading.set(false);
      },
      error: () => {
        // Endpoint is intentionally generic; always show the sent state.
        this.sent.set(true);
        this.loading.set(false);
      },
    });
  }
}
