import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import Missions from './missions.page';
import { MissionCatalogService } from '../core/services/mission-catalog.service';
import { MissionTranslationService } from '../core/services/mission-translation.service';

const MOCK_MISSIONS = [
  {
    id: 'reactive-signals',
    title: 'Reactive Signals',
    description: 'Learn signals.',
    difficulty: 'beginner' as const,
    durationMinutes: 10,
    track: 'Fundamentals',
    tags: ['signals'],
    steps: [],
    starterCode: '',
  },
  {
    id: 'modern-routing',
    title: 'Modern Angular Routing',
    description: 'Learn routing.',
    difficulty: 'intermediate' as const,
    durationMinutes: 20,
    track: 'Routing & Data',
    tags: ['router'],
    steps: [],
    starterCode: '',
  },
];

function renderMissions() {
  return render(Missions, {
    providers: [
      provideRouter([]),
      {
        provide: MissionCatalogService,
        useValue: {
          getAll: () => MOCK_MISSIONS,
          getTracks: () => ['Fundamentals', 'Routing & Data'],
        },
      },
      // Mock missions already carry full text (title/description), so hydration
      // is an identity pass-through — this spec tests page logic, not merging
      // (see mission-translation.service.spec.ts for that).
      {
        provide: MissionTranslationService,
        useValue: { ready: () => true, hydrate: (mission: unknown) => mission },
      },
    ],
  });
}

describe('Missions page', () => {
  it('renders the mission catalog', async () => {
    await renderMissions();

    expect(screen.getByRole('heading', { name: /missions/i })).toBeTruthy();
    expect(screen.getByText(/reactive signals/i)).toBeTruthy();
    expect(screen.getByText(/modern angular routing/i)).toBeTruthy();
  });

  it('filters missions by difficulty level', async () => {
    const user = userEvent.setup();
    await renderMissions();

    await user.click(screen.getByRole('button', { name: /intermediate/i }));

    expect(screen.getByText(/modern angular routing/i)).toBeTruthy();
    expect(screen.queryByText(/reactive signals/i)).toBeNull();
  });
});
