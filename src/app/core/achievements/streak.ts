import type { Streak } from '../models/achievement.model';

/**
 * Practice-day arithmetic for streaks (see specs/engagement.md).
 *
 * A day key is the learner's *local* calendar day as `YYYY-MM-DD`. Keys are
 * compared and shifted through UTC so that adding a day is always exactly 24h
 * and never lands on a DST repeat or gap.
 */

export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDayKey(dayKey: string, deltaDays: number): string {
  const [year, month, day] = dayKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return [
    `${shifted.getUTCFullYear()}`.padStart(4, '0'),
    `${shifted.getUTCMonth() + 1}`.padStart(2, '0'),
    `${shifted.getUTCDate()}`.padStart(2, '0'),
  ].join('-');
}

export function computeStreak(
  days: readonly string[],
  today: string = toDayKey(new Date())
): Streak {
  const practised = new Set(days);
  const activeToday = practised.has(today);

  // The day is not over, so a run that ends yesterday is still the current one.
  let cursor = activeToday ? today : shiftDayKey(today, -1);
  let current = 0;
  while (practised.has(cursor)) {
    current += 1;
    cursor = shiftDayKey(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let previous: string | undefined;
  for (const day of [...practised].sort()) {
    run = previous && shiftDayKey(previous, 1) === day ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }

  return { current, longest, activeToday };
}
