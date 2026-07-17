import { TestBed } from '@angular/core/testing';
import { MissionCatalogService } from './mission-catalog.service';

describe('MissionCatalogService', () => {
  let catalog: MissionCatalogService;

  beforeEach(() => {
    catalog = TestBed.inject(MissionCatalogService);
  });

  it('ships a full curriculum of at least 12 missions', () => {
    expect(catalog.getAll().length).toBeGreaterThanOrEqual(12);
  });

  it('gives every mission a unique id', () => {
    const ids = catalog.getAll().map((mission) => mission.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('groups missions into the three curriculum tracks', () => {
    const tracks = catalog.getTracks();
    expect(tracks).toContain('Fundamentals');
    expect(tracks).toContain('Reactivity with Signals');
    expect(tracks).toContain('Routing & Data');
  });

  it('looks up a mission by id and returns undefined for unknown ids', () => {
    expect(catalog.getById('dom-playground')?.title).toBeTruthy();
    expect(catalog.getById('does-not-exist')).toBeUndefined();
  });

  it('gives every mission the required content fields', () => {
    for (const mission of catalog.getAll()) {
      expect(mission.title.length).toBeGreaterThan(0);
      expect(mission.description.length).toBeGreaterThan(0);
      expect(mission.steps.length).toBeGreaterThan(0);
      expect(mission.starterCode.length).toBeGreaterThan(0);
    }
  });

  it('only references prerequisites that exist in the catalog', () => {
    const ids = new Set(catalog.getAll().map((mission) => mission.id));
    for (const mission of catalog.getAll()) {
      for (const prerequisite of mission.prerequisites ?? []) {
        expect(ids.has(prerequisite)).toBe(true);
      }
    }
  });

  it('keeps live starter code self-contained (no import/export)', () => {
    const live = catalog
      .getAll()
      .filter((mission) => mission.previewMode === 'live');
    expect(live.length).toBeGreaterThan(0);
    for (const mission of live) {
      expect(mission.starterCode).not.toMatch(/^\s*import\s/m);
      expect(mission.starterCode).not.toMatch(/^\s*export\s/m);
    }
  });
});
