import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  it('is not rendered while closed', async () => {
    await render(ConfirmDialog, {
      componentInputs: { open: false, title: 'Delete?', message: 'Are you sure?' },
    });

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('renders a labelled dialog and emits confirm / cancel', async () => {
    const user = userEvent.setup();
    const { fixture } = await render(ConfirmDialog, {
      componentInputs: {
        open: true,
        title: 'Delete account',
        message: 'This cannot be undone.',
        confirmLabel: 'Delete',
        variant: 'danger',
      },
    });
    const confirmSpy = vi.fn();
    const cancelSpy = vi.fn();
    fixture.componentInstance.confirm.subscribe(confirmSpy);
    fixture.componentInstance.dismiss.subscribe(cancelSpy);

    const dialog = screen.getByRole('alertdialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByText('Delete account')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(confirmSpy).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('emits cancel on Escape', async () => {
    const user = userEvent.setup();
    const { fixture } = await render(ConfirmDialog, {
      componentInputs: { open: true, title: 'Reset?', message: 'Start over?' },
    });
    const cancelSpy = vi.fn();
    fixture.componentInstance.dismiss.subscribe(cancelSpy);

    await user.keyboard('{Escape}');

    expect(cancelSpy).toHaveBeenCalled();
  });
});
