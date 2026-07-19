import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { PasswordToggle } from './password-toggle';

describe('PasswordToggle', () => {
  it('starts hidden and offers to show the password', async () => {
    await render(PasswordToggle);

    expect(screen.getByRole('button', { name: 'Show password' })).toBeTruthy();
  });

  it('flips the label and value when pressed', async () => {
    const { fixture } = await render(PasswordToggle);

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));

    expect(screen.getByRole('button', { name: 'Hide password' })).toBeTruthy();
    expect(fixture.componentInstance.visible()).toBe(true);
  });
});
