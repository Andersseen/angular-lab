import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Observable, map, shareReplay } from 'rxjs';
import type { Mission, MissionMeta } from '../models/mission.model';
import { LanguageService } from './language.service';

interface CheckpointText {
  readonly question?: string;
  readonly options?: readonly string[];
  readonly explanation?: string;
}

interface ComparisonText {
  readonly titleA?: string;
  readonly titleB?: string;
  readonly points?: readonly { readonly aspect?: string; readonly a?: string; readonly b?: string }[];
  readonly recommendation?: string;
}

interface StepText {
  readonly title?: string;
  readonly content?: string;
  readonly hint?: string;
  readonly checkpoints?: readonly CheckpointText[];
  readonly comparison?: ComparisonText;
}

interface MissionText {
  readonly title?: string;
  readonly description?: string;
  readonly goal?: string;
  readonly steps?: Readonly<Record<string, StepText>>;
}

type TranslationFile = Readonly<Record<string, MissionText>>;

/**
 * All mission text — English included — lives in `public/i18n/missions/*.json`,
 * not in `src/content/missions/*.ts` (which holds only structural `MissionMeta`;
 * see mission.model.ts and specs/i18n.md). This service assembles the full
 * `Mission` the app renders by combining that structural data with text.
 *
 * English is fetched once, eagerly, on construction: it's the required base
 * every other language falls back to, and `routeMeta` (SEO title/description)
 * needs it too. Non-English overlays are fetched lazily, only when the
 * learner actually switches language, mirroring the UI-chrome pattern.
 */
@Injectable({
  providedIn: 'root',
})
export class MissionTranslationService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  // shareReplay so a routeMeta resolver reading English text doesn't fire a second request.
  private readonly english$: Observable<TranslationFile> = this.http
    .get<TranslationFile>('/i18n/missions/en.json')
    .pipe(shareReplay(1));

  private readonly english = signal<TranslationFile | null>(null);
  private readonly overlay = signal<TranslationFile | null>(null);

  readonly ready = computed(() => this.english() !== null);

  constructor() {
    this.english$.subscribe({
      next: (data) => this.english.set(data),
      error: () => this.english.set({}),
    });

    effect((onCleanup) => {
      const lang = this.language.lang();
      if (lang === 'en') {
        this.overlay.set(null);
        return;
      }
      const subscription = this.http
        .get<TranslationFile>(`/i18n/missions/${lang}.json`)
        .subscribe({
          next: (data) => this.overlay.set(data),
          error: () => this.overlay.set(null),
        });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  /** Title/description for `routeMeta` — always English regardless of the active language (specs/i18n.md). */
  getEnglishSummary(missionId: string): Observable<{ title: string; description: string } | undefined> {
    return this.english$.pipe(
      map((file) => {
        const text = file[missionId];
        return text?.title && text.description
          ? { title: text.title, description: text.description }
          : undefined;
      })
    );
  }

  /**
   * Assembles the full `Mission` for `meta` from English text plus the active
   * language's overlay, falling back field-by-field to English. Returns
   * `undefined` only while English hasn't loaded yet or the mission is
   * missing from `en.json` — full coverage is enforced by
   * `src/content/missions/translations.spec.ts`, not by this method.
   */
  hydrate(meta: MissionMeta): Mission | undefined {
    const english = this.english();
    if (!english) {
      return undefined;
    }
    const en = english[meta.id];
    if (!en) {
      return undefined;
    }
    const overlay = this.overlay()?.[meta.id];

    return {
      id: meta.id,
      title: overlay?.title ?? en.title ?? '',
      description: overlay?.description ?? en.description ?? '',
      goal: overlay?.goal ?? en.goal,
      difficulty: meta.difficulty,
      durationMinutes: meta.durationMinutes,
      track: meta.track,
      tags: meta.tags,
      prerequisites: meta.prerequisites,
      previewMode: meta.previewMode,
      starterCode: meta.starterCode,
      steps: meta.steps.map((stepMeta) => {
        const enStep = en.steps?.[stepMeta.id];
        const overlayStep = overlay?.steps?.[stepMeta.id];
        return {
          id: stepMeta.id,
          type: stepMeta.type,
          title: overlayStep?.title ?? enStep?.title ?? '',
          content: overlayStep?.content ?? enStep?.content ?? '',
          hint: overlayStep?.hint ?? enStep?.hint,
          checkpoints: stepMeta.checkpoints?.map((checkpointMeta, index) => {
            const enCheckpoint = enStep?.checkpoints?.[index];
            const overlayCheckpoint = overlayStep?.checkpoints?.[index];
            return {
              correctIndex: checkpointMeta.correctIndex,
              question: overlayCheckpoint?.question ?? enCheckpoint?.question ?? '',
              options: overlayCheckpoint?.options ?? enCheckpoint?.options ?? [],
              explanation: overlayCheckpoint?.explanation ?? enCheckpoint?.explanation ?? '',
            };
          }),
          comparison:
            stepMeta.type === 'comparison' && enStep?.comparison
              ? {
                  titleA: overlayStep?.comparison?.titleA ?? enStep.comparison.titleA ?? '',
                  titleB: overlayStep?.comparison?.titleB ?? enStep.comparison.titleB ?? '',
                  recommendation:
                    overlayStep?.comparison?.recommendation ?? enStep.comparison.recommendation ?? '',
                  points: (enStep.comparison.points ?? []).map((enPoint, index) => {
                    const overlayPoint = overlayStep?.comparison?.points?.[index];
                    return {
                      aspect: overlayPoint?.aspect ?? enPoint.aspect ?? '',
                      a: overlayPoint?.a ?? enPoint.a ?? '',
                      b: overlayPoint?.b ?? enPoint.b ?? '',
                    };
                  }),
                }
              : undefined,
        };
      }),
    };
  }
}
