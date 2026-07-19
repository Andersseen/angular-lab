import { render, screen } from '@testing-library/angular';
import { Alert } from './alert';

describe('Alert', () => {
  it('renders a title and projected message with a polite status role', async () => {
    await render(
      '<app-alert variant="success" title="Saved">Your changes are stored</app-alert>',
      { imports: [Alert] }
    );

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Your changes are stored')).toBeTruthy();
  });

  it('announces danger variants assertively via role=alert', async () => {
    await render('<app-alert variant="danger">Something broke</app-alert>', {
      imports: [Alert],
    });

    expect(screen.getByRole('alert').textContent).toContain('Something broke');
  });
});
