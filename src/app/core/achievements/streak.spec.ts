import { computeStreak, shiftDayKey, toDayKey } from './streak';

describe('streak', () => {
  it('formats a local calendar day', () => {
    expect(toDayKey(new Date(2026, 6, 5))).toBe('2026-07-05');
  });

  it('shifts across month and year boundaries', () => {
    expect(shiftDayKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDayKey('2025-12-31', 1)).toBe('2026-01-01');
  });

  it('counts consecutive days ending today', () => {
    const streak = computeStreak(
      ['2026-07-17', '2026-07-18', '2026-07-19'],
      '2026-07-19'
    );

    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
    expect(streak.activeToday).toBe(true);
  });

  it('keeps a streak alive on a day the learner has not practiced yet', () => {
    const streak = computeStreak(['2026-07-17', '2026-07-18'], '2026-07-19');

    expect(streak.current).toBe(2);
    expect(streak.activeToday).toBe(false);
  });

  it('ends a streak after a gap of more than one day', () => {
    const streak = computeStreak(['2026-07-15', '2026-07-16'], '2026-07-19');

    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(2);
  });

  it('reports the longest run even when it is not the current one', () => {
    const streak = computeStreak(
      ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-19'],
      '2026-07-19'
    );

    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(4);
  });

  it('handles no practice at all', () => {
    expect(computeStreak([], '2026-07-19')).toEqual({
      current: 0,
      longest: 0,
      activeToday: false,
    });
  });

  it('ignores duplicate days', () => {
    const streak = computeStreak(
      ['2026-07-19', '2026-07-19', '2026-07-18'],
      '2026-07-19'
    );

    expect(streak.current).toBe(2);
  });
});
