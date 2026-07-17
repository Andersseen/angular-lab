import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
  VoltLabel,
} from "@voltui/components";
import { LmnArrowRightEndOnRectangleIcon } from "lumen-icons/arrow-right-end-on-rectangle";
import { LmnEnvelopeIcon } from "lumen-icons/envelope";
import { LmnExclamationTriangleIcon } from "lumen-icons/exclamation-triangle";
import { LmnLockClosedIcon } from "lumen-icons/lock-closed";
import { LmnRocketLaunchIcon } from "lumen-icons/rocket-launch";
import { AuthService } from "../core/services/auth.service";

@Component({
  selector: "app-login",
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
    LmnRocketLaunchIcon,
    LmnEnvelopeIcon,
    LmnLockClosedIcon,
    LmnExclamationTriangleIcon,
    LmnArrowRightEndOnRectangleIcon,
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
        <h1
          class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
        >
          Welcome back
        </h1>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Continue your Angular journey
        </p>
      </div>

      <volt-card class="border-zinc-200 shadow-xl dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Log in</volt-card-title>
          <volt-card-description>
            Demo account:
            <span class="font-medium">demo&#64;angular-lab.dev</span> /
            <span class="font-medium">Demo1234</span>
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          @if (resetDone()) {
            <div
              class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
            >
              Your password was updated. Log in with your new password.
            </div>
          }
          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4"
          >
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
                  autocomplete="current-password"
                  class="pl-9"
                />
              </div>
            </div>

            <div class="-mt-2 text-right">
              <a
                routerLink="/forgot-password"
                class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >Forgot password?</a
              >
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

          <p class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">
            Don't have an account?
            <a
              routerLink="/signup"
              class="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >Sign up</a
            >
          </p>
        </volt-card-content>
      </volt-card>
    </section>
  `,
})
export default class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  readonly error = signal<string | null>(null);
  readonly resetDone = signal(
    this.route.snapshot.queryParamMap.get("reset") === "1"
  );

  readonly form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.error.set(null);
    const { email, password } = this.form.value;

    this.auth.login({ email, password }).subscribe({
      next: () => {
        void this.router.navigate(["/dashboard"]);
      },
      error: (err: string) => {
        this.error.set(err);
      },
    });
  }
}
