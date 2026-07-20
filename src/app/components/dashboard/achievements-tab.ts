import { Component, computed, inject } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardDescription,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LmnFireIcon } from 'lumen-icons/fire';
import { AchievementsService } from '../../core/services/achievements.service';
import { BadgeTile } from '../ui/badge-tile';
import { StatTile } from '../ui/stat-tile';

@Component({
  selector: 'app-achievements-tab',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardDescription,
    VoltCardHeader,
    VoltCardTitle,
    TranslatePipe,
    BadgeTile,
    StatTile,
    LmnFireIcon,
  ],
  template: `
    <volt-card class="border-al-line">
      <volt-card-header>
        <volt-card-title>{{
          'dashboard.achievements.cardTitle' | translate
        }}</volt-card-title>
        <volt-card-description>
          {{ 'dashboard.achievements.cardDescription' | translate }}
        </volt-card-description>
      </volt-card-header>
      <volt-card-content>
        <div class="grid gap-4 sm:grid-cols-3">
          <app-stat-tile
            [label]="'dashboard.achievements.currentStreak' | translate"
            [value]="currentStreak()"
          >
            <lmn-fire data-slot="icon" [size]="14" />
          </app-stat-tile>
          <app-stat-tile
            [label]="'dashboard.achievements.longestStreak' | translate"
            [value]="longestStreak()"
          />
          <app-stat-tile
            [label]="'dashboard.achievements.badgesEarned' | translate"
            [value]="badgeScore()"
          />
        </div>

        <p class="mt-4 text-sm text-al-ink-muted">{{ streakHint() }}</p>

        <h3
          class="mt-8 mb-4 text-sm font-semibold uppercase tracking-wide text-al-ink-muted"
        >
          {{ 'dashboard.achievements.badgesHeading' | translate }}
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
  private readonly translate = inject(TranslateService);

  readonly badges = this.achievements.badges;

  private days(count: number): string {
    const unit = this.translate.instant(
      count === 1 ? 'dashboard.achievements.day' : 'dashboard.achievements.days'
    );
    return `${count} ${unit}`;
  }

  readonly currentStreak = computed(() => this.days(this.achievements.streak().current));
  readonly longestStreak = computed(() => this.days(this.achievements.streak().longest));
  readonly badgeScore = computed(
    () => `${this.achievements.earnedBadges().length} / ${this.badges().length}`
  );

  readonly streakHint = computed(() => {
    const streak = this.achievements.streak();
    if (streak.activeToday) {
      return this.translate.instant('dashboard.achievements.hintActiveToday');
    }
    if (streak.current > 0) {
      return this.translate.instant('dashboard.achievements.hintContinue');
    }
    return this.translate.instant('dashboard.achievements.hintStart');
  });
}
