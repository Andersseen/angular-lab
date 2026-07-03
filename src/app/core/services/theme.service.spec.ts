import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
    localStorage.clear();
  });

  it('defaults to dark mode', () => {
    const service = new ThemeService();

    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('applies light mode', () => {
    const service = new ThemeService();
    service.setMode('light');

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('toggles between light and dark', () => {
    const service = new ThemeService();
    expect(service.mode()).toBe('dark');

    service.toggle();
    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    service.toggle();
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists selected mode in localStorage', () => {
    const service = new ThemeService();
    service.setMode('light');

    expect(localStorage.getItem('angular-lab:theme')).toBe('light');
  });

  it('restores saved mode from localStorage', () => {
    localStorage.setItem('angular-lab:theme', 'light');

    const service = new ThemeService();

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
