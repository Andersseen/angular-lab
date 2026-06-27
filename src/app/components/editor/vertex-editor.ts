import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  model,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';

interface VertexEditorChangeDetail {
  value?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vertex-editor': HTMLElement;
  }
}

/**
 * Angular wrapper for the Vertex Editor web component.
 *
 * The underlying `<vertex-editor>` custom element is loaded from
 * `/vertex-editor/web-editor.min.js` in `index.html`.
 */
@Component({
  selector: 'app-vertex-editor',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <vertex-editor
      #editor
      class="block h-full w-full rounded-lg"
      [attr.language]="language()"
      [attr.theme]="theme()"
    ></vertex-editor>
  `,
})
export class VertexEditor implements OnInit, OnDestroy {
  readonly language = input<string>('typescript');
  readonly theme = input<string>('dark');
  readonly value = model<string>('');

  private readonly editorRef =
    viewChild.required<ElementRef<HTMLElement>>('editor');
  private changeListener?: (event: Event) => void;
  private isReady = false;

  constructor() {
    effect(() => {
      if (!this.isReady) {
        return;
      }
      this.setAttribute('language', this.language());
    });

    effect(() => {
      if (!this.isReady) {
        return;
      }
      this.setAttribute('theme', this.theme());
    });
  }

  async ngOnInit(): Promise<void> {
    if (typeof customElements === 'undefined') {
      return;
    }

    try {
      await customElements.whenDefined('vertex-editor');
    } catch {
      return;
    }

    const editor = this.editorRef().nativeElement;
    this.setAttribute('value', this.value());

    this.changeListener = (event: Event) => {
      const detail = (event as CustomEvent<VertexEditorChangeDetail | string>)
        .detail;
      const next =
        typeof detail === 'string' ? detail : detail?.value ?? this.value();
      this.value.set(next);
    };

    editor.addEventListener('change', this.changeListener);
    this.isReady = true;
  }

  ngOnDestroy(): void {
    if (this.changeListener) {
      try {
        this.editorRef().nativeElement.removeEventListener(
          'change',
          this.changeListener
        );
      } catch {
        // The element may already be detached; ignore cleanup errors.
      }
    }
  }

  private setAttribute(name: string, value: string): void {
    try {
      this.editorRef().nativeElement.setAttribute(name, value);
    } catch {
      // Ignore if the element is not available.
    }
  }
}
