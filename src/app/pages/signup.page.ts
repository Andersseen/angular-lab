import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';
import { LmnUserIcon } from 'lumen-icons/user';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { FormField } from '../components/ui/form-field';
import { PasswordToggle } from '../components/ui/password-toggle';

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
    TranslatePipe,
    AuthLayout,
    FormField,
    PasswordToggle,
    Alert,
    LmnRocketLaunchIcon,
    LmnUserIcon,
    LmnEnvelopeIcon,
    LmnLockClosedIcon,
  ],
  template: `
    <app-auth-layout
      [heading]="'auth.signup.heading' | translate"
      [subtitle]="'auth.signup.subtitle' | translate"
      [cardTitle]="'auth.signup.cardTitle' | translate"
    >
      <lmn-rocket-launch data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        {{ 'auth.signup.cardDescription' | translate }}
      </span>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <app-form-field [label]="'auth.signup.nameLabel' | translate" controlId="name">
          <lmn-user data-slot="icon" [size]="16" />
          <input
            id="name"
            type="text"
            formControlName="name"
            [placeholder]="'auth.signup.namePlaceholder' | translate"
            autocomplete="name"
            class="al-input pl-9"
          />
        </app-form-field>

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

        <app-form-field
          [label]="'common.password' | translate"
          controlId="password"
          [hint]="'auth.signup.passwordHint' | translate"
        >
          <lmn-lock-closed data-slot="icon" [size]="16" />
          <input
            id="password"
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="password"
            placeholder="••••••••"
            autocomplete="new-password"
            class="al-input pl-9 pr-10"
          />
          <app-password-toggle data-slot="trailing" [(visible)]="showPassword" />
        </app-form-field>

        @if (error()) {
          <app-alert variant="danger">{{ error() }}</app-alert>
        }

        <volt-button
          type="submit"
          class="w-full"
          [disabled]="form.invalid || auth.isLoading()"
        >
          {{
            (auth.isLoading() ? 'auth.signup.creatingAccount' : 'auth.signup.submit')
              | translate
          }}
        </volt-button>
      </form>

      <p class="mt-4 text-center text-sm text-al-ink-muted">
        {{ 'auth.signup.hasAccountPrompt' | translate }}
        <a routerLink="/login" class="font-medium text-al-brand hover:underline"
          >{{ 'auth.login.submit' | translate }}</a
        >
      </p>
    </app-auth-layout>
  `,
})
export default class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

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
