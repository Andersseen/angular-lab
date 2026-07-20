import { Component } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnFaceFrownIcon } from 'lumen-icons/face-frown';
import { EmptyState } from '../components/ui/empty-state';

export const routeMeta: RouteMeta = {
  title: 'Page not found — Angular Lab',
  meta: [{ name: 'robots', content: 'noindex' }],
};

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, VoltButton, TranslatePipe, EmptyState, LmnFaceFrownIcon],
  template: `
    <div
      class="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center px-6"
    >
      <app-empty-state
        [title]="'notFound.title' | translate"
        [message]="'notFound.message' | translate"
      >
        <lmn-face-frown data-slot="icon" [size]="32" />
        <div data-slot="action" class="flex flex-wrap justify-center gap-3">
          <a routerLink="/">
            <volt-button>{{ 'notFound.goHome' | translate }}</volt-button>
          </a>
          <a routerLink="/missions">
            <volt-button variant="outline">{{
              'common.browseMissions' | translate
            }}</volt-button>
          </a>
        </div>
      </app-empty-state>
    </div>
  `,
})
export default class NotFound {}
