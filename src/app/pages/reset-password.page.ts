import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltLabel,
} from '@voltui/components';
import { LmnExclamationTriangleIcon } from 'lumen-icons/exclamation-triangle';
import { LmnKeyIcon } from 'lumen-icons/key';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
    LmnKeyIcon,
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
          <lmn-key [size]="24" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Choose a new password
        </h1>
      </div>

      <volt-card class="border-zinc-200 shadow-xl dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Set password</volt-card-title>
          <volt-card-description>
            At least 8 characters, including a letter and a number.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          @if (!token) {
            <div
              class="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
            >
              <lmn-exclamation-triangle [size]="16" class="mt-0.5 shrink-0" />
              This reset link is invalid or has expired.
            </div>
          } @else {
            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="flex flex-col gap-4"
            >
              <div class="flex flex-col gap-2">
                <volt-label for="password">New password</volt-label>
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
                [disabled]="form.invalid || loading()"
              >
                {{ loading() ? 'Updating...' : 'Update password' }}
              </volt-button>
            </form>
          }
        </volt-card-content>
      </volt-card>
    </section>
  `,
})
export default class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly token = this.route.snapshot.queryParamMap.get('token');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid || !this.token) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.auth.resetPassword(this.token, this.form.value.password).subscribe({
      next: () => {
        void this.router.navigate(['/login'], {
          queryParams: { reset: '1' },
        });
      },
      error: (message: string) => {
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }
}
