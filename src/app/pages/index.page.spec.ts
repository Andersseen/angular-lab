import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import Home from './index.page';
import { MissionCatalogService } from '../core/services/mission-catalog.service';

describe('Home', () => {
  it('renders the landing page and main CTA', async () => {
    await render(Home, {
      providers: [
        provideRouter([]),
        {
          provide: MissionCatalogService,
          useValue: {
            getAll: () => [
              {
                id: 'reactive-signals',
                title: 'Reactive Signals',
                description: '',
                difficulty: 'beginner',
                durationMinutes: 10,
                track: 'Fundamentals',
                tags: [],
                steps: [],
                starterCode: '',
              },
            ],
          },
        },
      ],
    });

    expect(
      screen.getByRole('heading', { name: /learn angular by doing/i })
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /browse missions/i })
    ).toBeTruthy();
    expect(screen.getByText('Missions')).toBeTruthy();
    expect(screen.getByText('Live Editor')).toBeTruthy();
    expect(screen.getByText('Comparisons')).toBeTruthy();
  });
});
