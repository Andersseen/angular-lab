import { Component, inject, signal } from '@angular/core';
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
import { AuthService } from '../core/services/auth.service';

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
  ],
  template: `
    <section class="mx-auto w-full max-w-md px-6 py-12">
      <volt-card>
        <volt-card-header>
          <volt-card-title>Create account</volt-card-title>
          <volt-card-description>
            Join Angular Lab for free and track your progress across missions.
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
              <input
                id="name"
                type="text"
                volt-input
                formControlName="name"
                placeholder="Your name"
                autocomplete="name"
              />
            </div>

            <div class="flex flex-col gap-2">
              <volt-label for="email">Email</volt-label>
              <input
                id="email"
                type="email"
                volt-input
                formControlName="email"
                placeholder="you@example.com"
                autocomplete="email"
              />
            </div>

            <div class="flex flex-col gap-2">
              <volt-label for="password">Password</volt-label>
              <input
                id="password"
                type="password"
                volt-input
                formControlName="password"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400">
                At least 8 characters with a letter and a number.
              </p>
            </div>

            @if (error()) {
              <div
                class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
              >
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

          <p class="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
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
      [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[a-zA-Z])(?=.*[0-9])/)]
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
