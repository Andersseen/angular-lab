import { Injectable } from '@angular/core';

const STORAGE_KEY_PREFIX = 'angular-lab:v1';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private get storage(): Storage | undefined {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  }

  getItem<T>(key: string): T | undefined {
    const storage = this.storage;
    if (!storage) {
      return undefined;
    }

    try {
      const raw = storage.getItem(this.buildKey(key));
      if (raw === null) {
        return undefined;
      }
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    const storage = this.storage;
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(this.buildKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  removeItem(key: string): boolean {
    const storage = this.storage;
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(this.buildKey(key));
      return true;
    } catch {
      return false;
    }
  }

  /** Lists stored keys that belong to this app, with the prefix stripped. */
  keys(): string[] {
    const storage = this.storage;
    if (!storage) {
      return [];
    }

    try {
      const prefix = `${STORAGE_KEY_PREFIX}:`;
      const keys: string[] = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key?.startsWith(prefix)) {
          keys.push(key.slice(prefix.length));
        }
      }
      return keys;
    } catch {
      return [];
    }
  }

  private buildKey(key: string): string {
    return `${STORAGE_KEY_PREFIX}:${key}`;
  }
}
