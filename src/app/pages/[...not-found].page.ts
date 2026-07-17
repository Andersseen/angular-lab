import { Component } from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import { VoltButton } from '@voltui/components';

export const routeMeta: RouteMeta = {
  title: 'Page not found — Angular Lab',
  meta: [{ name: 'robots', content: 'noindex' }],
};

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, VoltButton],
  template: `
    <div
      class="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p
        class="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
      >
        404
      </p>
      <h1 class="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
        Page not found
      </h1>
      <p class="text-zinc-600 dark:text-zinc-300">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div class="mt-4 flex flex-wrap justify-center gap-3">
        <a routerLink="/">
          <volt-button>Go home</volt-button>
        </a>
        <a routerLink="/missions">
          <volt-button variant="outline">Browse missions</volt-button>
        </a>
      </div>
    </div>
  `,
})
export default class NotFound {}
