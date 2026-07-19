import type { Mission } from '../models/mission.model';
import { badgesEarnedBy, computeBadges, type BadgeInput } from './badges';

function mission(
  id: string,
  track: string,
  difficulty: Mission['difficulty'] = 'beginner'
): Mission {
  return {
    id,
    title: id,
    description: '',
    difficulty,
    durationMinutes: 10,
    track,
    tags: [],
    steps: [],
    starterCode: '',
  };
}

const MISSIONS: Mission[] = [
  mission('a1', 'Fundamentals'),
  mission('a2', 'Fundamentals'),
  mission('b1', 'Routing & Data', 'advanced'),
  mission('b2', 'Routing & Data'),
];

function input(completed: string[], longestStreak = 0): BadgeInput {
  return {
    missions: MISSIONS,
    completedMissionIds: new Set(completed),
    longestStreak,
  };
}

function byId(badges: ReturnType<typeof computeBadges>, id: string) {
  const badge = badges.find((item) => item.id === id);
  if (!badge) {
    throw new Error(`Missing badge ${id}`);
  }
  return badge;
}

describe('computeBadges', () => {
  it('leaves everything unearned with no progress', () => {
    const badges = computeBadges(input([]));

    expect(badges.every((badge) => !badge.earned)).toBe(true);
    expect(byId(badges, 'first-mission').target).toBe(1);
  });

  it('earns the first-mission badge and reports partial progress', () => {
    const badges = computeBadges(input(['a1']));

    expect(byId(badges, 'first-mission').earned).toBe(true);
    expect(byId(badges, 'five-missions').earned).toBe(false);
    expect(byId(badges, 'five-missions').current).toBe(1);
  });

  it('caps progress at the requirement', () => {
    const badges = computeBadges(input(['a1', 'a2', 'b1', 'b2'], 30));

    expect(byId(badges, 'streak-3').current).toBe(3);
    expect(byId(badges, 'five-missions').current).toBe(4);
  });

  it('derives one badge per track from the catalog', () => {
    const badges = computeBadges(input(['a1', 'a2']));

    expect(byId(badges, 'track:Fundamentals').earned).toBe(true);
    expect(byId(badges, 'track:Routing & Data').earned).toBe(false);
    expect(badges.filter((badge) => badge.category === 'track')).toHaveLength(2);
  });

  it('earns Deep End only for an advanced mission', () => {
    expect(byId(computeBadges(input(['a1'])), 'advanced-mission').earned).toBe(false);
    expect(byId(computeBadges(input(['b1'])), 'advanced-mission').earned).toBe(true);
  });

  it('earns streak badges from the longest streak', () => {
    const badges = computeBadges(input([], 7));

    expect(byId(badges, 'streak-3').earned).toBe(true);
    expect(byId(badges, 'streak-7').earned).toBe(true);
  });

  it('earns Lab Graduate only after the whole catalog', () => {
    expect(byId(computeBadges(input(['a1', 'a2', 'b1'])), 'all-missions').earned).toBe(false);
    expect(byId(computeBadges(input(['a1', 'a2', 'b1', 'b2'])), 'all-missions').earned).toBe(true);
  });
});

describe('badgesEarnedBy', () => {
  it('reports only what this completion unlocked', () => {
    const earned = badgesEarnedBy(input(['a1', 'a2']), 'a2');

    expect(earned.map((badge) => badge.id)).toEqual(['track:Fundamentals']);
  });

  it('returns nothing for a mission that is not completed', () => {
    expect(badgesEarnedBy(input(['a1']), 'b1')).toEqual([]);
  });

  it('returns nothing when the completion crossed no threshold', () => {
    expect(badgesEarnedBy(input(['a1', 'a2', 'b2']), 'b2')).toEqual([]);
  });
});
