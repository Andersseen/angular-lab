import { render, screen } from '@testing-library/angular';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('renders the eyebrow, heading and description', async () => {
    await render(
      '<app-page-header eyebrow="Learning paths" heading="Missions" description="Pick a mission and learn by doing."></app-page-header>',
      { imports: [PageHeader] }
    );

    expect(screen.getByRole('heading', { name: 'Missions' })).toBeTruthy();
    expect(screen.getByText('Learning paths')).toBeTruthy();
    expect(
      screen.getByText('Pick a mission and learn by doing.')
    ).toBeTruthy();
  });
});
