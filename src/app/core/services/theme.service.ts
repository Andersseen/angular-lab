import { Injectable, OnDestroy, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'angular-lab:theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly mediaQuery: MediaQueryList | undefined;
  private readonly systemChangeListener: (event: MediaQueryListEvent) => void;

  readonly mode = signal<ThemeMode>('system');

  constructor() {
    this.mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : undefined;

    this.systemChangeListener = () => {
      if (this.mode() === 'system') {
        this.apply();
      }
    };

    this.loadSavedMode();
    this.apply();

    this.mediaQuery?.addEventListener('change', this.systemChangeListener);
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.systemChangeListener);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.persist();
    this.apply();
  }

  toggle(): void {
    const current = this.mode();
    const next: ThemeMode =
      current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setMode(next);
  }

  private loadSavedMode(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      this.mode.set(saved);
    }
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, this.mode());
  }

  private apply(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const isDark =
      this.mode() === 'dark' ||
      (this.mode() === 'system' && !!this.mediaQuery?.matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
