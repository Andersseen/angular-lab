import { computed, inject, Injectable } from '@angular/core';
import { badgesEarnedBy, computeBadges, type BadgeInput } from '../achievements/badges';
import { computeStreak } from '../achievements/streak';
import type { Badge, CompletionCardData } from '../models/achievement.model';
import type { Mission } from '../models/mission.model';
import { ActivityService } from './activity.service';
import { MissionCatalogService } from './mission-catalog.service';
import { ProgressSyncService } from './progress-sync.service';

/**
 * Read-only view over progress + practice days: streak, badges and completion
 * cards. Everything is derived on demand (see specs/engagement.md), so this
 * service owns no state of its own.
 */
@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  private readonly activity = inject(ActivityService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly progressSync = inject(ProgressSyncService);

  readonly streak = computed(() => computeStreak(this.activity.days()));

  readonly completedMissionIds = computed(
    () =>
      new Set(
        this.progressSync
          .localProgress()
          .filter((entry) => entry.completed)
          .map((entry) => entry.missionId)
      )
  );

  readonly badges = computed(() => computeBadges(this.badgeInput()));
  readonly earnedBadges = computed(() =>
    this.badges().filter((badge) => badge.earned)
  );
  readonly completedCount = computed(() => this.completedMissionIds().size);
  readonly totalMissions = computed(() => this.catalog.getAll().length);

  /** Badges this mission's completion just unlocked; empty if it is not complete. */
  badgesEarnedByMission(missionId: string): Badge[] {
    return badgesEarnedBy(this.badgeInput(), missionId);
  }

  completionCard(mission: Mission): CompletionCardData {
    const entry = this.progressSync
      .localProgress()
      .find((item) => item.missionId === mission.id);
    const completedAt = entry?.completedAt ?? Date.now();

    return {
      missionTitle: mission.title,
      track: mission.track,
      difficulty: mission.difficulty,
      completedOn: new Date(completedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      streakDays: this.streak().current,
      missionsCompleted: this.completedCount(),
      missionsTotal: this.totalMissions(),
    };
  }

  private badgeInput(): BadgeInput {
    return {
      missions: this.catalog.getAll(),
      completedMissionIds: this.completedMissionIds(),
      longestStreak: this.streak().longest,
    };
  }
}
