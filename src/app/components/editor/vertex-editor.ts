import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  model,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';

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
      [attr.value]="value()"
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

  ngOnInit(): void {
    const editor = this.editorRef().nativeElement;

    this.changeListener = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const next = typeof detail === 'string' ? detail : detail?.value ?? '';
      this.value.set(next);
    };

    editor.addEventListener('change', this.changeListener);
  }

  ngOnDestroy(): void {
    if (this.changeListener) {
      this.editorRef().nativeElement.removeEventListener(
        'change',
        this.changeListener
      );
    }
  }
}
