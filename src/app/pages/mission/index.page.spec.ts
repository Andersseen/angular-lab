import { provideRouter, Router } from '@angular/router';
import { render } from '@testing-library/angular';
import { vi } from 'vitest';
import MissionRedirect from './index.page';

describe('MissionRedirect', () => {
  it('redirects to /missions', async () => {
    const navigateSpy = vi.fn();
    const router = { navigate: navigateSpy } as unknown as Router;

    await render(MissionRedirect, {
      providers: [provideRouter([]), { provide: Router, useValue: router }],
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/missions']);
  });
});
