import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ProgressSyncService } from './progress-sync.service';
import { StorageService } from './storage.service';

describe('ProgressSyncService', () => {
  let service: ProgressSyncService;
  let storage: StorageService;
  let http: HttpTestingController;
  let authUser: ReturnType<typeof signal>;

  beforeEach(() => {
    window.localStorage.clear();
    authUser = signal(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgressSyncService,
        StorageService,
        {
          provide: AuthService,
          useValue: {
            user: authUser,
            isAuthenticated: () => !!authUser(),
          },
        },
      ],
    });
    service = TestBed.inject(ProgressSyncService);
    storage = TestBed.inject(StorageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('does not call the progress API for guest changes', () => {
    service.queueLocalChange({
      missionId: 'reactive-signals',
      currentStepId: 'concept',
      stepCode: { concept: 'code' },
      completed: false,
      completedAt: null,
      updatedAt: 10,
    });

    http.expectNone('/api/progress');
  });

  it('merges remote progress on login and lets remote win ties', () => {
    storage.setItem('mission:reactive-signals', {
      missionId: 'reactive-signals',
      currentStepId: 'concept',
      stepCode: { concept: 'local' },
      completed: false,
      completedAt: null,
      updatedAt: 20,
    });

    authUser.set({ id: 'u1', email: 'demo@example.com', name: 'Demo' });
    TestBed.flushEffects();

    http.expectOne('/api/progress').flush({
      progress: [
        {
          missionId: 'reactive-signals',
          currentStepId: 'summary',
          stepCode: { concept: 'remote' },
          completed: true,
          completedAt: 30,
          updatedAt: 20,
        },
      ],
    });

    expect(
      storage.getItem<{ currentStepId: string }>('mission:reactive-signals')?.currentStepId
    ).toBe('summary');
  });

  it('debounces authenticated writes', () => {
    vi.useFakeTimers();
    authUser.set({ id: 'u1', email: 'demo@example.com', name: 'Demo' });
    TestBed.flushEffects();
    http.expectOne('/api/progress').flush({ progress: [] });

    service.queueLocalChange({
      missionId: 'reactive-signals',
      currentStepId: 'concept',
      stepCode: { concept: 'code' },
      completed: false,
      completedAt: null,
      updatedAt: 10,
    });

    http.expectNone('/api/progress');
    vi.advanceTimersByTime(600);

    const request = http.expectOne('/api/progress');
    expect(request.request.method).toBe('PUT');
    request.flush({
      progress: {
        missionId: 'reactive-signals',
        currentStepId: 'concept',
        stepCode: { concept: 'code' },
        completed: false,
        completedAt: null,
        updatedAt: 10,
      },
    });
  });
});
