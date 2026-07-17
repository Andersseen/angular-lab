import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltInput,
  VoltLabel,
} from '@voltui/components';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnExclamationTriangleIcon } from 'lumen-icons/exclamation-triangle';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnUserIcon } from 'lumen-icons/user';
import { AuthService } from '../core/services/auth.service';

export const routeMeta: RouteMeta = {
  title: 'Sign up — Angular Lab',
};

@Component({
  selector: 'app-signup',
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
    VoltInput,
    VoltLabel,
    LmnRocketLaunchIcon,
    LmnUserIcon,
    LmnEnvelopeIcon,
    LmnLockClosedIcon,
    LmnExclamationTriangleIcon,
  ],
  template: `
    <section
      class="app-gradient mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-6 py-12"
    >
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg"
        >
          <lmn-rocket-launch [size]="24" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Create account
        </h1>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Join Angular Lab and track your progress
        </p>
      </div>

      <volt-card class="border-zinc-200 shadow-xl dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Sign up</volt-card-title>
          <volt-card-description>
            Free forever. No credit card required.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4"
          >
            <div class="flex flex-col gap-2">
              <volt-label for="name">Name</volt-label>
              <div class="relative">
                <span
                  class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  <lmn-user [size]="16" />
                </span>
                <input
                  id="name"
                  type="text"
                  volt-input
                  formControlName="name"
                  placeholder="Your name"
                  autocomplete="name"
                  class="pl-9"
                />
              </div>
            </div>

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

            <div class="flex flex-col gap-2">
              <volt-label for="password">Password</volt-label>
              <div class="relative">
                <span
                  class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  <lmn-lock-closed [size]="16" />
                </span>
                <input
                  id="password"
                  type="password"
                  volt-input
                  formControlName="password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  class="pl-9"
                />
              </div>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">
                At least 8 characters with a letter and a number.
              </p>
            </div>

            @if (error()) {
              <div
                class="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              >
                <lmn-exclamation-triangle [size]="16" class="mt-0.5 shrink-0" />
                {{ error() }}
              </div>
            }

            <volt-button
              type="submit"
              class="w-full"
              [disabled]="form.invalid || auth.isLoading()"
            >
              {{ auth.isLoading() ? 'Creating account...' : 'Sign up' }}
            </volt-button>
          </form>

          <p class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">
            Already have an account?
            <a
              routerLink="/login"
              class="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >Log in</a
            >
          </p>
        </volt-card-content>
      </volt-card>
    </section>
  `,
})
export default class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-zA-Z])(?=.*[0-9])/),
      ],
    ],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.error.set(null);
    const { name, email, password } = this.form.value;

    this.auth.signup({ name, email, password }).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
      },
      error: (err: string) => {
        this.error.set(err);
      },
    });
  }
}
