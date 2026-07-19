import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { toDayKey } from '../achievements/streak';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

interface ActivityResponse {
  readonly days: string[];
}

const STORAGE_KEY = 'activity';
/** Matches the server window; streaks never look further back than this. */
const MAX_RETAINED_DAYS = 400;

/**
 * Practice days behind streaks (see specs/engagement.md). Local-first like
 * progress, but the set is append-only, so sync is a plain union: one PUT sends
 * what this device knows and receives everything the account knows.
 */
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  readonly days = signal<readonly string[]>(this.readLocal());

  constructor() {
    effect(() => {
      if (this.auth.user()) {
        // untracked: the sync reads `days` and writes it back, which would
        // otherwise make this effect re-trigger itself forever.
        untracked(() => this.syncWithRemote());
      }
    });
  }

  /** Records today as practised. A no-op after the first change of the day. */
  recordToday(): void {
    const today = toDayKey(new Date());
    if (this.days().includes(today)) {
      return;
    }

    this.writeLocal([...this.days(), today]);
    if (this.auth.isAuthenticated()) {
      this.syncWithRemote();
    }
  }

  private syncWithRemote(): void {
    this.http
      .put<ActivityResponse>(
        '/api/activity',
        { days: this.days() },
        { headers: { 'Cache-Control': 'no-store' } }
      )
      .subscribe({
        next: ({ days }) => this.writeLocal([...this.days(), ...days]),
        error: () => {
          // Local days are authoritative offline; the next practice day or
          // login retries the union.
        },
      });
  }

  private writeLocal(days: readonly string[]): void {
    const merged = [...new Set(days)].sort().slice(-MAX_RETAINED_DAYS);
    const current = this.days();
    if (
      merged.length === current.length &&
      merged.every((day, index) => day === current[index])
    ) {
      return;
    }

    this.storage.setItem<string[]>(STORAGE_KEY, merged);
    this.days.set(merged);
  }

  private readLocal(): string[] {
    const stored = this.storage.getItem<string[]>(STORAGE_KEY);
    return Array.isArray(stored)
      ? stored.filter((day): day is string => typeof day === 'string')
      : [];
  }
}
