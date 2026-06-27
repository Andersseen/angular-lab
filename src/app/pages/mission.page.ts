import {
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { VoltButton } from '@voltui/components';
import { EditorPanel } from '../components/mission/editor-panel';
import { MissionHeader } from '../components/mission/mission-header';
import { MissionNav } from '../components/mission/mission-nav';
import { MissionStep } from '../components/mission/mission-step';
import { MissionStateService } from '../core/services/mission-state.service';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [
    MissionHeader,
    MissionNav,
    MissionStep,
    EditorPanel,
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
            @if (currentStep(); as step) {
              <app-mission-step
                [step]="step"
                [currentStepNumber]="currentStepNumber()"
                [totalSteps]="progress().totalSteps"
              />

              <app-editor-panel
                [code]="currentStepCode()"
                (codeChange)="updateCode($event)"
              />
            }

            <div class="flex justify-between">
              <volt-button
                variant="outline"
                [disabled]="!hasPrevious()"
                (click)="previousStep()"
              >
                Previous
              </volt-button>
              <div class="flex gap-3">
                <volt-button variant="outline" (click)="resetMission()">
                  Reset
                </volt-button>
                <volt-button [disabled]="!hasNext()" (click)="nextStep()">
                  Next
                </volt-button>
              </div>
            </div>
          </section>
        </div>
      } @else {
        <div
          class="flex h-96 items-center justify-center text-slate-500 dark:text-slate-400"
        >
          <p>Mission not found.</p>
        </div>
      }
    </div>
  `,
})
export default class Mission implements OnInit {
  private readonly missionState = inject(MissionStateService);

  readonly mission = this.missionState.mission.asReadonly();
  readonly currentStepId = this.missionState.currentStepId.asReadonly();
  readonly currentStep = this.missionState.currentStep;
  readonly currentStepNumber = this.missionState.currentStepNumber;
  readonly progress = this.missionState.progress;
  readonly hasPrevious = this.missionState.hasPrevious;
  readonly hasNext = this.missionState.hasNext;

  readonly currentStepCode = computed(() => {
    const stepId = this.currentStepId();
    return this.missionState.stepCode()[stepId] ?? '';
  });

  ngOnInit(): void {
    this.missionState.selectMission('reactive-signals');
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
    this.missionState.resetMission();
  }
}
