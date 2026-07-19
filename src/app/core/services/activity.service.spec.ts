import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { toDayKey } from '../achievements/streak';
import { ActivityService } from './activity.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let storage: StorageService;
  let http: HttpTestingController;
  let authUser: ReturnType<typeof signal>;
  const today = toDayKey(new Date());

  function configure(): void {
    authUser = signal(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ActivityService,
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
    service = TestBed.inject(ActivityService);
    storage = TestBed.inject(StorageService);
    http = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    window.localStorage.clear();
    configure();
  });

  afterEach(() => {
    http.verify();
  });

  it('records today locally without calling the API as a guest', () => {
    service.recordToday();

    expect(service.days()).toEqual([today]);
    expect(storage.getItem<string[]>('activity')).toEqual([today]);
    http.expectNone('/api/activity');
  });

  it('records a day at most once', () => {
    service.recordToday();
    service.recordToday();

    expect(service.days()).toEqual([today]);
  });

  it('unions local and remote days on login', () => {
    storage.setItem('activity', ['2026-07-17']);
    TestBed.resetTestingModule();
    configure();

    authUser.set({ id: 'u1', email: 'demo@example.com', name: 'Demo' });
    TestBed.flushEffects();

    const request = http.expectOne('/api/activity');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ days: ['2026-07-17'] });
    request.flush({ days: ['2026-07-16', '2026-07-17'] });

    expect(service.days()).toEqual(['2026-07-16', '2026-07-17']);
  });

  it('pushes a new practice day while authenticated', () => {
    authUser.set({ id: 'u1', email: 'demo@example.com', name: 'Demo' });
    TestBed.flushEffects();
    http.expectOne('/api/activity').flush({ days: [] });

    service.recordToday();

    http.expectOne('/api/activity').flush({ days: [today] });
    expect(service.days()).toEqual([today]);
  });

  it('keeps local days when the sync fails', () => {
    storage.setItem('activity', ['2026-07-17']);
    TestBed.resetTestingModule();
    configure();

    authUser.set({ id: 'u1', email: 'demo@example.com', name: 'Demo' });
    TestBed.flushEffects();
    http
      .expectOne('/api/activity')
      .flush({ error: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(service.days()).toEqual(['2026-07-17']);
  });
});
