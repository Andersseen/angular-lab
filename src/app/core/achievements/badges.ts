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
  target: number
): Badge {
  return {
    id,
    title,
    description,
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
      'First Launch',
      'Complete your first mission.',
      'milestone',
      completed.length,
      1
    ),
    badge(
      'five-missions',
      'Getting Serious',
      'Complete 5 missions.',
      'milestone',
      completed.length,
      5
    ),
    badge(
      'all-missions',
      'Lab Graduate',
      'Complete every mission in the catalog.',
      'milestone',
      completed.length,
      missions.length
    ),
    badge(
      'advanced-mission',
      'Deep End',
      'Complete an advanced mission.',
      'milestone',
      advancedCompleted,
      1
    ),
    ...tracks.map((track) =>
      badge(
        `track:${track}`,
        `${track} Specialist`,
        `Complete every mission in the ${track} track.`,
        'track',
        completed.filter((mission) => mission.track === track).length,
        missions.filter((mission) => mission.track === track).length
      )
    ),
    badge(
      'streak-3',
      'Three in a Row',
      'Practice 3 days in a row.',
      'streak',
      longestStreak,
      3
    ),
    badge(
      'streak-7',
      'Week Streak',
      'Practice 7 days in a row.',
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
