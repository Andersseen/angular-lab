import { vi } from 'vitest';
import {
  CodeExecutorService,
  SANDBOX_TIMEOUT_MS,
} from './code-executor.service';
import { PLAYGROUND_SANDBOX_SOURCE } from '../playground/runner-doc';

function createFakeIframe() {
  const contentWindow = { postMessage: vi.fn() };
  const iframe = { contentWindow } as unknown as HTMLIFrameElement;
  return { iframe, contentWindow };
}

function dispatchSandboxMessage(source: object, data: unknown): void {
  const event = new MessageEvent('message', { data });
  Object.defineProperty(event, 'source', { value: source });
  window.dispatchEvent(event);
}

function sandboxReady(contentWindow: object): void {
  dispatchSandboxMessage(contentWindow, {
    source: PLAYGROUND_SANDBOX_SOURCE,
    type: 'ready',
  });
}

interface RunMessage {
  type: 'run';
  id: number;
  code: string;
}

/**
 * Answers the service's readiness ping until the sandbox is marked ready
 * and the service posts the `run` message, then returns it.
 */
async function waitForRunMessage(contentWindow: {
  postMessage: ReturnType<typeof vi.fn>;
}): Promise<RunMessage> {
  let runMessage: RunMessage | undefined;
  await vi.waitFor(() => {
    sandboxReady(contentWindow);
    runMessage = contentWindow.postMessage.mock.calls
      .map((call) => call[0] as RunMessage | undefined)
      .find((message) => message?.type === 'run');
    expect(runMessage).toBeTruthy();
  });
  return runMessage as RunMessage;
}

describe('CodeExecutorService', () => {
  let service: CodeExecutorService;

  beforeEach(() => {
    service = new CodeExecutorService();
  });

  afterEach(() => {
    service.ngOnDestroy();
    vi.useRealTimers();
  });

  it('reports transpile errors in plain language without touching the iframe', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const result = await service.run('const x = ;', iframe);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe('Your code could not be compiled');
      expect(result.error.message).toContain('Line 1');
    }
    expect(contentWindow.postMessage).not.toHaveBeenCalled();
  });

  it('rejects snippets with import/export statements', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const result = await service.run(
      'import { signal } from "@angular/core";\nlet a = 1;',
      iframe
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe(
        'Imports are not supported in the playground'
      );
    }
    expect(contentWindow.postMessage).not.toHaveBeenCalled();
  });

  it('resolves ok when the sandbox answers done', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const resultPromise = service.run('let a = 1;', iframe);

    const runMessage = await waitForRunMessage(contentWindow);
    dispatchSandboxMessage(contentWindow, {
      source: PLAYGROUND_SANDBOX_SOURCE,
      type: 'done',
      id: runMessage.id,
    });

    await expect(resultPromise).resolves.toEqual({ ok: true });
  });

  it('maps runtime errors from the sandbox to friendly errors', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const resultPromise = service.run('missingFn();', iframe);

    const runMessage = await waitForRunMessage(contentWindow);
    dispatchSandboxMessage(contentWindow, {
      source: PLAYGROUND_SANDBOX_SOURCE,
      type: 'error',
      id: runMessage.id,
      name: 'ReferenceError',
      message: 'missingFn is not defined',
    });

    const result = await resultPromise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe('Something is not defined');
      expect(result.error.message).toContain('missingFn is not defined');
    }
  });

  it('surfaces console errors instead of leaving them console-only', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const resultPromise = service.run('let a = 1;', iframe);

    const runMessage = await waitForRunMessage(contentWindow);
    dispatchSandboxMessage(contentWindow, {
      source: PLAYGROUND_SANDBOX_SOURCE,
      type: 'console',
      id: runMessage.id,
      level: 'error',
      text: 'boom',
    });
    dispatchSandboxMessage(contentWindow, {
      source: PLAYGROUND_SANDBOX_SOURCE,
      type: 'done',
      id: runMessage.id,
    });

    const result = await resultPromise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe('Your code reported an error');
      expect(result.error.message).toContain('boom');
    }
  });

  it('pings the sandbox while waiting for readiness', async () => {
    const { iframe, contentWindow } = createFakeIframe();

    const resultPromise = service.run('let a = 1;', iframe);

    await vi.waitFor(() => {
      const pinged = contentWindow.postMessage.mock.calls.some(
        (call) => (call[0] as { type?: string } | undefined)?.type === 'ping'
      );
      expect(pinged).toBe(true);
    });

    const runMessage = await waitForRunMessage(contentWindow);
    dispatchSandboxMessage(contentWindow, {
      source: PLAYGROUND_SANDBOX_SOURCE,
      type: 'done',
      id: runMessage.id,
    });
    await expect(resultPromise).resolves.toEqual({ ok: true });
  });

  it('ignores messages from other sources', async () => {
    const { iframe, contentWindow } = createFakeIframe();
    vi.useFakeTimers();

    const resultPromise = service.run('let a = 1;', iframe);

    // Let the transpile finish and the ready wait begin.
    await vi.advanceTimersByTimeAsync(0);

    dispatchSandboxMessage(contentWindow, {
      source: 'evil-page',
      type: 'ready',
    });

    await vi.advanceTimersByTimeAsync(SANDBOX_TIMEOUT_MS + 1);

    const result = await resultPromise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe('The preview is not responding');
    }
  });

  it('times out with a friendly message when the sandbox never answers', async () => {
    const { iframe } = createFakeIframe();
    vi.useFakeTimers();

    const resultPromise = service.run('let a = 1;', iframe);
    await vi.advanceTimersByTimeAsync(SANDBOX_TIMEOUT_MS + 1);

    const result = await resultPromise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.title).toBe('The preview is not responding');
    }
  });
});
