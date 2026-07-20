import { Injectable } from '@angular/core';
import { MISSIONS } from '../../../content/missions';
import type { MissionMeta } from '../models/mission.model';

/**
 * Structural mission data only — no learner-facing text. `MissionTranslationService`
 * combines this with `public/i18n/missions/*.json` to produce the full `Mission`
 * objects components render. See specs/i18n.md.
 */
@Injectable({
  providedIn: 'root',
})
export class MissionCatalogService {
  private readonly catalog: readonly MissionMeta[] = MISSIONS;

  getAll(): readonly MissionMeta[] {
    return this.catalog;
  }

  getById(id: string): MissionMeta | undefined {
    return this.catalog.find((mission) => mission.id === id);
  }

  getTracks(): readonly string[] {
    return [...new Set(this.catalog.map((mission) => mission.track))];
  }

  getByTrack(track: string): readonly MissionMeta[] {
    return this.catalog.filter((mission) => mission.track === track);
  }
}
