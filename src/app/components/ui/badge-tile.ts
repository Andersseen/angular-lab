import { Component, computed, input } from '@angular/core';
import { LmnAcademicCapIcon } from 'lumen-icons/academic-cap';
import { LmnCheckBadgeIcon } from 'lumen-icons/check-badge';
import { LmnFireIcon } from 'lumen-icons/fire';
import { LmnTrophyIcon } from 'lumen-icons/trophy';
import type { Badge } from '../../core/models/achievement.model';

/**
 * One achievement badge, earned or not. Purely presentational: the category
 * only picks an icon, and an unearned badge always states its requirement and
 * how far along the learner is — badges are never hidden (specs/engagement.md).
 */
@Component({
  selector: 'app-badge-tile',
  standalone: true,
  imports: [
    LmnAcademicCapIcon,
    LmnCheckBadgeIcon,
    LmnFireIcon,
    LmnTrophyIcon,
  ],
  template: `
    <div class="flex h-full gap-3 rounded-xl border p-4" [class]="frameClass()">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        [class]="iconClass()"
        aria-hidden="true"
      >
        @switch (badge().category) {
          @case ('streak') {
            <lmn-fire [size]="20" />
          }
          @case ('track') {
            <lmn-academic-cap [size]="20" />
          }
          @default {
            <lmn-trophy [size]="20" />
          }
        }
      </span>

      <div class="min-w-0">
        <p class="flex items-center gap-1.5 font-medium text-al-ink">
          {{ badge().title }}
          @if (badge().earned) {
            <lmn-check-badge class="text-al-success" [size]="16" />
            <span class="sr-only">— earned</span>
          }
        </p>
        <p class="mt-0.5 text-sm text-al-ink-muted">{{ badge().description }}</p>
        @if (!badge().earned) {
          <p class="mt-2 font-mono text-xs text-al-ink-muted">
            {{ badge().current }} / {{ badge().target }}
          </p>
        }
      </div>
    </div>
  `,
})
export class BadgeTile {
  readonly badge = input.required<Badge>();

  readonly frameClass = computed(() =>
    this.badge().earned
      ? 'border-al-brand/40 bg-al-brand/5'
      : 'border-al-line bg-al-surface-raised'
  );

  readonly iconClass = computed(() =>
    this.badge().earned
      ? 'bg-gradient-brand text-al-brand-ink'
      : 'border border-al-line bg-al-surface text-al-ink-muted'
  );
}
