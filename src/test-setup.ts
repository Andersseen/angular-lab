import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { TestBed } from '@angular/core/testing';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from '../public/i18n/en.json';

setupTestBed({ zoneless: true });

// Every spec renders real UI text through the `translate` pipe. Loading the actual
// en.json synchronously (instead of an HTTP fetch) keeps existing text-based
// assertions (`getByText('Sign in')`, etc.) working without touching any spec file.
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateLoader(() => ({ getTranslation: () => of(en) })),
      }),
    ],
  });
});
