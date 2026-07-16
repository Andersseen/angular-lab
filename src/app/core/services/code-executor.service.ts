import { Injectable, OnDestroy } from '@angular/core';
import {
  fromDiagnostic,
  fromRuntimeError,
  fromTimeout,
  fromUnsupportedModules,
  type FriendlyError,
} from '../playground/friendly-error';
import {
  PLAYGROUND_PARENT_SOURCE,
  PLAYGROUND_SANDBOX_SOURCE,
} from '../playground/runner-doc';

export type ExecutionResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: FriendlyError };

type TranspileOutcome =
  | { readonly ok: true; readonly js: string }
  | { readonly ok: false; readonly error: FriendlyError };

interface PendingRun {
  readonly iframe: HTMLIFrameElement;
  readonly resolve: (result: ExecutionResult) => void;
  readonly timer: ReturnType<typeof setTimeout>;
  readonly consoleErrors: string[];
}

interface ReadyWaiter {
  readonly resolve: (result: ExecutionResult) => void;
  readonly timer: ReturnType<typeof setTimeout>;
}

/** Time the sandbox has to answer before reporting a friendly timeout. */
export const SANDBOX_TIMEOUT_MS = 3000;

/**
 * Runs learner code inside a sandboxed preview iframe.
 *
 * Flow: transpile TypeScript in the parent (lazy-loaded `typescript`),
 * wait for the iframe's `ready` message, then post the compiled JS and
 * wait for `done` / `error`. See specs/playground.md for the contract.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeExecutorService implements OnDestroy {
  private nextRunId = 1;
  private typescript: Promise<typeof import('typescript')> | null = null;
  private listener: ((event: MessageEvent) => void) | null = null;

  private readonly readyIframes = new WeakSet<HTMLIFrameElement>();
  private readonly readyWaiters = new Map<HTMLIFrameElement, ReadyWaiter[]>();
  private readonly pendingRuns = new Map<number, PendingRun>();

  async run(code: string, iframe: HTMLIFrameElement): Promise<ExecutionResult> {
    const transpiled = await this.transpile(code);
    if (!transpiled.ok) {
      return transpiled;
    }

    const ready = await this.waitForReady(iframe);
    if (!ready.ok) {
      return ready;
    }

    return this.execute(transpiled.js, iframe);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener('message', this.listener);
      this.listener = null;
    }
  }

  private loadTypescript(): Promise<typeof import('typescript')> {
    this.typescript ??= import('typescript');
    return this.typescript;
  }

  private async transpile(code: string): Promise<TranspileOutcome> {
    const ts = await this.loadTypescript();

    if (this.usesModuleSyntax(ts, code)) {
      return { ok: false, error: fromUnsupportedModules() };
    }

    const output = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        // Snippets are self-contained classic scripts; `module: None` keeps
        // transpiled output runnable via `new Function` in the sandbox.
        module: ts.ModuleKind.None,
        strict: true,
        ignoreDeprecations: '6.0',
      },
      reportDiagnostics: true,
    });

    const errors = (output.diagnostics ?? []).filter(
      (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
    );

    if (errors.length > 0) {
      const first = errors[0];
      const line =
        first.file && typeof first.start === 'number'
          ? ts.getLineAndCharacterOfPosition(first.file, first.start).line + 1
          : 0;
      return {
        ok: false,
        error: fromDiagnostic(
          ts.flattenDiagnosticMessageText(first.messageText, ' '),
          line
        ),
      };
    }

    return { ok: true, js: output.outputText };
  }

  /** Playground snippets are self-contained: import/export is rejected up front. */
  private usesModuleSyntax(
    ts: typeof import('typescript'),
    code: string
  ): boolean {
    const sourceFile = ts.createSourceFile(
      'snippet.ts',
      code,
      ts.ScriptTarget.ES2022,
      true
    );

    let found = false;
    const visit = (node: import('typescript').Node): void => {
      if (found) {
        return;
      }
      if (
        ts.isImportDeclaration(node) ||
        ts.isImportEqualsDeclaration(node) ||
        ts.isExportDeclaration(node) ||
        ts.isExportAssignment(node)
      ) {
        found = true;
        return;
      }
      if (
        ts.canHaveModifiers(node) &&
        ts
          .getModifiers(node)
          ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        found = true;
        return;
      }
      node.forEachChild(visit);
    };
    visit(sourceFile);

    return found;
  }

  private waitForReady(iframe: HTMLIFrameElement): Promise<ExecutionResult> {
    if (this.readyIframes.has(iframe)) {
      return Promise.resolve({ ok: true });
    }

    this.ensureListener();

    return new Promise<ExecutionResult>((resolve) => {
      const waiter: ReadyWaiter = {
        resolve,
        timer: setTimeout(() => {
          this.removeReadyWaiter(iframe, waiter);
          resolve({ ok: false, error: fromTimeout() });
        }, SANDBOX_TIMEOUT_MS),
      };
      const waiters = this.readyWaiters.get(iframe) ?? [];
      waiters.push(waiter);
      this.readyWaiters.set(iframe, waiters);
    });
  }

  private execute(js: string, iframe: HTMLIFrameElement): Promise<ExecutionResult> {
    this.ensureListener();

    const id = this.nextRunId++;

    return new Promise<ExecutionResult>((resolve) => {
      const pending: PendingRun = {
        iframe,
        resolve,
        consoleErrors: [],
        timer: setTimeout(() => {
          this.pendingRuns.delete(id);
          resolve({ ok: false, error: fromTimeout() });
        }, SANDBOX_TIMEOUT_MS),
      };
      this.pendingRuns.set(id, pending);

      iframe.contentWindow?.postMessage(
        { source: PLAYGROUND_PARENT_SOURCE, type: 'run', id, code: js },
        '*'
      );
    });
  }

  private ensureListener(): void {
    if (this.listener) {
      return;
    }
    this.listener = (event: MessageEvent) => this.handleMessage(event);
    window.addEventListener('message', this.listener);
  }

  private handleMessage(event: MessageEvent): void {
    const data = event.data;
    if (
      !data ||
      typeof data !== 'object' ||
      data.source !== PLAYGROUND_SANDBOX_SOURCE
    ) {
      return;
    }

    if (data.type === 'ready') {
      this.handleReady(event);
      return;
    }

    const pending = this.pendingRuns.get(data.id);
    if (!pending || event.source !== pending.iframe.contentWindow) {
      return;
    }

    if (data.type === 'console') {
      if (data.level === 'error' && typeof data.text === 'string') {
        pending.consoleErrors.push(data.text);
      }
      return;
    }

    clearTimeout(pending.timer);
    this.pendingRuns.delete(data.id);

    if (data.type === 'done') {
      if (pending.consoleErrors.length > 0) {
        pending.resolve({
          ok: false,
          error: {
            title: 'Your code reported an error',
            message: pending.consoleErrors.join(' '),
          },
        });
      } else {
        pending.resolve({ ok: true });
      }
      return;
    }

    if (data.type === 'error') {
      pending.resolve({
        ok: false,
        error: fromRuntimeError({ name: data.name, message: data.message }),
      });
    }
  }

  private handleReady(event: MessageEvent): void {
    for (const [iframe, waiters] of this.readyWaiters) {
      if (event.source !== iframe.contentWindow) {
        continue;
      }
      this.readyIframes.add(iframe);
      this.readyWaiters.delete(iframe);
      for (const waiter of waiters) {
        clearTimeout(waiter.timer);
        waiter.resolve({ ok: true });
      }
    }
  }

  private removeReadyWaiter(
    iframe: HTMLIFrameElement,
    waiter: ReadyWaiter
  ): void {
    const waiters = this.readyWaiters.get(iframe);
    if (!waiters) {
      return;
    }
    const remaining = waiters.filter((entry) => entry !== waiter);
    if (remaining.length > 0) {
      this.readyWaiters.set(iframe, remaining);
    } else {
      this.readyWaiters.delete(iframe);
    }
  }
}
