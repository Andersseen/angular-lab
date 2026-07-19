import { render, screen } from '@testing-library/angular';
import type { Badge } from '../../core/models/achievement.model';
import { BadgeTile } from './badge-tile';

function badge(overrides: Partial<Badge> = {}): Badge {
  return {
    id: 'five-missions',
    title: 'Getting Serious',
    description: 'Complete 5 missions.',
    category: 'milestone',
    earned: false,
    current: 2,
    target: 5,
    ...overrides,
  };
}

describe('BadgeTile', () => {
  it('shows the requirement and progress while unearned', async () => {
    await render(BadgeTile, { inputs: { badge: badge() } });

    expect(screen.getByText('Getting Serious')).toBeTruthy();
    expect(screen.getByText('Complete 5 missions.')).toBeTruthy();
    expect(screen.getByText('2 / 5')).toBeTruthy();
  });

  it('marks an earned badge and drops the progress counter', async () => {
    await render(BadgeTile, {
      inputs: { badge: badge({ earned: true, current: 5 }) },
    });

    expect(screen.getByText(/earned/i)).toBeTruthy();
    expect(screen.queryByText('5 / 5')).toBeNull();
  });
});
