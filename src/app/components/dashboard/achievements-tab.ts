import { Component, computed, inject } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnFireIcon } from 'lumen-icons/fire';
import { AchievementsService } from '../../core/services/achievements.service';
import { BadgeTile } from '../ui/badge-tile';
import { StatTile } from '../ui/stat-tile';

function days(count: number): string {
  return `${count} ${count === 1 ? 'day' : 'days'}`;
}

@Component({
  selector: 'app-achievements-tab',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    BadgeTile,
    StatTile,
    LmnFireIcon,
  ],
  template: `
    <volt-card class="border-al-line">
      <volt-card-header>
        <volt-card-title>Achievements</volt-card-title>
        <volt-card-description>
          A record of your own practice. Nothing here expires, and nobody else
          is on the board.
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        <div class="grid gap-4 sm:grid-cols-3">
          <app-stat-tile label="Current streak" [value]="currentStreak()">
            <lmn-fire data-slot="icon" [size]="14" />
          </app-stat-tile>
          <app-stat-tile label="Longest streak" [value]="longestStreak()" />
          <app-stat-tile label="Badges earned" [value]="badgeScore()" />
        </div>

        <p class="mt-4 text-sm text-al-ink-muted">{{ streakHint() }}</p>

        <h3
          class="mt-8 mb-4 text-sm font-semibold uppercase tracking-wide text-al-ink-muted"
        >
          Badges
        </h3>
        <ul class="grid list-none gap-3 p-0 sm:grid-cols-2">
          @for (badge of badges(); track badge.id) {
            <li><app-badge-tile [badge]="badge" /></li>
          }
        </ul>
      </volt-card-content>
    </volt-card>
  `,
})
export class AchievementsTab {
  private readonly achievements = inject(AchievementsService);

  readonly badges = this.achievements.badges;

  readonly currentStreak = computed(() => days(this.achievements.streak().current));
  readonly longestStreak = computed(() => days(this.achievements.streak().longest));
  readonly badgeScore = computed(
    () => `${this.achievements.earnedBadges().length} / ${this.badges().length}`
  );

  readonly streakHint = computed(() => {
    const streak = this.achievements.streak();
    if (streak.activeToday) {
      return 'You practiced today — come back tomorrow to extend the streak.';
    }
    if (streak.current > 0) {
      return 'Practice today to keep your streak alive.';
    }
    return 'Work through a mission step to start a streak.';
  });
}
