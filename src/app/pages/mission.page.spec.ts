import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { StorageService } from '../core/services/storage.service';
import Mission from './mission.page';

const DEMO_MISSION_ID = 'reactive-signals';

describe('Mission', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    const storage = new StorageService();
    storage.removeItem(`mission:${DEMO_MISSION_ID}`);
  });

  it('renders the demo mission header and first step', async () => {
    await render(Mission, {
      providers: [provideRouter([])],
    });

    expect(
      screen.getByRole('heading', { name: /reactive signals/i })
    ).toBeTruthy();
    expect(screen.getByText(/signals are the core reactive primitive/i)).toBeTruthy();
  });

  it('navigates to the next step when Next is clicked', async () => {
    const user = userEvent.setup();
    await render(Mission, {
      providers: [provideRouter([])],
    });

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText(/the editor below contains a tiny component/i)).toBeTruthy();
  });

  it('disables the Previous button on the first step', async () => {
    await render(Mission, {
      providers: [provideRouter([])],
    });

    expect(
      screen.getByRole('button', { name: /previous/i }).getAttribute('disabled')
    ).toBe('');
  });

  it('resets mission progress when Reset is clicked', async () => {
    const user = userEvent.setup();
    await render(Mission, {
      providers: [provideRouter([])],
    });

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText(/signals are the core reactive primitive/i)).toBeTruthy();
  });
});
