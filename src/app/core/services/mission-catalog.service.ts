import { Injectable } from '@angular/core';
import { MISSIONS } from '../../../content/missions';
import type { Mission } from '../models/mission.model';

@Injectable({
  providedIn: 'root',
})
export class MissionCatalogService {
  private readonly catalog: readonly Mission[] = MISSIONS;

  getAll(): readonly Mission[] {
    return this.catalog;
  }

  getById(id: string): Mission | undefined {
    return this.catalog.find((mission) => mission.id === id);
  }

  getTracks(): readonly string[] {
    return [...new Set(this.catalog.map((mission) => mission.track))];
  }

  getByTrack(track: string): readonly Mission[] {
    return this.catalog.filter((mission) => mission.track === track);
  }
}
