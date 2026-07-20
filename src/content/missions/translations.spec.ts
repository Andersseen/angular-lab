import { MISSIONS } from './index';
import en from '../../../public/i18n/missions/en.json';
import es from '../../../public/i18n/missions/es.json';
import uk from '../../../public/i18n/missions/uk.json';

/**
 * Structural-integrity check for mission content translations (specs/i18n.md).
 * `src/content/missions/*.ts` (`MissionMeta`) holds only structure — step ids,
 * step types, and each checkpoint's `correctIndex` — and no text at all. All
 * text, including English, lives in `public/i18n/missions/*.json`, assembled
 * at render time by `MissionTranslationService.hydrate()`.
 *
 * This test does not check translation *quality* — it checks the two things
 * that would silently break the app if wrong:
 * 1. `en.json` has complete coverage (it's the required base every other
 *    language falls back to — there's nowhere else left to fall back to).
 * 2. Checkpoint `options` arrays are long enough for the structural
 *    `correctIndex` to be a valid, correct position — `correctIndex` isn't
 *    part of any translation file, so a too-short or reordered `options`
 *    array would silently point "correct" at the wrong translated option.
 */

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

const MISSIONS_BY_ID = new Map(MISSIONS.map((mission) => [mission.id, mission]));
const EN = en as TranslationFile;

describe('en.json (required base — every field below must be present)', () => {
  it('covers every mission in the catalog, and only missions in the catalog', () => {
    const catalogIds = new Set(MISSIONS.map((mission) => mission.id));
    for (const id of Object.keys(EN)) {
      expect(catalogIds.has(id)).toBe(true);
    }
    for (const mission of MISSIONS) {
      expect(Object.keys(EN)).toContain(mission.id);
    }
  });

  for (const mission of MISSIONS) {
    describe(mission.id, () => {
      const missionText = EN[mission.id];

      it('has a title and description', () => {
        expect(missionText?.title).toBeTruthy();
        expect(missionText?.description).toBeTruthy();
      });

      for (const step of mission.steps) {
        const stepText = missionText?.steps?.[step.id];

        it(`step "${step.id}" has a title and content`, () => {
          expect(stepText?.title).toBeTruthy();
          expect(stepText?.content).toBeTruthy();
        });

        if (step.checkpoints) {
          it(`step "${step.id}" has every checkpoint, each with a valid correctIndex`, () => {
            expect(stepText?.checkpoints?.length).toBe(step.checkpoints!.length);
            step.checkpoints!.forEach((checkpoint, index) => {
              const checkpointText = stepText?.checkpoints?.[index];
              expect(checkpointText?.question).toBeTruthy();
              expect(checkpointText?.explanation).toBeTruthy();
              expect(checkpointText?.options?.length ?? 0).toBeGreaterThan(
                checkpoint.correctIndex
              );
            });
          });
        }

        if (step.type === 'comparison') {
          it(`step "${step.id}" has a complete comparison`, () => {
            const comparison = stepText?.comparison;
            expect(comparison?.titleA).toBeTruthy();
            expect(comparison?.titleB).toBeTruthy();
            expect(comparison?.recommendation).toBeTruthy();
            expect(comparison?.points?.length).toBeGreaterThan(0);
            for (const point of comparison?.points ?? []) {
              expect(point.aspect).toBeTruthy();
              expect(point.a).toBeTruthy();
              expect(point.b).toBeTruthy();
            }
          });
        }
      }
    });
  }
});

function checkOverlay(lang: string, file: TranslationFile) {
  describe(`${lang} mission translations (partial overlay, falls back to English)`, () => {
    it('only references mission ids that exist in the catalog', () => {
      for (const missionId of Object.keys(file)) {
        expect(MISSIONS_BY_ID.has(missionId)).toBe(true);
      }
    });

    for (const mission of MISSIONS) {
      const overlay = file[mission.id];
      if (!overlay) {
        continue;
      }

      describe(mission.id, () => {
        it('only references step ids that exist on the mission', () => {
          for (const stepId of Object.keys(overlay.steps ?? {})) {
            expect(mission.steps.some((step) => step.id === stepId)).toBe(true);
          }
        });

        for (const step of mission.steps) {
          const stepOverlay = overlay.steps?.[step.id];
          if (!stepOverlay) {
            continue;
          }

          if (step.checkpoints && stepOverlay.checkpoints) {
            step.checkpoints.forEach((checkpoint, index) => {
              const checkpointOverlay = stepOverlay.checkpoints?.[index];
              const checkpointEn = EN[mission.id]?.steps?.[step.id]?.checkpoints?.[index];
              if (!checkpointOverlay?.options) {
                return;
              }
              it(`step "${step.id}" checkpoint ${index} options length matches English (positional correctIndex)`, () => {
                expect(checkpointOverlay.options!.length).toBe(checkpointEn?.options?.length);
                expect(checkpointOverlay.options!.length).toBeGreaterThan(checkpoint.correctIndex);
              });
            });
          }

          if (step.type === 'comparison' && stepOverlay.comparison?.points) {
            it(`step "${step.id}" comparison points length matches English`, () => {
              const pointsEn = EN[mission.id]?.steps?.[step.id]?.comparison?.points;
              expect(stepOverlay.comparison!.points!.length).toBe(pointsEn?.length);
            });
          }

          if (step.type !== 'comparison') {
            it(`step "${step.id}" has no comparison in source, so the overlay must not add one`, () => {
              expect(stepOverlay.comparison).toBeUndefined();
            });
          }
        }
      });
    }
  });
}

checkOverlay('es', es as TranslationFile);
checkOverlay('uk', uk as TranslationFile);
