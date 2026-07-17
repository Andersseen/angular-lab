import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from 'quartz-headless';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  handleError(error: unknown): void {
    console.error(error);
    this.toast.error(
      'Something went wrong. Try refreshing the page.',
      'Unexpected error'
    );
  }
}
