import { Component, input, output } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowRightEndOnRectangleIcon } from 'lumen-icons/arrow-right-end-on-rectangle';
import type { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    TranslatePipe,
    LmnArrowRightEndOnRectangleIcon,
  ],
  template: `
    <volt-card class="border-al-line">
      <volt-card-header>
        <volt-card-title>{{ 'dashboard.profile.cardTitle' | translate }}</volt-card-title>
        <volt-card-description>
          {{ 'dashboard.profile.cardDescription' | translate }}
        </volt-card-description>
      </volt-card-header>
      <volt-card-content class="space-y-4">
        @if (user(); as user) {
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              class="rounded-xl border border-al-line bg-al-surface p-4"
            >
              <p class="text-sm text-al-ink-muted">
                {{ 'dashboard.profile.nameLabel' | translate }}
              </p>
              <p class="text-lg font-semibold text-al-ink">
                {{ user.name }}
              </p>
            </div>
            <div
              class="rounded-xl border border-al-line bg-al-surface p-4"
            >
              <p class="text-sm text-al-ink-muted">
                {{ 'common.email' | translate }}
              </p>
              <p class="text-lg font-semibold text-al-ink">
                {{ user.email }}
              </p>
            </div>
          </div>
        }
        <div class="flex justify-end">
          <volt-button variant="outline" (click)="logout.emit()">
            <span class="flex items-center gap-2">
              <lmn-arrow-right-end-on-rectangle [size]="16" />
              {{ 'userMenu.logOut' | translate }}
            </span>
          </volt-button>
        </div>
      </volt-card-content>
    </volt-card>
  `,
})
export class ProfileTab {
  readonly user = input<User | null | undefined>();
  readonly logout = output<void>();
}
