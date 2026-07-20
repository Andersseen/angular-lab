import { Component, inject, signal } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoltButton, VoltFormField, VoltInput, VoltLabel } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnKeyIcon } from 'lumen-icons/key';
import { LmnLockClosedIcon } from 'lumen-icons/lock-closed';
import { AuthService } from '../core/services/auth.service';
import { Alert } from '../components/ui/alert';
import { AuthLayout } from '../components/ui/auth-layout';
import { PasswordToggle } from '../components/ui/password-toggle';

export const routeMeta: RouteMeta = {
  title: 'Reset password — Angular Lab',
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    VoltButton,
    VoltFormField,
    VoltLabel,
    VoltInput,
    TranslatePipe,
    AuthLayout,
    PasswordToggle,
    Alert,
    LmnKeyIcon,
    LmnLockClosedIcon,
  ],
  template: `
    <app-auth-layout
      [heading]="'auth.resetPassword.heading' | translate"
      [cardTitle]="'auth.resetPassword.cardTitle' | translate"
    >
      <lmn-key data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        {{ 'auth.resetPassword.cardDescription' | translate }}
      </span>

      @if (!token) {
        <app-alert variant="danger">
          {{ 'auth.resetPassword.invalidLinkMessage' | translate }}
        </app-alert>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4"
        >
          <volt-form-field>
            <volt-label htmlFor="password">{{
              'auth.resetPassword.newPasswordLabel' | translate
            }}</volt-label>
            <div class="al-field-control al-field-control--trailing">
              <span class="al-field-icon"><lmn-lock-closed [size]="16" /></span>
              <volt-input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <app-password-toggle [(visible)]="showPassword" />
            </div>
          </volt-form-field>

          @if (error()) {
            <app-alert variant="danger">{{ error() }}</app-alert>
          }

          <volt-button
            type="submit"
            class="w-full"
            [disabled]="form.invalid || loading()"
          >
            {{
              (loading()
                ? 'auth.resetPassword.updating'
                : 'auth.resetPassword.submit'
              ) | translate
            }}
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
  readonly showPassword = signal(false);

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
