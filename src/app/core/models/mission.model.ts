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
