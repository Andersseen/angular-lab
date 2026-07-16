import {
  fromDiagnostic,
  fromRuntimeError,
  fromTimeout,
} from './friendly-error';

describe('fromRuntimeError', () => {
  it('explains syntax errors with a concrete suggestion', () => {
    const error = fromRuntimeError({
      name: 'SyntaxError',
      message: 'Unexpected token }',
    });

    expect(error.title).toBe('Syntax error');
    expect(error.message).toContain('Unexpected token }');
    expect(error.message).toMatch(/brackets|quotes|commas/);
  });

  it('explains reference errors with a concrete suggestion', () => {
    const error = fromRuntimeError({
      name: 'ReferenceError',
      message: 'counter is not defined',
    });

    expect(error.title).toBe('Something is not defined');
    expect(error.message).toContain('counter is not defined');
    expect(error.message).toMatch(/spelling|declared/);
  });

  it('explains type errors with a concrete suggestion', () => {
    const error = fromRuntimeError({
      name: 'TypeError',
      message: 'count is not a function',
    });

    expect(error.title).toBe('Type error');
    expect(error.message).toContain('count is not a function');
  });

  it('falls back to a generic message for unknown errors', () => {
    const error = fromRuntimeError({
      name: 'CustomError',
      message: 'boom',
    });

    expect(error.title).toBe('Something went wrong');
    expect(error.message).toContain('boom');
    expect(error.message).toMatch(/try again/);
  });
});

describe('fromDiagnostic', () => {
  it('includes the 1-based line number', () => {
    const error = fromDiagnostic('Expression expected.', 3);

    expect(error.title).toBe('Your code could not be compiled');
    expect(error.message).toContain('Line 3');
    expect(error.message).toContain('Expression expected.');
  });

  it('omits the location when the line is unknown', () => {
    const error = fromDiagnostic('Expression expected.', 0);

    expect(error.message).not.toContain('Line 0');
  });
});

describe('fromTimeout', () => {
  it('describes the unresponsive sandbox in plain language', () => {
    const error = fromTimeout();

    expect(error.title).toBe('The preview is not responding');
    expect(error.message).toMatch(/infinite loop/);
  });
});
