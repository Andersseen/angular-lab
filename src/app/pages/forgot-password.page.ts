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
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
    AuthLayout,
    FormField,
    Alert,
    LmnEnvelopeIcon,
    LmnKeyIcon,
  ],
  template: `
    <app-auth-layout
      [heading]="'auth.forgotPassword.heading' | translate"
      [subtitle]="'auth.forgotPassword.subtitle' | translate"
      [cardTitle]="'auth.forgotPassword.cardTitle' | translate"
    >
      <lmn-key data-slot="icon" [size]="24" />
      <span data-slot="card-description">
        {{ 'auth.forgotPassword.cardDescription' | translate }}
      </span>

      @if (sent()) {
        <app-alert variant="success" class="block">
          <p>
            {{ 'auth.forgotPassword.sentMessage' | translate }}
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

          <volt-button
            type="submit"
            class="w-full"
            [disabled]="form.invalid || loading()"
          >
            {{
              (loading()
                ? 'auth.forgotPassword.sending'
                : 'auth.forgotPassword.submit'
              ) | translate
            }}
          </volt-button>
        </form>
      }

      <p class="mt-4 text-center text-sm text-al-ink-muted">
        {{ 'auth.forgotPassword.rememberedPrompt' | translate }}
        <a routerLink="/login" class="font-medium text-al-brand hover:underline"
          >{{ 'auth.forgotPassword.backToLogin' | translate }}</a
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
