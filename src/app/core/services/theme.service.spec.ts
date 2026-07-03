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
        get matches() {
          return currentMatches;
        },
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

    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('adds dark class when system prefers dark mode', () => {
    currentMatches = true;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(service.mode()).toBe('system');
    service.ngOnDestroy();
  });

  it('does not add dark class when system prefers light mode', () => {
    currentMatches = false;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    service.ngOnDestroy();
  });

  it('reacts to system theme changes when in system mode', () => {
    currentMatches = false;
    const service = new ThemeService();

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    currentMatches = true;
    listeners.forEach((listener) =>
      listener({ matches: true } as MediaQueryListEvent)
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.ngOnDestroy();
  });

  it('applies light mode explicitly', () => {
    currentMatches = true;
    const service = new ThemeService();
    service.setMode('light');

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    service.ngOnDestroy();
  });

  it('applies dark mode explicitly', () => {
    currentMatches = false;
    const service = new ThemeService();
    service.setMode('dark');

    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.ngOnDestroy();
  });

  it('persists selected mode in localStorage', () => {
    const service = new ThemeService();
    service.setMode('dark');

    expect(localStorage.getItem('angular-lab:theme')).toBe('dark');
    service.ngOnDestroy();
  });

  it('restores saved mode from localStorage', () => {
    localStorage.setItem('angular-lab:theme', 'light');
    currentMatches = true;

    const service = new ThemeService();

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    service.ngOnDestroy();
  });

  it('cycles through modes on toggle', () => {
    const service = new ThemeService();
    expect(service.mode()).toBe('system');

    service.toggle();
    expect(service.mode()).toBe('light');

    service.toggle();
    expect(service.mode()).toBe('dark');

    service.toggle();
    expect(service.mode()).toBe('system');

    service.ngOnDestroy();
  });

  it('ignores system changes when a manual mode is active', () => {
    currentMatches = false;
    const service = new ThemeService();
    service.setMode('light');

    currentMatches = true;
    listeners.forEach((listener) =>
      listener({ matches: true } as MediaQueryListEvent)
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    service.ngOnDestroy();
  });
});
