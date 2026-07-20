import type { Mission } from '../models/mission.model';
import type { Badge, BadgeCategory } from '../models/achievement.model';

/**
 * Badges are derived, never stored (see specs/engagement.md), so they cannot
 * drift from real progress. Every requirement is built on a value that only
 * ever grows — missions completed, longest streak — which is what guarantees an
 * earned badge can never be taken away by a later recomputation.
 */

export interface BadgeInput {
  readonly missions: readonly Mission[];
  readonly completedMissionIds: ReadonlySet<string>;
  readonly longestStreak: number;
}

function badge(
  id: string,
  title: string,
  description: string,
  category: BadgeCategory,
  current: number,
  target: number,
  titleParams?: Record<string, string>,
  descriptionParams?: Record<string, string>
): Badge {
  return {
    id,
    title,
    description,
    titleParams,
    descriptionParams,
    category,
    current: Math.min(current, target),
    target,
    earned: target > 0 && current >= target,
  };
}

export function computeBadges(input: BadgeInput): Badge[] {
  const { missions, completedMissionIds, longestStreak } = input;
  const completed = missions.filter((mission) =>
    completedMissionIds.has(mission.id)
  );
  const advancedCompleted = completed.filter(
    (mission) => mission.difficulty === 'advanced'
  ).length;

  // Tracks in catalog order, so adding a track adds its badge automatically.
  const tracks = [...new Set(missions.map((mission) => mission.track))];

  return [
    badge(
      'first-mission',
      'dashboard.achievements.badges.firstLaunch.title',
      'dashboard.achievements.badges.firstLaunch.description',
      'milestone',
      completed.length,
      1
    ),
    badge(
      'five-missions',
      'dashboard.achievements.badges.gettingSerious.title',
      'dashboard.achievements.badges.gettingSerious.description',
      'milestone',
      completed.length,
      5
    ),
    badge(
      'all-missions',
      'dashboard.achievements.badges.labGraduate.title',
      'dashboard.achievements.badges.labGraduate.description',
      'milestone',
      completed.length,
      missions.length
    ),
    badge(
      'advanced-mission',
      'dashboard.achievements.badges.deepEnd.title',
      'dashboard.achievements.badges.deepEnd.description',
      'milestone',
      advancedCompleted,
      1
    ),
    ...tracks.map((track) =>
      badge(
        `track:${track}`,
        'dashboard.achievements.badges.trackSpecialist.title',
        'dashboard.achievements.badges.trackSpecialist.description',
        'track',
        completed.filter((mission) => mission.track === track).length,
        missions.filter((mission) => mission.track === track).length,
        { track },
        { track }
      )
    ),
    badge(
      'streak-3',
      'dashboard.achievements.badges.threeInARow.title',
      'dashboard.achievements.badges.threeInARow.description',
      'streak',
      longestStreak,
      3
    ),
    badge(
      'streak-7',
      'dashboard.achievements.badges.weekStreak.title',
      'dashboard.achievements.badges.weekStreak.description',
      'streak',
      longestStreak,
      7
    ),
  ];
}

/** Badges earned *by* adding `missionId` — the diff drives the completion view. */
export function badgesEarnedBy(input: BadgeInput, missionId: string): Badge[] {
  if (!input.completedMissionIds.has(missionId)) {
    return [];
  }

  const without = new Set(input.completedMissionIds);
  without.delete(missionId);

  const before = new Set(
    computeBadges({ ...input, completedMissionIds: without })
      .filter((item) => item.earned)
      .map((item) => item.id)
  );

  return computeBadges(input).filter(
    (item) => item.earned && !before.has(item.id)
  );
}
