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
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { FormField } from '../components/ui/form-field';
import { PasswordToggle } from '../components/ui/password-toggle';

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
    TranslatePipe,
    AuthLayout,
    FormField,
    PasswordToggle,
    Alert,
    LmnRocketLaunchIcon,
    LmnEnvelopeIcon,
    LmnLockClosedIcon,
    LmnArrowRightEndOnRectangleIcon,
  ],
  template: `
    <app-auth-layout
      [heading]="'auth.login.heading' | translate"
      [subtitle]="'auth.login.subtitle' | translate"
      [cardTitle]="'auth.login.cardTitle' | translate"
    >
      <lmn-rocket-launch data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        {{ 'auth.login.demoAccountPrefix' | translate }}
        <span class="font-medium">demo&#64;angular-lab.dev</span> /
        <span class="font-medium">Demo1234</span>
      </span>

      @if (resetDone()) {
        <app-alert variant="success" class="mb-4 block">
          {{ 'auth.login.resetSuccessMessage' | translate }}
        </app-alert>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <app-form-field [label]="'common.email' | translate" controlId="email">
          <lmn-envelope data-slot="icon" [size]="16" />
          <input
            id="email"
            type="email"
            formControlName="email"
            [placeholder]="'common.emailPlaceholder' | translate"
            autocomplete="email"
            class="al-input pl-9"
          />
        </app-form-field>

        <app-form-field [label]="'common.password' | translate" controlId="password">
          <lmn-lock-closed data-slot="icon" [size]="16" />
          <input
            id="password"
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="password"
            placeholder="••••••••"
            autocomplete="current-password"
            class="al-input pl-9 pr-10"
          />
          <app-password-toggle data-slot="trailing" [(visible)]="showPassword" />
        </app-form-field>

        <div class="-mt-2 text-right">
          <a
            routerLink="/forgot-password"
            class="text-sm font-medium text-al-brand hover:underline"
            >{{ 'auth.login.forgotPassword' | translate }}</a
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
              {{ 'auth.login.loggingIn' | translate }}
            } @else {
              <lmn-arrow-right-end-on-rectangle [size]="16" />
              {{ 'auth.login.submit' | translate }}
            }
          </span>
        </volt-button>
      </form>

      <p class="mt-4 text-center text-sm text-al-ink-muted">
        {{ 'auth.login.noAccountPrompt' | translate }}
        <a routerLink="/signup" class="font-medium text-al-brand hover:underline"
          >{{ 'auth.login.signUpLink' | translate }}</a
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
  readonly showPassword = signal(false);
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
