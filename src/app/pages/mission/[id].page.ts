import {
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { VoltButton } from '@voltui/components';
import { EditorPanel } from '../../components/mission/editor-panel';
import { MissionCompleted } from '../../components/mission/mission-completed';
import { MissionHeader } from '../../components/mission/mission-header';
import { MissionNav } from '../../components/mission/mission-nav';
import { MissionStep } from '../../components/mission/mission-step';
import { MissionStateService } from '../../core/services/mission-state.service';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [
    MissionHeader,
    MissionNav,
    MissionStep,
    EditorPanel,
    MissionCompleted,
    VoltButton,
  ],
  template: `
    <div class="mx-auto w-full max-w-7xl px-6 py-8">
      @if (mission(); as mission) {
        <app-mission-header [mission]="mission" [progress]="progress()" />

        <div class="grid gap-6 lg:grid-cols-3">
          <app-mission-nav
            [steps]="mission.steps"
            [currentStepId]="currentStepId()"
            (selectStep)="selectStep($event)"
          />

          <section class="flex flex-col gap-6 lg:col-span-2">
            @if (completed()) {
              <app-mission-completed
                [mission]="mission"
                (explore)="goToMissions()"
                (replay)="resetMission()"
              />
            } @else if (currentStep(); as step) {
              <app-mission-step
                [step]="step"
                [currentStepNumber]="currentStepNumber()"
                [totalSteps]="progress().totalSteps"
                (allCorrect)="markCompletedIfLastStep()"
              />

              <app-editor-panel
                [mission]="mission"
                [step]="step"
                [code]="currentStepCode()"
                (codeChange)="updateCode($event)"
              />
            }

            <div class="flex justify-between">
              <volt-button
                variant="outline"
                [disabled]="!hasPrevious() || completed()"
                (click)="previousStep()"
              >
                Previous
              </volt-button>
              <div class="flex gap-3">
                <volt-button
                  variant="outline"
                  [disabled]="completed()"
                  (click)="resetMission()"
                >
                  Reset
                </volt-button>
                @if (isLastStep() && !completed()) {
                  <volt-button (click)="markCompleted()">Complete</volt-button>
                } @else {
                  <volt-button
                    [disabled]="!hasNext() || completed()"
                    (click)="nextStep()"
                  >
                    Next
                  </volt-button>
                }
              </div>
            </div>
          </section>
        </div>
      } @else {
        <div
          class="flex h-96 flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400"
        >
          <p class="text-lg">Mission not found.</p>
          <volt-button (click)="goToMissions()">Browse missions</volt-button>
        </div>
      }
    </div>
  `,
})
export default class Mission {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly missionState = inject(MissionStateService);

  readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly mission = this.missionState.mission.asReadonly();
  readonly currentStepId = this.missionState.currentStepId.asReadonly();
  readonly currentStep = this.missionState.currentStep;
  readonly currentStepNumber = this.missionState.currentStepNumber;
  readonly progress = this.missionState.progress;
  readonly hasPrevious = this.missionState.hasPrevious;
  readonly hasNext = this.missionState.hasNext;
  readonly completed = this.missionState.completed.asReadonly();

  readonly isLastStep = computed(() => !this.hasNext());

  readonly currentStepCode = computed(() => {
    const stepId = this.currentStepId();
    return this.missionState.stepCode()[stepId] ?? '';
  });

  constructor() {
    effect(() => {
      const missionId = this.id();
      if (missionId) {
        this.missionState.selectMission(missionId);
      }
    });
  }

  selectStep(stepId: string): void {
    this.missionState.selectStep(stepId);
  }

  previousStep(): void {
    this.missionState.previousStep();
  }

  nextStep(): void {
    this.missionState.nextStep();
  }

  updateCode(code: string): void {
    this.missionState.updateCode(code);
  }

  resetMission(): void {
    const confirmed = window.confirm(
      'Are you sure? This will reset your progress and restore the starter code.'
    );
    if (confirmed) {
      this.missionState.resetMission();
    }
  }

  markCompleted(): void {
    this.missionState.markCompleted();
  }

  markCompletedIfLastStep(): void {
    if (this.isLastStep()) {
      this.missionState.markCompleted();
    }
  }

  goToMissions(): void {
    void this.router.navigate(['/missions']);
  }
}
