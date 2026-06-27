import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { Shell } from './shell';

describe('Shell', () => {
  it('renders the brand, navigation and footer', async () => {
    await render(Shell, {
      providers: [provideRouter([])],
    });

    expect(screen.getByRole('link', { name: /angular lab/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /home/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /demo mission/i })).toBeTruthy();
    expect(
      screen.getByText(/open source learning platform/i)
    ).toBeTruthy();
  });
});
