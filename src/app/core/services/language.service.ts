import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLang = 'en' | 'es' | 'uk';

export const LANGUAGES: { code: AppLang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'uk', label: 'Українська' },
];

const STORAGE_KEY = 'angular-lab:lang';

export function getInitialLang(): AppLang {
  if (typeof localStorage === 'undefined') {
    return 'en';
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'es' || saved === 'uk' ? saved : 'en';
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly lang = signal<AppLang>(getInitialLang());

  setLang(lang: AppLang): void {
    this.lang.set(lang);
    this.persist(lang);
    this.translate.use(lang);
  }

  private persist(lang: AppLang): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, lang);
  }
}
