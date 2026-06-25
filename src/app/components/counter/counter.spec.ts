import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Counter } from './counter';

describe('Counter', () => {
  it('starts at zero', async () => {
    await render(Counter);

    expect(screen.getByTestId('counter-count').textContent).toBe('0');
  });

  it('increments the displayed count when the increment button is clicked', async () => {
    const user = userEvent.setup();
    await render(Counter);

    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByTestId('counter-count').textContent).toBe('2');
  });

  it('decrements the displayed count when the decrement button is clicked', async () => {
    const user = userEvent.setup();
    await render(Counter);

    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /decrement/i }));

    expect(screen.getByTestId('counter-count').textContent).toBe('1');
  });

  it('resets the displayed count to zero', async () => {
    const user = userEvent.setup();
    await render(Counter);

    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByTestId('counter-count').textContent).toBe('0');
  });
});
