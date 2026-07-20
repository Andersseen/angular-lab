import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import type { RouteMeta } from '@analogjs/router';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { VoltButton } from '@voltui/components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LmnMagnifyingGlassIcon } from 'lumen-icons/magnifying-glass';
import { MissionActionBar } from '../../components/mission/mission-action-bar';
import { EditorPanel } from '../../components/mission/editor-panel';
import { MissionCompleted } from '../../components/mission/mission-completed';
import { MissionHeader } from '../../components/mission/mission-header';
import { MissionNav } from '../../components/mission/mission-nav';
import { MissionStep } from '../../components/mission/mission-step';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { EmptyState } from '../../components/ui/empty-state';
import { MissionCatalogService } from '../../core/services/mission-catalog.service';
import { MissionStateService } from '../../core/services/mission-state.service';
import { MissionTranslationService } from '../../core/services/mission-translation.service';
import { ToastService } from 'quartz-headless';

/**
 * SEO title/description are always English (specs/i18n.md), sourced from
 * `MissionTranslationService`'s cached `en.json` fetch — resolvers support
 * Observables natively, so this doesn't need the mission to be structurally
 * resolved through `MissionStateService` first.
 */
function resolveEnglishSummary(route: ActivatedRouteSnapshot) {
  const catalog = inject(MissionCatalogService);
  const translation = inject(MissionTranslationService);
  const id = route.paramMap.get('id') ?? '';
  return catalog.getById(id) ? translation.getEnglishSummary(id) : of(undefined);
}

export const routeMeta: RouteMeta = {
  title: (route) =>
    resolveEnglishSummary(route).pipe(
      map((summary) => (summary ? `${summary.title} — Angular Lab` : 'Mission — Angular Lab'))
    ),
  meta: (route) =>
    resolveEnglishSummary(route).pipe(
      map((summary) => {
        const description = summary?.description ?? 'An interactive Angular learning mission.';
        return [
          { name: 'description', content: description },
          { property: 'og:title', content: summary ? summary.title : 'Angular Lab Mission' },
          { property: 'og:description', content: description },
          { property: 'og:type', content: 'article' },
        ];
      })
    ),
};

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
    MissionActionBar,
    ConfirmDialog,
    EmptyState,
    TranslatePipe,
    LmnMagnifyingGlassIcon,
  ],
  template: `
    <div class="mx-auto w-full max-w-7xl px-6 py-8">
      @if (!missionTranslation.ready()) {
        <p class="text-al-ink-muted">{{ 'common.loading' | translate }}</p>
      } @else if (mission(); as mission) {
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
                (replay)="requestReset()"
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

            <app-mission-action-bar
              [hasPrevious]="hasPrevious()"
              [hasNext]="hasNext()"
              [isLastStep]="isLastStep()"
              [completed]="completed()"
              (previous)="previousStep()"
              (next)="nextStep()"
              (resetRequested)="requestReset()"
              (complete)="markCompleted()"
            />
          </section>
        </div>

        <app-confirm-dialog
          [open]="confirmingReset()"
          [title]="'mission.confirmReset.title' | translate"
          [message]="'mission.confirmReset.message' | translate"
          [confirmLabel]="'mission.actionBar.reset' | translate"
          variant="danger"
          (confirm)="confirmReset()"
          (dismiss)="confirmingReset.set(false)"
        />
      } @else {
        <app-empty-state
          [title]="'mission.notFound.title' | translate"
          [message]="'mission.notFound.message' | translate"
        >
          <lmn-magnifying-glass data-slot="icon" [size]="32" />
          <volt-button data-slot="action" (click)="goToMissions()">
            {{ 'common.browseMissions' | translate }}
          </volt-button>
        </app-empty-state>
      }
    </div>
  `,
})
export default class Mission {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly missionState = inject(MissionStateService);
  readonly missionTranslation = inject(MissionTranslationService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly mission = computed(() => {
    const mission = this.missionState.mission();
    return mission ? this.missionTranslation.hydrate(mission) : undefined;
  });
  readonly currentStepId = this.missionState.currentStepId.asReadonly();
  readonly currentStep = computed(() => {
    const step = this.missionState.currentStep();
    if (!step) {
      return undefined;
    }
    return this.mission()?.steps.find((s) => s.id === step.id);
  });
  readonly currentStepNumber = this.missionState.currentStepNumber;
  readonly progress = this.missionState.progress;
  readonly hasPrevious = this.missionState.hasPrevious;
  readonly hasNext = this.missionState.hasNext;
  readonly completed = this.missionState.completed.asReadonly();

  readonly isLastStep = computed(() => !this.hasNext());
  readonly confirmingReset = signal(false);

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

  requestReset(): void {
    this.confirmingReset.set(true);
  }

  confirmReset(): void {
    this.confirmingReset.set(false);
    this.missionState.resetMission();
  }

  markCompleted(): void {
    this.missionState.markCompleted();
    this.toast.success(
      this.translate.instant('mission.completed.title'),
      this.translate.instant('mission.completedToast.title')
    );
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
