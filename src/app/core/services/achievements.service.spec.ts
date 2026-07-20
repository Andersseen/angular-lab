import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MISSIONS } from '../../../content/missions';
import { toDayKey } from '../achievements/streak';
import type { Mission, MissionMeta, MissionState } from '../models/mission.model';
import { AchievementsService } from './achievements.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

/** Storage is seeded before the services boot: they read it on construction. */
const seeded = new StorageService();
const FIRST: MissionMeta = MISSIONS[0];
/** `completionCard()` needs learner-facing text, which no longer lives on `MissionMeta`. */
const FIRST_HYDRATED: Mission = {
  ...FIRST,
  title: 'Test Mission',
  description: 'Test mission description',
  steps: FIRST.steps.map((step) => ({
    ...step,
    title: step.id,
    content: '',
    checkpoints: step.checkpoints?.map((checkpoint) => ({
      ...checkpoint,
      question: '',
      options: [],
      explanation: '',
    })),
  })),
};

function completeMission(mission: MissionMeta): void {
  const state: MissionState = {
    missionId: mission.id,
    currentStepId: mission.steps[mission.steps.length - 1]?.id ?? '',
    stepCode: {},
    completed: true,
    completedAt: Date.UTC(2026, 6, 19, 12),
    updatedAt: Date.UTC(2026, 6, 19, 12),
  };
  seeded.setItem(`mission:${mission.id}`, state);
}

describe('AchievementsService', () => {
  let http: HttpTestingController;

  function build(): AchievementsService {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: { user: signal(null), isAuthenticated: () => false },
        },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AchievementsService);
  }

  beforeEach(() => window.localStorage.clear());
  afterEach(() => http.verify());

  it('reports an empty slate with no practice', () => {
    const service = build();

    expect(service.streak()).toEqual({
      current: 0,
      longest: 0,
      activeToday: false,
    });
    expect(service.earnedBadges()).toEqual([]);
    expect(service.completedCount()).toBe(0);
    expect(service.totalMissions()).toBe(MISSIONS.length);
  });

  it('derives the current streak from recorded practice days', () => {
    seeded.setItem('activity', [
      toDayKey(new Date(Date.now() - 86_400_000)),
      toDayKey(new Date()),
    ]);

    const streak = build().streak();

    expect(streak.current).toBe(2);
    expect(streak.activeToday).toBe(true);
  });

  it('earns badges from completed missions', () => {
    completeMission(FIRST);

    const service = build();

    expect(service.completedCount()).toBe(1);
    expect(service.earnedBadges().map((badge) => badge.id)).toContain(
      'first-mission'
    );
    expect(
      service.badgesEarnedByMission(FIRST.id).map((badge) => badge.id)
    ).toContain('first-mission');
  });

  it('builds a completion card from the mission and stored progress', () => {
    completeMission(FIRST);

    const card = build().completionCard(FIRST_HYDRATED);

    expect(card.missionTitle).toBe(FIRST_HYDRATED.title);
    expect(card.track).toBe(FIRST_HYDRATED.track);
    expect(card.difficulty).toBe(FIRST_HYDRATED.difficulty);
    expect(card.missionsCompleted).toBe(1);
    expect(card.missionsTotal).toBe(MISSIONS.length);
    expect(card.completedOn).toMatch(/2026/);
  });
});
