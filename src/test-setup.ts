import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from '../public/i18n/en.json';

setupTestBed({ zoneless: true });

// Every spec renders real UI text through the `translate` pipe. Loading the actual
// en.json synchronously (instead of an HTTP fetch) keeps existing text-based
// assertions (`getByText('Sign in')`, etc.) working without touching any spec file.
//
// HttpClient is provided (with the testing backend, so nothing hits the network)
// because MissionTranslationService injects it; the default test language is
// 'en', so its effect never actually issues a request in specs that don't opt in.
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateLoader(() => ({ getTranslation: () => of(en) })),
      }),
    ],
  });
});
