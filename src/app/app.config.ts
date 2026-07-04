import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideMovement } from 'angular-movement';
import { provideVoltTheme } from '@voltui/components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideMovement({
      duration: 320,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }),
    provideVoltTheme({
      color: 'volt',
      style: 'soft',
    }),
    provideFileRouter(),
    provideHttpClient(withInterceptors([requestContextInterceptor])),
  ],
};
