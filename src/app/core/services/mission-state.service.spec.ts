import { TestBed } from '@angular/core/testing';
import { MissionStateService } from './mission-state.service';
import { ProgressSyncService } from './progress-sync.service';
import { StorageService } from './storage.service';

const DEMO_MISSION_ID = 'reactive-signals';

describe('MissionStateService', () => {
  let service: MissionStateService;
  let storage: StorageService;
  let progressSync: { queueLocalChange: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    progressSync = { queueLocalChange: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        MissionStateService,
        StorageService,
        { provide: ProgressSyncService, useValue: progressSync },
      ],
    });
    service = TestBed.inject(MissionStateService);
    storage = TestBed.inject(StorageService);
    storage.removeItem(`mission:${DEMO_MISSION_ID}`);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads the demo mission with the first step selected', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.mission()?.id).toBe(DEMO_MISSION_ID);
    expect(service.currentStepId()).toBe('concept');
    expect(service.currentStep()?.title).toBe('What are signals?');
  });

  it('navigates to the next and previous steps', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.hasPrevious()).toBe(false);
    expect(service.hasNext()).toBe(true);

    service.nextStep();
    expect(service.currentStepId()).toBe('example');
    expect(service.hasPrevious()).toBe(true);

    service.previousStep();
    expect(service.currentStepId()).toBe('concept');
  });

  it('updates code for the current step and persists it', () => {
    service.selectMission(DEMO_MISSION_ID);
    const editedCode = 'const edited = true;';

    service.updateCode(editedCode);

    expect(service.stepCode()['concept']).toBe(editedCode);
    const stored = storage.getItem<{
      stepCode: Record<string, string>;
      updatedAt: number;
    }>(`mission:${DEMO_MISSION_ID}`);

    expect(stored?.stepCode['concept']).toBe(editedCode);
    expect(stored?.updatedAt).toEqual(expect.any(Number));
    expect(progressSync.queueLocalChange).toHaveBeenCalledWith(
      expect.objectContaining({ missionId: DEMO_MISSION_ID })
    );
  });

  it('each step starts with the starter code', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.stepCode()['concept']).toContain('Counter');
    expect(service.stepCode()['example']).toContain('Counter');
  });

  it('reset restores initial state', () => {
    service.selectMission(DEMO_MISSION_ID);
    service.nextStep();
    service.updateCode('modified');

    service.resetMission();

    expect(service.currentStepId()).toBe('concept');
    expect(service.stepCode()['concept']).toContain('Counter');
    expect(service.completed()).toBe(false);
    expect(service.completedAt()).toBeNull();
  });

  it('stores completion timestamps', () => {
    service.selectMission(DEMO_MISSION_ID);

    service.markCompleted();

    const stored = storage.getItem<{ completed: boolean; completedAt: number }>(
      `mission:${DEMO_MISSION_ID}`
    );
    expect(stored?.completed).toBe(true);
    expect(stored?.completedAt).toEqual(expect.any(Number));
  });

  it('calculates progress correctly', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.progress()).toEqual({
      percentage: 17,
      currentStepNumber: 1,
      totalSteps: 6,
    });

    service.selectStep('example');
    expect(service.progress().percentage).toBe(33);

    service.selectStep('practice');
    expect(service.progress().percentage).toBe(50);
  });

  it('does nothing when selecting an unknown mission', () => {
    service.selectMission('unknown');

    expect(service.mission()).toBeUndefined();
  });
});
