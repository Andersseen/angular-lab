import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let listeners: ((event: MediaQueryListEvent) => void)[];
  let currentMatches: boolean;

  beforeEach(() => {
    listeners = [];
    currentMatches = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        addEventListener: (
          _event: string,
          listener: (event: MediaQueryListEvent) => void
        ) => {
          listeners.push(listener);
        },
        removeEventListener: (
          _event: string,
          listener: (event: MediaQueryListEvent) => void
        ) => {
          listeners = listeners.filter((cb) => cb !== listener);
        },
      })),
    });

    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('adds dark class when system prefers dark mode', () => {
    currentMatches = true;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.ngOnDestroy();
  });

  it('does not add dark class when system prefers light mode', () => {
    currentMatches = false;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    service.ngOnDestroy();
  });

  it('reacts to system theme changes', () => {
    currentMatches = false;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    listeners.forEach((listener) =>
      listener({ matches: true } as MediaQueryListEvent)
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.ngOnDestroy();
  });
});
