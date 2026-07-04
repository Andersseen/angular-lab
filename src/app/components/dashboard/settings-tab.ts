import { Component } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardDescription, VoltCardHeader, VoltCardTitle],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <volt-card-title>Account settings</volt-card-title>
        <volt-card-description>
          More settings will be available as the platform grows.
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        <p class="text-sm text-zinc-600 dark:text-zinc-300">
          You are currently logged in as a free user. No payment methods are
          configured.
        </p>
      </volt-card-content>
    </volt-card>
  `,
})
export class SettingsTab {}
