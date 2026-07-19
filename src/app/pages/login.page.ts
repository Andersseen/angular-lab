import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { FormField } from '../components/ui/form-field';

export const routeMeta: RouteMeta = {
  title: 'Log in — Angular Lab',
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    VoltButton,
    AuthLayout,
    FormField,
    Alert,
    LmnRocketLaunchIcon,
    LmnEnvelopeIcon,
    LmnLockClosedIcon,
    LmnArrowRightEndOnRectangleIcon,
  ],
  template: `
    <app-auth-layout
      heading="Welcome back"
      subtitle="Continue your Angular journey"
      cardTitle="Log in"
    >
      <lmn-rocket-launch data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        Demo account:
        <span class="font-medium">demo&#64;angular-lab.dev</span> /
        <span class="font-medium">Demo1234</span>
      </span>

      @if (resetDone()) {
        <app-alert variant="success" class="mb-4 block">
          Your password was updated. Log in with your new password.
        </app-alert>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
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

        <app-form-field label="Password" controlId="password">
          <lmn-lock-closed data-slot="icon" [size]="16" />
          <input
            id="password"
            type="password"
            volt-input
            formControlName="password"
            placeholder="••••••••"
            autocomplete="current-password"
            class="pl-9"
          />
        </app-form-field>

        <div class="-mt-2 text-right">
          <a
            routerLink="/forgot-password"
            class="text-sm font-medium text-al-brand hover:underline"
            >Forgot password?</a
          >
        </div>

        @if (error()) {
          <app-alert variant="danger">{{ error() }}</app-alert>
        }

        <volt-button
          type="submit"
          class="w-full"
          [disabled]="form.invalid || auth.isLoading()"
        >
          <span class="flex items-center gap-2">
            @if (auth.isLoading()) {
              Logging in...
            } @else {
              <lmn-arrow-right-end-on-rectangle [size]="16" />
              Log in
            }
          </span>
        </volt-button>
      </form>

      <p class="mt-4 text-center text-sm text-al-ink-muted">
        Don't have an account?
        <a routerLink="/signup" class="font-medium text-al-brand hover:underline"
          >Sign up</a
        >
      </p>
    </app-auth-layout>
  `,
})
export default class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);
  readonly resetDone = signal(
    this.route.snapshot.queryParamMap.get('reset') === '1'
  );

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.error.set(null);
    const { email, password } = this.form.value;

    this.auth.login({ email, password }).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
      },
      error: (err: string) => {
        this.error.set(err);
      },
    });
  }
}
