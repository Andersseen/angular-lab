/** Which requirement a badge tracks; drives its icon and grouping only. */
export type BadgeCategory = 'milestone' | 'track' | 'streak';

export interface Badge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: BadgeCategory;
  readonly earned: boolean;
  /** Progress toward `target`, capped at it. */
  readonly current: number;
  readonly target: number;
}

export interface Streak {
  /** Consecutive practice days ending today (a run ending yesterday still counts). */
  readonly current: number;
  readonly longest: number;
  readonly activeToday: boolean;
}

/** Everything printed on a shareable completion card. Never account data. */
export interface CompletionCardData {
  readonly missionTitle: string;
  readonly track: string;
  readonly difficulty: string;
  readonly completedOn: string;
  readonly streakDays: number;
  readonly missionsCompleted: number;
  readonly missionsTotal: number;
}
