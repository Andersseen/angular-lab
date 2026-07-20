import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LANGUAGES,
  LanguageService,
  type AppLang,
} from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <label class="sr-only" for="language-switcher">{{
      'language.selectLabel' | translate
    }}</label>
    <select
      id="language-switcher"
      class="ml-1 h-9 rounded-lg border border-al-line bg-al-surface-raised px-2 text-sm text-al-ink"
      [attr.aria-label]="'language.selectLabel' | translate"
      (change)="onChange($event)"
    >
      @for (option of languages; track option.code) {
        <option [value]="option.code" [selected]="option.code === language.lang()">
          {{ option.label }}
        </option>
      }
    </select>
  `,
})
export class LanguageSwitcher {
  readonly language = inject(LanguageService);
  readonly languages = LANGUAGES;

  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as AppLang;
    this.language.setLang(value);
  }
}
