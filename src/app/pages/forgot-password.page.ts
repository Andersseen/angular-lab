import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnKeyIcon } from 'lumen-icons/key';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { FormField } from '../components/ui/form-field';

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
    AuthLayout,
    FormField,
    Alert,
    LmnEnvelopeIcon,
    LmnKeyIcon,
  ],
  template: `
    <app-auth-layout
      heading="Forgot your password?"
      subtitle="We'll email you a link to choose a new one."
      cardTitle="Reset password"
    >
      <lmn-key data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        Enter the email associated with your account.
      </span>

      @if (sent()) {
        <app-alert variant="success" class="block">
          <p>
            If that email is registered, a reset link is on its way. Check your
            inbox.
          </p>
          @if (devLink()) {
            <a
              [href]="devLink()"
              class="mt-3 block break-all font-medium underline"
              data-testid="dev-reset-link"
            >
              {{ devLink() }}
            </a>
          }
        </app-alert>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <app-form-field label="Email" controlId="email">
            <lmn-envelope data-slot="icon" [size]="16" />
            <input
              id="email"
              type="email"
              volt-input
              formControlName="email"
              placeholder="you@example.com"
              autocomplete="email"
              class="pl-9"
            />
          </app-form-field>

          <volt-button
            type="submit"
            class="w-full"
            [disabled]="form.invalid || loading()"
          >
            {{ loading() ? 'Sending...' : 'Send reset link' }}
          </volt-button>
        </form>
      }

      <p class="mt-4 text-center text-sm text-al-ink-muted">
        Remembered it?
        <a routerLink="/login" class="font-medium text-al-brand hover:underline"
          >Back to log in</a
        >
      </p>
    </app-auth-layout>
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
