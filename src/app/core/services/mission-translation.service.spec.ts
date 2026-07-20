import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import type { MissionMeta } from '../models/mission.model';
import { LanguageService, type AppLang } from './language.service';
import { MissionTranslationService } from './mission-translation.service';

const MISSION_META: MissionMeta = {
  id: 'reactive-signals',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Fundamentals',
  tags: [],
  starterCode: '',
  steps: [
    { id: 'concept', type: 'concept' },
    {
      id: 'quiz',
      type: 'checkpoint',
      checkpoints: [{ correctIndex: 1 }],
    },
  ],
};

const EN_FIXTURE = {
  'reactive-signals': {
    title: 'Reactive Signals',
    description: 'Learn signals.',
    goal: 'Understand signals.',
    steps: {
      concept: {
        title: 'What is a signal?',
        content: 'A signal wraps a value.',
        hint: 'Think of it as a box.',
      },
      quiz: {
        checkpoints: [
          {
            question: 'How do you read a signal?',
            options: ['count.value', 'count()'],
            explanation: 'Signals are read as functions.',
          },
        ],
      },
    },
  },
};

describe('MissionTranslationService', () => {
  let service: MissionTranslationService;
  let http: HttpTestingController;
  let lang: ReturnType<typeof signal<AppLang>>;

  beforeEach(() => {
    lang = signal<AppLang>('en');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MissionTranslationService,
        { provide: LanguageService, useValue: { lang } },
      ],
    });
    service = TestBed.inject(MissionTranslationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('is not ready and hydrate() returns undefined before English loads', () => {
    expect(service.ready()).toBe(false);
    expect(service.hydrate(MISSION_META)).toBeUndefined();

    http.expectOne('/i18n/missions/en.json').flush(EN_FIXTURE);
  });

  it('hydrates from English once loaded, with no overlay fetch for English', () => {
    http.expectOne('/i18n/missions/en.json').flush(EN_FIXTURE);
    TestBed.flushEffects();

    expect(service.ready()).toBe(true);
    const mission = service.hydrate(MISSION_META);

    expect(mission?.title).toBe('Reactive Signals');
    expect(mission?.goal).toBe('Understand signals.');
    expect(mission?.steps[0].title).toBe('What is a signal?');
    expect(mission?.steps[0].hint).toBe('Think of it as a box.');
    expect(mission?.steps[1].checkpoints?.[0]).toEqual({
      correctIndex: 1,
      question: 'How do you read a signal?',
      options: ['count.value', 'count()'],
      explanation: 'Signals are read as functions.',
    });
  });

  it('overlays the active language on top of English, falling back field-by-field', () => {
    http.expectOne('/i18n/missions/en.json').flush(EN_FIXTURE);

    lang.set('es');
    TestBed.flushEffects();

    http.expectOne('/i18n/missions/es.json').flush({
      'reactive-signals': {
        title: 'Señales Reactivas',
        steps: {
          concept: {
            title: '¿Qué es una señal?',
          },
        },
      },
    });

    const mission = service.hydrate(MISSION_META);

    expect(mission?.title).toBe('Señales Reactivas');
    expect(mission?.steps[0].title).toBe('¿Qué es una señal?');
    // Not present in the Spanish overlay — falls back to English.
    expect(mission?.description).toBe('Learn signals.');
    expect(mission?.steps[0].content).toBe('A signal wraps a value.');
  });

  it('switching back to English drops the overlay', () => {
    http.expectOne('/i18n/missions/en.json').flush(EN_FIXTURE);

    lang.set('es');
    TestBed.flushEffects();
    http.expectOne('/i18n/missions/es.json').flush({
      'reactive-signals': { title: 'Señales Reactivas' },
    });
    expect(service.hydrate(MISSION_META)?.title).toBe('Señales Reactivas');

    lang.set('en');
    TestBed.flushEffects();

    expect(service.hydrate(MISSION_META)?.title).toBe('Reactive Signals');
  });

  it('getEnglishSummary resolves title/description for routeMeta', async () => {
    const promise = new Promise((resolve) => {
      service.getEnglishSummary('reactive-signals').subscribe(resolve);
    });
    http.expectOne('/i18n/missions/en.json').flush(EN_FIXTURE);

    await expect(promise).resolves.toEqual({
      title: 'Reactive Signals',
      description: 'Learn signals.',
    });
  });
});
