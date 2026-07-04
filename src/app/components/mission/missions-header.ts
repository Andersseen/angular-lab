import { Component } from '@angular/core';
import { LmnRocketLaunchIcon } from 'lumen-icons/rocket-launch';

@Component({
  selector: 'app-missions-header',
  standalone: true,
  imports: [LmnRocketLaunchIcon],
  template: `
    <header class="max-w-2xl">
      <div
        class="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
      >
        <lmn-rocket-launch [size]="12" />
        Learning paths
      </div>
      <h1
        class="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl"
      >
        Missions
      </h1>
      <p class="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
        Pick a mission and learn Angular by writing real code in the browser. No
        setup required.
      </p>
    </header>
  `,
})
export class MissionsHeader {}
