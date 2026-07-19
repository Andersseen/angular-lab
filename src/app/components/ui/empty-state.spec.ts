import { render, screen } from '@testing-library/angular';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the title, message and projected action', async () => {
    await render(
      '<app-empty-state title="Mission not found" message="It may have moved."><button data-slot="action">Back to missions</button></app-empty-state>',
      { imports: [EmptyState] }
    );

    expect(
      screen.getByRole('heading', { name: 'Mission not found' })
    ).toBeTruthy();
    expect(screen.getByText('It may have moved.')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Back to missions' })
    ).toBeTruthy();
  });
});
