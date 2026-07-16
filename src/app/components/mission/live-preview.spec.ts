import { render, screen } from '@testing-library/angular';
import { vi } from 'vitest';
import { LivePreview } from './live-preview';
import { CodeExecutorService } from '../../core/services/code-executor.service';

const mockExecutor = (result: unknown = { ok: true }) => ({
  provide: CodeExecutorService,
  useValue: { run: vi.fn().mockResolvedValue(result) },
});

describe('LivePreview', () => {
  it('renders a sandboxed iframe that cannot touch the host page', async () => {
    await render(LivePreview, {
      componentInputs: { code: 'let a = 1;' },
      providers: [mockExecutor()],
    });

    const iframe = screen.getByTitle('Code preview');
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
    expect(iframe.getAttribute('sandbox')).not.toContain('allow-same-origin');
  });

  it('labels the panel as a live preview', async () => {
    await render(LivePreview, {
      componentInputs: { code: 'let a = 1;' },
      providers: [mockExecutor()],
    });

    expect(screen.getByText(/live preview/i)).toBeTruthy();
  });

  it('runs the executor with the current code', async () => {
    const provider = mockExecutor();
    await render(LivePreview, {
      componentInputs: { code: 'let a = 1;' },
      providers: [provider],
    });

    await vi.waitFor(
      () => {
        expect(provider.useValue.run).toHaveBeenCalledWith(
          'let a = 1;',
          expect.anything()
        );
      },
      { timeout: 2000 }
    );
  });

  it('shows a friendly error when execution fails', async () => {
    await render(LivePreview, {
      componentInputs: { code: 'const x = ;' },
      providers: [
        mockExecutor({
          ok: false,
          error: {
            title: 'Your code could not be compiled',
            message: 'Line 1: Expression expected.',
          },
        }),
      ],
    });

    const alert = await screen.findByRole('alert', {}, { timeout: 2000 });
    expect(alert.textContent).toContain('Your code could not be compiled');
    expect(alert.textContent).toContain('Line 1: Expression expected.');
  });

  it('clears the error after a successful run', async () => {
    const run = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        error: { title: 'Syntax error', message: 'Check brackets.' },
      })
      .mockResolvedValue({ ok: true });

    const { rerender } = await render(LivePreview, {
      componentInputs: { code: 'const x = ;' },
      providers: [{ provide: CodeExecutorService, useValue: { run } }],
    });

    await screen.findByRole('alert', {}, { timeout: 2000 });

    await rerender({ componentInputs: { code: 'let a = 1;' } });

    await vi.waitFor(
      () => {
        expect(screen.queryByRole('alert')).toBeNull();
      },
      { timeout: 2000 }
    );
  });
});
