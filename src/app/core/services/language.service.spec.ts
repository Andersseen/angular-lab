import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to English', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('en');
  });

  it('restores a saved language from localStorage', () => {
    localStorage.setItem('angular-lab:lang', 'uk');

    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('uk');
  });

  it('sets and persists the selected language', () => {
    const service = TestBed.inject(LanguageService);

    service.setLang('es');

    expect(service.lang()).toBe('es');
    expect(localStorage.getItem('angular-lab:lang')).toBe('es');
  });

  it('ignores an unsupported saved language and falls back to English', () => {
    localStorage.setItem('angular-lab:lang', 'fr');

    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('en');
  });
});
