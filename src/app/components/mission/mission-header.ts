import { Component, computed, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
import { LmnBoltIcon } from 'lumen-icons/bolt';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnFireIcon } from 'lumen-icons/fire';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnSparklesIcon } from 'lumen-icons/sparkles';
import type { Mission, MissionProgress } from '../../core/models/mission.model';

const DIFFICULTY_CONFIG: Record<string, { label: string; classes: string; icon: string }> = {
  beginner: {
    label: 'Beginner',
    classes:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    icon: 'sparkles',
  },
  intermediate: {
    label: 'Intermediate',
    classes:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    icon: 'bolt',
  },
  advanced: {
    label: 'Advanced',
    classes:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
    icon: 'fire',
  },
};

@Component({
  selector: 'app-mission-header',
  standalone: true,
  imports: [VoltBadge, VoltProgress, LmnSparklesIcon, LmnBoltIcon, LmnFireIcon, LmnClockIcon, LmnListBulletIcon],
  template: `
    <header class="mb-8 flex flex-col gap-6">
      <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <lmn-list-bullet [size]="12" />
              {{ mission().track }}
            </span>
            <h1 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white md:text-4xl">
              {{ mission().title }}
            </h1>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
              [class]="difficultyConfig().classes"
            >
              @switch (difficultyConfig().icon) {
                @case ('sparkles') {
                  <lmn-sparkles [size]="12" />
                }
                @case ('bolt') {
                  <lmn-bolt [size]="12" />
                }
                @case ('fire') {
                  <lmn-fire [size]="12" />
                }
              }
              {{ difficultyConfig().label }}
            </span>
          </div>
          <p class="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            {{ mission().description }}
          </p>
          <p class="inline-flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            <span class="inline-flex items-center gap-1.5">
              <lmn-clock [size]="14" />
              {{ mission().durationMinutes }} min
            </span>
            <span class="inline-flex items-center gap-1.5">
              <lmn-list-bullet [size]="14" />
              {{ mission().steps.length }} steps
            </span>
          </p>
        </div>
        <div class="min-w-56">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-medium">Mission progress</span>
            <span class="text-zinc-500 dark:text-zinc-400">
              {{ progress().percentage }}%
            </span>
          </div>
          <volt-progress
            [value]="progress().percentage"
            [attr.aria-label]="'Mission progress: ' + progress().percentage + '%'"
          />
        </div>
      </div>
    </header>
  `,
})
export class MissionHeader {
  readonly mission = input.required<Mission>();
  readonly progress = input.required<MissionProgress>();

  readonly difficultyConfig = computed(() => {
    const difficulty = this.mission().difficulty;
    return (
      DIFFICULTY_CONFIG[difficulty] ?? {
        label: difficulty,
        classes:
          'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300',
        icon: 'sparkles',
      }
    );
  });
}
