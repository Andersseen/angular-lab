import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import type { MissionState, ProgressEntry } from '../models/mission.model';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

interface ProgressListResponse {
  readonly progress: ProgressEntry[];
}

interface ProgressPutResponse {
  readonly progress: ProgressEntry;
  readonly conflict?: boolean;
}

const SYNC_DEBOUNCE_MS = 600;

@Injectable({
  providedIn: 'root',
})
export class ProgressSyncService {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly localProgress = signal<ProgressEntry[]>(this.readLocalProgress());

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.mergeLocalWithRemote();
      } else if (user === null) {
        this.refreshLocalProgress();
      }
    });
  }

  queueLocalChange(state: MissionState): void {
    this.refreshLocalProgress();

    if (!this.auth.isAuthenticated()) {
      return;
    }

    const entry = this.stateToEntry(state);
    const existingTimer = this.pendingTimers.get(entry.missionId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.pendingTimers.delete(entry.missionId);
      this.push(entry);
    }, SYNC_DEBOUNCE_MS);

    this.pendingTimers.set(entry.missionId, timer);
  }

  refreshLocalProgress(): void {
    this.localProgress.set(this.readLocalProgress());
  }

  private mergeLocalWithRemote(): void {
    this.http
      .get<ProgressListResponse>('/api/progress', {
        headers: { 'Cache-Control': 'no-store' },
      })
      .subscribe({
        next: ({ progress }) => {
          const local = new Map(this.readLocalProgress().map((entry) => [entry.missionId, entry]));
          const remote = new Map(progress.map((entry) => [entry.missionId, entry]));
          const missionIds = new Set([...local.keys(), ...remote.keys()]);

          for (const missionId of missionIds) {
            const localEntry = local.get(missionId);
            const remoteEntry = remote.get(missionId);
            const winner = this.chooseWinner(localEntry, remoteEntry);
            if (!winner) {
              continue;
            }

            this.writeLocalEntry(winner);
            if (winner === localEntry) {
              this.push(winner);
            }
          }

          this.refreshLocalProgress();
        },
        error: () => this.refreshLocalProgress(),
      });
  }

  private push(entry: ProgressEntry): void {
    this.http.put<ProgressPutResponse>('/api/progress', entry).subscribe({
      next: ({ progress }) => {
        this.writeLocalEntry(progress);
        this.refreshLocalProgress();
      },
      error: () => {
        // Local progress is authoritative for offline use; a later login/change retries.
      },
    });
  }

  private chooseWinner(
    localEntry: ProgressEntry | undefined,
    remoteEntry: ProgressEntry | undefined
  ): ProgressEntry | undefined {
    if (!localEntry) {
      return remoteEntry;
    }
    if (!remoteEntry) {
      return localEntry;
    }
    return remoteEntry.updatedAt >= localEntry.updatedAt ? remoteEntry : localEntry;
  }

  private readLocalProgress(): ProgressEntry[] {
    return this.storage
      .keys()
      .filter((key) => key.startsWith('mission:'))
      .map((key) => this.storage.getItem<MissionState>(key))
      .filter((state): state is MissionState => !!state?.missionId)
      .map((state) => this.stateToEntry(state))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  private writeLocalEntry(entry: ProgressEntry): void {
    this.storage.setItem<MissionState>(`mission:${entry.missionId}`, {
      missionId: entry.missionId,
      currentStepId: entry.currentStepId,
      stepCode: { ...entry.stepCode },
      completed: entry.completed,
      completedAt: entry.completedAt ?? null,
      updatedAt: entry.updatedAt,
    });
  }

  private stateToEntry(state: MissionState): ProgressEntry {
    return {
      missionId: state.missionId,
      currentStepId: state.currentStepId,
      stepCode: { ...state.stepCode },
      completed: state.completed,
      completedAt: state.completedAt ?? null,
      updatedAt: state.updatedAt ?? 0,
    };
  }
}
