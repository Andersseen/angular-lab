import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';

@Component({
  selector: 'app-progress-tab',
  standalone: true,
  imports: [
    RouterLink,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    LmnRocketLaunchIcon,
  ],
  template: `
    <volt-card class="border-zinc-200 dark:border-zinc-800">
      <volt-card-header>
        <volt-card-title>Learning progress</volt-card-title>
        <volt-card-description>
          Your mission progress is stored locally in this demo. Cloud sync is
          coming soon.
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        <div
          class="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700"
        >
          <p class="text-zinc-600 dark:text-zinc-300">
            Complete missions to see your progress here.
          </p>
          <a routerLink="/missions">
            <volt-button>
              <span class="flex items-center gap-2">
                <lmn-rocket-launch [size]="16" />
                Browse missions
              </span>
            </volt-button>
          </a>
        </div>
      </volt-card-content>
    </volt-card>
  `,
})
export class ProgressTab {}
