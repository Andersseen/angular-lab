import { TestBed } from '@angular/core/testing';
import { ToastService } from 'quartz-headless';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  it('logs the error and shows a friendly toast', () => {
    const toast = { error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ToastService, useValue: toast },
      ],
    });
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const handler = TestBed.inject(GlobalErrorHandler);

    const error = new Error('boom');
    handler.handleError(error);

    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong. Try refreshing the page.',
      'Unexpected error'
    );

    consoleSpy.mockRestore();
  });
});
