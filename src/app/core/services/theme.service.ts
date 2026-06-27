import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly mediaQuery: MediaQueryList | undefined;
  private readonly listener: (event: MediaQueryListEvent) => void;

  constructor() {
    this.mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : undefined;

    this.listener = (event) => {
      this.applyDarkMode(event.matches);
    };

    this.applyDarkMode(this.mediaQuery?.matches ?? false);

    if (this.mediaQuery) {
      this.mediaQuery.addEventListener('change', this.listener);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.listener);
    }
  }

  private applyDarkMode(isDark: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
