import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { FriendlyError } from '../../core/playground/friendly-error';
import { buildRunnerDoc } from '../../core/playground/runner-doc';
import { CodeExecutorService } from '../../core/services/code-executor.service';

/** Debounce so typing does not trigger a run on every keystroke. */
export const PREVIEW_DEBOUNCE_MS = 300;

type PreviewStatus = 'idle' | 'running' | 'ready' | 'error';

/**
 * Live preview panel: runs the learner's code in a sandboxed iframe
 * (`allow-scripts` only, no `allow-same-origin`) and surfaces friendly
 * errors. See specs/playground.md.
 */
@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [],
  template: `
    <div
      class="flex h-96 flex-col rounded-xl border border-line bg-surface-raised shadow-sm"
    >
      <div
        class="flex items-center justify-between border-b border-line px-4 py-2"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          Live preview
        </span>
        <span
          class="text-xs"
          [class.text-danger]="status() === 'error'"
          [class.text-ink-muted]="status() !== 'error'"
          aria-live="polite"
        >
          {{ statusLabel() }}
        </span>
      </div>

      <iframe
        #frame
        class="w-full flex-1 bg-surface-raised"
        sandbox="allow-scripts"
        [srcdoc]="runnerDoc"
        title="Code preview"
      ></iframe>

      @if (error(); as err) {
        <div
          role="alert"
          class="border-t border-danger/30 bg-danger/10 px-4 py-2"
        >
          <p class="text-xs font-semibold text-danger">
            {{ err.title }}
          </p>
          <p class="text-xs text-danger">{{ err.message }}</p>
        </div>
      }
    </div>
  `,
})
export class LivePreview {
  readonly code = input.required<string>();

  private readonly executor = inject(CodeExecutorService);
  private readonly frameRef =
    viewChild<ElementRef<HTMLIFrameElement>>('frame');

  protected readonly status = signal<PreviewStatus>('idle');
  protected readonly error = signal<FriendlyError | null>(null);

  protected readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'running':
        return 'Running…';
      case 'ready':
        return 'Up to date';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  });

  /**
   * The runner document is static and built by `buildRunnerDoc()`.
   * Angular sanitizes `srcdoc` as HTML and would strip the runner's
   * <script>, so the fixed document is trusted explicitly.
   */
  protected readonly runnerDoc: SafeHtml = inject(DomSanitizer)
    .bypassSecurityTrustHtml(buildRunnerDoc());

  private runSequence = 0;

  constructor() {
    effect((onCleanup) => {
      const code = this.code();
      const timer = setTimeout(() => {
        void this.execute(code);
      }, PREVIEW_DEBOUNCE_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  private async execute(code: string): Promise<void> {
    const iframe = this.frameRef()?.nativeElement;
    if (!iframe) {
      return;
    }

    const sequence = ++this.runSequence;
    this.status.set('running');

    const result = await this.executor.run(code, iframe);
    if (sequence !== this.runSequence) {
      return;
    }

    if (result.ok) {
      this.error.set(null);
      this.status.set('ready');
    } else {
      this.error.set(result.error);
      this.status.set('error');
    }
  }
}
