import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import Home from './index.page';

describe('Home', () => {
  it('renders the landing page and main CTA', async () => {
    await render(Home, {
      providers: [provideRouter([])],
    });

    expect(
      screen.getByRole('heading', { name: /learn angular by doing/i })
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /start demo mission/i })
    ).toBeTruthy();
    expect(screen.getByText('Missions')).toBeTruthy();
    expect(screen.getByText('Live Editor')).toBeTruthy();
    expect(screen.getByText('Comparisons')).toBeTruthy();
  });
});
