import { TestBed } from '@angular/core/testing';
import { MissionStateService } from './mission-state.service';
import { StorageService } from './storage.service';

const DEMO_MISSION_ID = 'reactive-signals';

describe('MissionStateService', () => {
  let service: MissionStateService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MissionStateService, StorageService],
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
    expect(service.currentStep()?.title).toBe('Concept');
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
    expect(storage.getItem<{ stepCode: Record<string, string> }>(`mission:${DEMO_MISSION_ID}`)?.stepCode['concept']).toBe(editedCode);
  });

  it('each step starts with the starter code', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.stepCode()['concept']).toContain('signal(0)');
    expect(service.stepCode()['example']).toContain('signal(0)');
  });

  it('reset restores initial state', () => {
    service.selectMission(DEMO_MISSION_ID);
    service.nextStep();
    service.updateCode('modified');

    service.resetMission();

    expect(service.currentStepId()).toBe('concept');
    expect(service.stepCode()['concept']).toContain('signal(0)');
    expect(service.completed()).toBe(false);
  });

  it('calculates progress correctly', () => {
    service.selectMission(DEMO_MISSION_ID);

    expect(service.progress()).toEqual({
      percentage: 33,
      currentStepNumber: 1,
      totalSteps: 3,
    });

    service.selectStep('example');
    expect(service.progress().percentage).toBe(67);

    service.selectStep('practice');
    expect(service.progress().percentage).toBe(100);
  });

  it('does nothing when selecting an unknown mission', () => {
    service.selectMission('unknown');

    expect(service.mission()).toBeUndefined();
  });
});
