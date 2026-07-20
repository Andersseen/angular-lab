export type StepType =
  | "concept"
  | "example"
  | "practice"
  | "comparison"
  | "checkpoint"
  | "summary";

export interface Checkpoint {
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface Comparison {
  readonly titleA: string;
  readonly titleB: string;
  readonly points: readonly {
    readonly aspect: string;
    readonly a: string;
    readonly b: string;
  }[];
  readonly recommendation: string;
}

export interface Step {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly type: StepType;
  readonly hint?: string;
  readonly checkpoints?: readonly Checkpoint[];
  readonly comparison?: Comparison;
}

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Mission {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** One sentence: what the learner can do after finishing (missions spec front matter). */
  readonly goal?: string;
  readonly difficulty: Difficulty;
  readonly durationMinutes: number;
  readonly track: string;
  readonly tags: readonly string[];
  /** Mission ids the learner should complete first; surfaced in the catalog. */
  readonly prerequisites?: readonly string[];
  readonly steps: readonly Step[];
  readonly starterCode: string;
  /** Preview behavior: 'live' runs the code for real; 'mock' (default) shows a simulated UI. */
  readonly previewMode?: "live" | "mock";
}

/**
 * A checkpoint's structural identity: which option is correct. Never
 * translated, so it lives in the mission-authoring (structural) layer rather
 * than in a translation file, where it would have to stay in sync by hand.
 */
export interface CheckpointMeta {
  readonly correctIndex: number;
}

/**
 * A step's structural identity — everything about it that ISN'T text.
 * `id` and `type` drive which text/checkpoints/comparison get attached by
 * `MissionTranslationService.hydrate()`; the text itself lives in
 * `public/i18n/missions/*.json` (see specs/i18n.md).
 */
export interface StepMeta {
  readonly id: string;
  readonly type: StepType;
  /** Present only for `type: 'checkpoint'` steps; length = number of checkpoints. */
  readonly checkpoints?: readonly CheckpointMeta[];
}

/**
 * A mission's structural identity — everything about it that ISN'T learner-
 * facing prose. Authored directly in `src/content/missions/*.ts`. All text
 * (title, description, goal, step content, checkpoint questions, comparisons)
 * lives in `public/i18n/missions/*.json` for every language including
 * English — `MissionTranslationService.hydrate()` assembles the full
 * `Mission` the app renders by combining this structural data with the
 * current language's text. See specs/i18n.md.
 */
export interface MissionMeta {
  readonly id: string;
  readonly difficulty: Difficulty;
  readonly durationMinutes: number;
  readonly track: string;
  readonly tags: readonly string[];
  readonly prerequisites?: readonly string[];
  readonly steps: readonly StepMeta[];
  readonly starterCode: string;
  readonly previewMode?: "live" | "mock";
}

export interface StepState {
  readonly code: string;
}

export interface MissionState {
  readonly missionId: string;
  readonly currentStepId: string;
  readonly stepCode: Readonly<Record<string, string>>;
  readonly completed: boolean;
  readonly completedAt?: number | null;
  /** Last-modified timestamp used for sync conflict resolution (see specs/progress.md). */
  readonly updatedAt?: number;
}

/** Progress entry as exchanged with `GET/PUT /api/progress`. */
export interface ProgressEntry {
  readonly missionId: string;
  readonly currentStepId: string;
  readonly stepCode: Record<string, string>;
  readonly completed: boolean;
  readonly completedAt?: number | null;
  readonly updatedAt: number;
}

export interface MissionProgress {
  readonly percentage: number;
  readonly currentStepNumber: number;
  readonly totalSteps: number;
}
