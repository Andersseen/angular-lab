export type StepType =
  | 'concept'
  | 'example'
  | 'practice'
  | 'comparison'
  | 'checkpoint';

export interface Step {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly type: StepType;
}

export interface Mission {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: 'beginner' | 'intermediate' | 'advanced';
  readonly durationMinutes: number;
  readonly track: string;
  readonly steps: readonly Step[];
  readonly starterCode: string;
}

export interface StepState {
  readonly code: string;
}

export interface MissionState {
  readonly missionId: string;
  readonly currentStepId: string;
  readonly stepCode: Readonly<Record<string, string>>;
  readonly completed: boolean;
}

export interface MissionProgress {
  readonly percentage: number;
  readonly currentStepNumber: number;
  readonly totalSteps: number;
}
