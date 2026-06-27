import { Component, signal } from '@angular/core';
import { render, waitFor } from '@testing-library/angular';
import { VertexEditor } from './vertex-editor';

class FakeVertexEditor extends HTMLElement {
  private _value = '';

  static get observedAttributes(): string[] {
    return ['language', 'theme', 'value'];
  }

  get value(): string {
    return this._value;
  }

  set value(next: string) {
    this._value = next;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (name === 'value' && newValue !== null) {
      this._value = newValue;
    }
  }

  emitChange(value: string): void {
    this._value = value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value },
        bubbles: true,
      })
    );
  }
}

@Component({
  standalone: true,
  imports: [VertexEditor],
  template: `
    <app-vertex-editor
      [value]="value()"
      (valueChange)="value.set($event)"
    />
  `,
})
class TestHost {
  readonly value = signal('initial');
}

describe('VertexEditor', () => {
  beforeEach(() => {
    if (!customElements.get('vertex-editor')) {
      customElements.define('vertex-editor', FakeVertexEditor);
    }
  });

  it('renders the custom element with default attributes', async () => {
    await render(VertexEditor);

    const editor = document.querySelector('vertex-editor');
    expect(editor).toBeTruthy();
    expect(editor?.getAttribute('language')).toBe('typescript');
    expect(editor?.getAttribute('theme')).toBe('dark');
  });

  it('propagates value changes from the custom element to the host', async () => {
    const { fixture } = await render(TestHost);
    const host = fixture.componentInstance;

    // Allow ngOnInit to finish registering the change listener.
    await Promise.resolve();
    await Promise.resolve();

    const editor = document.querySelector('vertex-editor') as FakeVertexEditor;
    editor.emitChange('updated value');

    await waitFor(() => {
      expect(host.value()).toBe('updated value');
    });
  });
});
