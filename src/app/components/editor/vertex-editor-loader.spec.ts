import { loadVertexEditorScript } from './vertex-editor-loader';

describe('loadVertexEditorScript', () => {
  afterEach(() => {
    document
      .querySelectorAll('script[src="/vertex-editor/web-editor.min.js"]')
      .forEach((el) => el.remove());
  });

  it('resolves immediately when the custom element is already defined', async () => {
    class FakeVertexEditor extends HTMLElement {}
    if (!customElements.get('vertex-editor')) {
      customElements.define('vertex-editor', FakeVertexEditor);
    }

    await expect(loadVertexEditorScript()).resolves.toBeUndefined();
    expect(
      document.querySelector('script[src="/vertex-editor/web-editor.min.js"]')
    ).toBeNull();
  });
});
