import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { ToastService } from 'quartz-headless';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import { LmnTrashIcon } from 'lumen-icons/trash';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    LmnArrowRightEndOnRectangleIcon,
    LmnTrashIcon,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <volt-card class="border-zinc-200 dark:border-zinc-800">
        <volt-card-header>
          <volt-card-title>Account settings</volt-card-title>
          <volt-card-description>
            You are currently logged in as a free user. No payment methods are
            configured.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          <div
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Log out of all devices
              </p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">
                End every active session, including this one.
              </p>
            </div>
            <volt-button
              variant="outline"
              [disabled]="busy()"
              (click)="logoutEverywhere()"
            >
              <span class="flex items-center gap-2">
                <lmn-arrow-right-end-on-rectangle [size]="16" />
                Log out everywhere
              </span>
            </volt-button>
          </div>
        </volt-card-content>
      </volt-card>

      <volt-card class="border-rose-200 dark:border-rose-900">
        <volt-card-header>
          <volt-card-title class="text-rose-700 dark:text-rose-300">
            Danger zone
          </volt-card-title>
          <volt-card-description>
            Deleting your account removes your profile and all saved progress.
            This cannot be undone.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          @if (!confirmingDelete()) {
            <volt-button
              variant="destructive"
              [disabled]="busy()"
              (click)="confirmingDelete.set(true)"
            >
              <span class="flex items-center gap-2">
                <lmn-trash [size]="16" />
                Delete account
              </span>
            </volt-button>
          } @else {
            <div
              class="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950"
            >
              <p class="text-sm font-medium text-rose-800 dark:text-rose-100">
                Are you sure? This permanently deletes your account.
              </p>
              <div class="flex gap-2">
                <volt-button
                  variant="destructive"
                  [disabled]="busy()"
                  (click)="deleteAccount()"
                >
                  {{ busy() ? 'Deleting…' : 'Yes, delete my account' }}
                </volt-button>
                <volt-button
                  variant="outline"
                  [disabled]="busy()"
                  (click)="confirmingDelete.set(false)"
                >
                  Cancel
                </volt-button>
              </div>
            </div>
          }
        </volt-card-content>
      </volt-card>
    </div>
  `,
})
export class SettingsTab {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly busy = signal(false);
  readonly confirmingDelete = signal(false);

  logoutEverywhere(): void {
    this.busy.set(true);
    this.auth.logoutEverywhere().subscribe(() => {
      this.busy.set(false);
      this.toast.info('Logged out of all devices.', 'Done');
      void this.router.navigate(['/']);
    });
  }

  deleteAccount(): void {
    this.busy.set(true);
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.success('Your account has been deleted.', 'Goodbye');
        void this.router.navigate(['/']);
      },
      error: () => {
        this.busy.set(false);
        this.toast.error('Could not delete the account. Please try again.', 'Oops');
      },
    });
  }
}
