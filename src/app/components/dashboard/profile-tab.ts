import { Component, input, output } from '@angular/core';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
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
    LmnArrowRightEndOnRectangleIcon,
  ],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <volt-card-title>Your profile</volt-card-title>
        <volt-card-description>
          This is the information we have on file for you.
        </volt-card-description>
      </volt-card-header>
      <volt-card-content class="space-y-4">
        @if (user(); as user) {
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Name</p>
              <p class="text-lg font-semibold text-zinc-950 dark:text-white">
                {{ user.name }}
              </p>
            </div>
            <div
              class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
              <p class="text-lg font-semibold text-zinc-950 dark:text-white">
                {{ user.email }}
              </p>
            </div>
          </div>
        }
        <div class="flex justify-end">
          <volt-button variant="outline" (click)="logout.emit()">
            <span class="flex items-center gap-2">
              <lmn-arrow-right-end-on-rectangle [size]="16" />
              Log out
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
