import { Component, computed, input } from '@angular/core';
import { VoltBadge, VoltProgress } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnBoltIcon } from 'lumen-icons/bolt';
import { LmnClockIcon } from 'lumen-icons/clock';
import { LmnFireIcon } from 'lumen-icons/fire';
import { LmnListBulletIcon } from 'lumen-icons/list-bullet';
import { LmnSparklesIcon } from 'lumen-icons/sparkles';
import type { Mission, MissionProgress } from '../../core/models/mission.model';

const DIFFICULTY_CONFIG: Record<string, { labelKey: string; classes: string; icon: string }> = {
  beginner: {
    labelKey: 'mission.header.difficulty.beginner',
    classes:
      'border-al-success/30 bg-al-success/10 text-al-success',
    icon: 'sparkles',
  },
  intermediate: {
    labelKey: 'mission.header.difficulty.intermediate',
    classes:
      'border-al-warning/40 bg-al-warning/10 text-al-warning',
    icon: 'bolt',
  },
  advanced: {
    labelKey: 'mission.header.difficulty.advanced',
    classes:
      'border-al-danger/30 bg-al-danger/10 text-al-danger',
    icon: 'fire',
  },
};

@Component({
  selector: 'app-mission-header',
  standalone: true,
  imports: [
    VoltBadge,
    VoltProgress,
    TranslatePipe,
    LmnSparklesIcon,
    LmnBoltIcon,
    LmnFireIcon,
    LmnClockIcon,
    LmnListBulletIcon,
  ],
  template: `
    <header class="mb-8 flex flex-col gap-6">
      <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-al-line bg-al-surface-raised px-3 py-1 text-xs font-semibold text-al-ink"
            >
              <lmn-list-bullet [size]="12" />
              {{ mission().track }}
            </span>
            <h1 class="text-3xl font-bold tracking-tight text-al-ink md:text-4xl">
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
              {{ difficultyConfig().labelKey | translate }}
            </span>
          </div>
          <p class="max-w-2xl text-lg leading-relaxed text-al-ink-muted">
            {{ mission().description }}
          </p>
          <p class="inline-flex items-center gap-3 text-sm text-al-ink-muted">
            <span class="inline-flex items-center gap-1.5">
              <lmn-clock [size]="14" />
              {{
                'mission.header.durationMinutes'
                  | translate: { count: mission().durationMinutes }
              }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <lmn-list-bullet [size]="14" />
              {{
                'mission.header.stepsCount' | translate: { count: mission().steps.length }
              }}
            </span>
          </p>
        </div>
        <div class="min-w-56">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-medium">{{ 'mission.header.progressLabel' | translate }}</span>
            <span class="text-al-ink-muted">
              {{ progress().percentage }}%
            </span>
          </div>
          <volt-progress
            [value]="progress().percentage"
            [attr.aria-label]="
              'mission.header.progressAria' | translate: { percentage: progress().percentage }
            "
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
        labelKey: '',
        classes:
          'border-al-line bg-al-surface text-al-ink',
        icon: 'sparkles',
      }
    );
  });
}
