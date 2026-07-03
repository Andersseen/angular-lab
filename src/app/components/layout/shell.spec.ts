import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { signal } from '@angular/core';
import { Shell } from './shell';
import { AuthService } from '../../core/services/auth.service';

describe('Shell', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it('renders the brand, navigation and footer', async () => {
    await render(Shell, {
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: signal(null),
            isAuthenticated: () => false,
            isGuest: () => true,
          },
        },
      ],
    });

    expect(screen.getByRole('link', { name: /angular lab/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /home/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /missions/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /log in/i })).toBeTruthy();
    expect(screen.getByText(/open source learning platform/i)).toBeTruthy();
  });

  it('shows dashboard link when user is authenticated', async () => {
    await render(Shell, {
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: signal({ id: '1', email: 'a@b.com', name: 'Ada' }),
            isAuthenticated: () => true,
            isGuest: () => false,
          },
        },
      ],
    });

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
  });
});
