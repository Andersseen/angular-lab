import { render, screen } from '@testing-library/angular';
import { GradientIcon } from './gradient-icon';

describe('GradientIcon', () => {
  it('projects its icon content', async () => {
    await render(
      '<app-gradient-icon><span data-testid="icon">star</span></app-gradient-icon>',
      { imports: [GradientIcon] }
    );

    expect(screen.getByTestId('icon').textContent).toBe('star');
  });
});
