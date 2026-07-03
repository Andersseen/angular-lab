import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import Missions from './missions.page';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

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
    track: 'Routing',
    tags: ['router'],
    steps: [],
    starterCode: '',
  },
];

describe('Missions page', () => {
  it('renders the mission catalog', async () => {
    await render(Missions, {
      providers: [
        provideRouter([]),
        {
          provide: MissionCatalogService,
          useValue: {
            getAll: () => MOCK_MISSIONS,
            getTracks: () => ['Fundamentals', 'Routing'],
          },
        },
      ],
    });

    expect(screen.getByRole('heading', { name: /missions/i })).toBeTruthy();
    expect(screen.getByText(/reactive signals/i)).toBeTruthy();
    expect(screen.getByText(/modern angular routing/i)).toBeTruthy();
  });
});
