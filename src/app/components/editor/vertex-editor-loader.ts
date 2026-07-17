/**
 * Loads the Vertex Editor web component script on first use, instead of
 * globally on every page (see context.md Decision 4/8). Idempotent: safe to
 * call from every `VertexEditor` instance.
 */
let loadPromise: Promise<void> | undefined;

export function loadVertexEditorScript(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (customElements.get('vertex-editor')) {
    return Promise.resolve();
  }

  if (!loadPromise) {
    loadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/vertex-editor/web-editor.min.js';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load the Vertex Editor script.'));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
