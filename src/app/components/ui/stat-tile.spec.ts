import { render, screen } from '@testing-library/angular';
import { StatTile } from './stat-tile';

describe('StatTile', () => {
  it('renders the label and value', async () => {
    await render('<app-stat-tile label="Completed" value="42"></app-stat-tile>', {
      imports: [StatTile],
    });

    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });
});
