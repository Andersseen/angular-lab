import {
  buildRunnerDoc,
  PLAYGROUND_PARENT_SOURCE,
  PLAYGROUND_SANDBOX_SOURCE,
} from './runner-doc';

describe('buildRunnerDoc', () => {
  const doc = buildRunnerDoc();

  it('provides a root container for learner output', () => {
    expect(doc).toContain('id="root"');
  });

  it('announces readiness to the host page', () => {
    expect(doc).toContain("type: 'ready'");
  });

  it('only accepts messages tagged with the parent source marker', () => {
    expect(doc).toContain(PLAYGROUND_PARENT_SOURCE);
    expect(doc).toContain("data.type !== 'run'");
  });

  it('answers ping messages with ready (readiness handshake)', () => {
    expect(doc).toContain("data.type === 'ping'");
  });

  it('tags responses with the sandbox source marker', () => {
    expect(doc).toContain(PLAYGROUND_SANDBOX_SOURCE);
  });

  it('clears the root before each run', () => {
    expect(doc).toContain("root.innerHTML = ''");
  });

  it('executes code inside a try/catch via new Function', () => {
    expect(doc).toContain('new Function');
    expect(doc).toContain('catch (executionError)');
  });

  it('reports done and error results with the run id', () => {
    expect(doc).toContain("type: 'done', id: data.id");
    expect(doc).toContain("type: 'error'");
  });

  it('captures unhandled errors and rejections', () => {
    expect(doc).toContain("addEventListener('error'");
    expect(doc).toContain("addEventListener('unhandledrejection'");
  });
});
