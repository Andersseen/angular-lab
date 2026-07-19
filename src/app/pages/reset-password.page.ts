import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { LmnKeyIcon } from 'lumen-icons/key';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { FormField } from '../components/ui/form-field';

export const routeMeta: RouteMeta = {
  title: 'Reset password — Angular Lab',
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    VoltButton,
    AuthLayout,
    FormField,
    Alert,
    LmnKeyIcon,
    LmnLockClosedIcon,
  ],
  template: `
    <app-auth-layout heading="Choose a new password" cardTitle="Set password">
      <lmn-key data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        At least 8 characters, including a letter and a number.
      </span>

      @if (!token) {
        <app-alert variant="danger">
          This reset link is invalid or has expired.
        </app-alert>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <app-form-field label="New password" controlId="password">
            <lmn-lock-closed data-slot="icon" [size]="16" />
            <input
              id="password"
              type="password"
              volt-input
              formControlName="password"
              placeholder="••••••••"
              autocomplete="new-password"
              class="pl-9"
            />
          </app-form-field>

          @if (error()) {
            <app-alert variant="danger">{{ error() }}</app-alert>
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
    </app-auth-layout>
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
