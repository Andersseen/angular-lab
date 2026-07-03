import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'angular-lab:theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly mode = signal<ThemeMode>('dark');

  constructor() {
    this.loadSavedMode();
    this.apply();
  }

  toggle(): void {
    this.setMode(this.mode() === 'light' ? 'dark' : 'light');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.persist();
    this.apply();
  }

  private loadSavedMode(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
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
    if (this.mode() === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
}
