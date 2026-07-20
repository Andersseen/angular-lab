import { signal } from '@angular/core';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { vi } from 'vitest';
import Mission from './[id].page';
import { MissionStateService } from '../../core/services/mission-state.service';
import { MissionCatalogService } from '../../core/services/mission-catalog.service';
import { MissionTranslationService } from '../../core/services/mission-translation.service';

// The mock mission state below already carries full text (title/description/step
// content), so hydration is an identity pass-through — this spec tests page
// logic, not merging (see mission-translation.service.spec.ts for that).
const mockTranslationProvider = {
  provide: MissionTranslationService,
  useValue: { ready: () => true, hydrate: (mission: unknown) => mission },
};

const createMockState = (mission = true) => {
  const mockMission = mission
    ? {
        id: 'reactive-signals',
        title: 'Reactive Signals',
        description: 'Learn signals.',
        difficulty: 'beginner' as const,
        durationMinutes: 10,
        track: 'Fundamentals',
        tags: ['signals'],
        steps: [
          {
            id: 'concept',
            title: 'Concept',
            type: 'concept' as const,
            content: 'Signals are reactive.',
          },
          {
            id: 'summary',
            title: 'Summary',
            type: 'summary' as const,
            content: 'Great job.',
          },
        ],
        starterCode: '',
      }
    : undefined;

  return {
    mission: signal(mockMission),
    currentStepId: signal('concept'),
    stepCode: signal({ concept: 'code' }),
    completed: signal(false),
    currentStep: signal(mockMission?.steps[0]),
    stepIndex: signal(0),
    hasPrevious: signal(false),
    hasNext: signal(true),
    currentStepNumber: signal(1),
    progress: signal({ percentage: 50, currentStepNumber: 1, totalSteps: 2 }),
    selectMission: vi.fn(),
    selectStep: vi.fn(),
    previousStep: vi.fn(),
    nextStep: vi.fn(),
    updateCode: vi.fn(),
    resetMission: vi.fn(),
    markCompleted: vi.fn(),
  };
};

const createRoute = (id: string) => ({
  paramMap: of(new Map([['id', id]])),
});

describe('Mission page', () => {
  it('renders mission title and navigation', async () => {
    const mockState = createMockState();

    await render(Mission, {
      providers: [
        provideRouter([]),
        { provide: MissionStateService, useValue: mockState },
        { provide: MissionCatalogService, useValue: { getAll: () => [] } },
        mockTranslationProvider,
        { provide: ActivatedRoute, useValue: createRoute('reactive-signals') },
      ],
    });

    expect(screen.getByText(/reactive signals/i)).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /mission steps/i })).toBeTruthy();
  });

  it('shows not found when mission does not exist', async () => {
    const mockState = createMockState(false);

    await render(Mission, {
      providers: [
        provideRouter([]),
        { provide: MissionStateService, useValue: mockState },
        { provide: MissionCatalogService, useValue: { getAll: () => [] } },
        mockTranslationProvider,
        { provide: ActivatedRoute, useValue: createRoute('unknown-mission') },
      ],
    });

    expect(screen.getByText(/mission not found/i)).toBeTruthy();
  });
});
