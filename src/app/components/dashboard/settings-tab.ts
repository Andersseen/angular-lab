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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    TranslatePipe,
    ConfirmDialog,
    LmnArrowRightEndOnRectangleIcon,
    LmnTrashIcon,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <volt-card class="border-al-line">
        <volt-card-header>
          <volt-card-title>{{
            'dashboard.settings.accountCardTitle' | translate
          }}</volt-card-title>
          <volt-card-description>
            {{ 'dashboard.settings.accountCardDescription' | translate }}
          </volt-card-description>
        </volt-card-header>
        <volt-card-content>
          <div
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm font-medium text-al-ink">
                {{ 'dashboard.settings.logoutEverywhereTitle' | translate }}
              </p>
              <p class="text-sm text-al-ink-muted">
                {{ 'dashboard.settings.logoutEverywhereDescription' | translate }}
              </p>
            </div>
            <volt-button
              variant="outline"
              [disabled]="busy()"
              (click)="logoutEverywhere()"
            >
              <span class="flex items-center gap-2">
                <lmn-arrow-right-end-on-rectangle [size]="16" />
                {{ 'dashboard.settings.logoutEverywhereButton' | translate }}
              </span>
            </volt-button>
          </div>
        </volt-card-content>
      </volt-card>

      <volt-card class="border-al-danger/40">
        <volt-card-header>
          <volt-card-title class="text-al-danger">{{
            'dashboard.settings.dangerZoneTitle' | translate
          }}</volt-card-title>
          <volt-card-description>
            {{ 'dashboard.settings.dangerZoneDescription' | translate }}
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
              {{ 'dashboard.settings.deleteAccountButton' | translate }}
            </span>
          </volt-button>
        </volt-card-content>
      </volt-card>

      <app-confirm-dialog
        [open]="confirmingDelete()"
        [title]="'dashboard.settings.deleteAccountConfirmTitle' | translate"
        [message]="'dashboard.settings.deleteAccountConfirmMessage' | translate"
        [confirmLabel]="'dashboard.settings.deleteAccountConfirmLabel' | translate"
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
  private readonly translate = inject(TranslateService);

  readonly busy = signal(false);
  readonly confirmingDelete = signal(false);

  logoutEverywhere(): void {
    this.busy.set(true);
    this.auth.logoutEverywhere().subscribe(() => {
      this.busy.set(false);
      this.toast.info(
        this.translate.instant('dashboard.settings.logoutEverywhereToastMessage'),
        this.translate.instant('dashboard.settings.doneToastTitle')
      );
      void this.router.navigate(['/']);
    });
  }

  deleteAccount(): void {
    this.busy.set(true);
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.success(
          this.translate.instant('dashboard.settings.deleteAccountToastMessage'),
          this.translate.instant('dashboard.settings.goodbyeToastTitle')
        );
        void this.router.navigate(['/']);
      },
      error: () => {
        this.busy.set(false);
        this.confirmingDelete.set(false);
        this.toast.error(
          this.translate.instant('dashboard.settings.deleteAccountErrorToastMessage'),
          this.translate.instant('dashboard.settings.oopsToastTitle')
        );
      },
    });
  }
}
