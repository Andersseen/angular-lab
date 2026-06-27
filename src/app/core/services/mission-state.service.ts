import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  Mission,
  MissionProgress,
  MissionState,
  Step,
} from '../models/mission.model';
import { MissionCatalogService } from './mission-catalog.service';
import { StorageService } from './storage.service';

function buildInitialState(mission: Mission): MissionState {
  return {
    missionId: mission.id,
    currentStepId: mission.steps[0]?.id ?? '',
    stepCode: Object.fromEntries(
      mission.steps.map((step) => [step.id, mission.starterCode])
    ),
    completed: false,
  };
}

@Injectable({
  providedIn: 'root',
})
export class MissionStateService {
  private readonly catalog = inject(MissionCatalogService);
  private readonly storage = inject(StorageService);

  readonly mission = signal<Mission | undefined>(undefined);
  readonly currentStepId = signal<string>('');
  readonly stepCode = signal<Record<string, string>>({});
  readonly completed = signal<boolean>(false);

  readonly currentStep = computed<Step | undefined>(() => {
    const mission = this.mission();
    if (!mission) {
      return undefined;
    }
    return mission.steps.find((step) => step.id === this.currentStepId());
  });

  readonly stepIndex = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return -1;
    }
    return mission.steps.findIndex((step) => step.id === this.currentStepId());
  });

  readonly hasPrevious = computed(() => this.stepIndex() > 0);
  readonly hasNext = computed(() => {
    const mission = this.mission();
    const index = this.stepIndex();
    return !!mission && index >= 0 && index < mission.steps.length - 1;
  });

  readonly currentStepNumber = computed(() => {
    const index = this.stepIndex();
    return index >= 0 ? index + 1 : 0;
  });

  readonly progress = computed<MissionProgress>(() => {
    const mission = this.mission();
    const current = this.currentStepNumber();
    const total = mission?.steps.length ?? 0;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return {
      percentage,
      currentStepNumber: current,
      totalSteps: total,
    };
  });

  selectMission(missionId: string): void {
    const mission = this.catalog.getById(missionId);
    if (!mission) {
      return;
    }

    const stored = this.storage.getItem<MissionState>(`mission:${missionId}`);
    const state = stored?.missionId === missionId ? stored : buildInitialState(mission);

    this.mission.set(mission);
    this.currentStepId.set(state.currentStepId || mission.steps[0]?.id || '');
    this.stepCode.set({ ...state.stepCode });
    this.completed.set(state.completed ?? false);
  }

  selectStep(stepId: string): void {
    const mission = this.mission();
    if (!mission || !mission.steps.some((step) => step.id === stepId)) {
      return;
    }
    this.currentStepId.set(stepId);
    this.persist();
  }

  updateCode(code: string): void {
    const stepId = this.currentStepId();
    if (!stepId) {
      return;
    }
    this.stepCode.update((current) => ({ ...current, [stepId]: code }));
    this.persist();
  }

  previousStep(): void {
    const mission = this.mission();
    const index = this.stepIndex();
    if (!mission || index <= 0) {
      return;
    }
    this.selectStep(mission.steps[index - 1].id);
  }

  nextStep(): void {
    const mission = this.mission();
    const index = this.stepIndex();
    if (!mission || index < 0 || index >= mission.steps.length - 1) {
      return;
    }
    this.selectStep(mission.steps[index + 1].id);
  }

  resetMission(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }
    const initial = buildInitialState(mission);
    this.currentStepId.set(initial.currentStepId);
    this.stepCode.set({ ...initial.stepCode });
    this.completed.set(false);
    this.persist();
  }

  markCompleted(): void {
    this.completed.set(true);
    this.persist();
  }

  private persist(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }
    const state: MissionState = {
      missionId: mission.id,
      currentStepId: this.currentStepId(),
      stepCode: { ...this.stepCode() },
      completed: this.completed(),
    };
    this.storage.setItem(`mission:${mission.id}`, state);
  }
}
