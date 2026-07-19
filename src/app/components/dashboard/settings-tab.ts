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
import { ConfirmDialog } from '../ui/confirm-dialog';

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
    ConfirmDialog,
    LmnArrowRightEndOnRectangleIcon,
    LmnTrashIcon,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <volt-card class="border-line">
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
              <p class="text-sm font-medium text-ink">
                Log out of all devices
              </p>
              <p class="text-sm text-ink-muted">
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

      <volt-card class="border-danger/40">
        <volt-card-header>
          <volt-card-title class="text-danger">Danger zone</volt-card-title>
          <volt-card-description>
            Deleting your account removes your profile and all saved progress.
            This cannot be undone.
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
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
        </volt-card-content>
      </volt-card>

      <app-confirm-dialog
        [open]="confirmingDelete()"
        title="Delete account?"
        message="This permanently deletes your account and all saved progress. This cannot be undone."
        confirmLabel="Yes, delete my account"
        variant="danger"
        [busy]="busy()"
        (confirm)="deleteAccount()"
        (dismiss)="confirmingDelete.set(false)"
      />
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
        this.confirmingDelete.set(false);
        this.toast.error(
          'Could not delete the account. Please try again.',
          'Oops'
        );
      },
    });
  }
}
