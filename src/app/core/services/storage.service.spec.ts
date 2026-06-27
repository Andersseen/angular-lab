import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    const getItem = vi.fn((key: string) => store[key] ?? null);
    const setItem = vi.fn((key: string, value: string) => {
      store[key] = value;
    });
    const removeItem = vi.fn((key: string) => {
      delete store[key];
    });

    Object.defineProperty(window, 'localStorage', {
      value: { getItem, setItem, removeItem },
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns undefined when no item is stored', () => {
    expect(service.getItem<unknown>('missing')).toBeUndefined();
  });

  it('stores and retrieves JSON values', () => {
    const value = { foo: 'bar', count: 42 };
    service.setItem('test-key', value);

    expect(service.getItem<typeof value>('test-key')).toEqual(value);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'angular-lab:v1:test-key',
      JSON.stringify(value)
    );
  });

  it('removes stored items', () => {
    service.setItem('to-remove', 'value');
    service.removeItem('to-remove');

    expect(service.getItem<string>('to-remove')).toBeUndefined();
  });

  it('returns undefined when localStorage throws on get', () => {
    window.localStorage.getItem = () => {
      throw new Error('Storage disabled');
    };

    expect(service.getItem<unknown>('error')).toBeUndefined();
  });

  it('returns false when localStorage throws on set', () => {
    window.localStorage.setItem = () => {
      throw new Error('Quota exceeded');
    };

    expect(service.setItem('error', 'value')).toBe(false);
  });
});
