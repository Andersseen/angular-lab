/** Plain-language error surfaced in the preview panel (see specs/playground.md). */
export interface FriendlyError {
  readonly title: string;
  readonly message: string;
}

/** Raw error shape reported by the sandbox or the transpiler. */
export interface RawError {
  readonly name?: string;
  readonly message: string;
}

/**
 * Maps a transpile diagnostic (code that cannot be compiled) to plain language.
 * `line` is 1-based; pass 0 when the position is unknown.
 */
export function fromDiagnostic(message: string, line: number): FriendlyError {
  const location = line > 0 ? `Line ${line}: ` : '';
  return {
    title: 'Your code could not be compiled',
    message: `${location}${message}. Check the syntax on that line and try again.`,
  };
}

/** Maps a runtime error coming from the sandbox to plain language. */
export function fromRuntimeError(raw: RawError): FriendlyError {
  switch (raw.name) {
    case 'SyntaxError':
      return {
        title: 'Syntax error',
        message: `${raw.message}. Check for missing brackets, quotes, or commas near the reported spot.`,
      };
    case 'ReferenceError':
      return {
        title: 'Something is not defined',
        message: `${raw.message}. Check the spelling of variable and function names, and make sure everything is declared before it is used.`,
      };
    case 'TypeError':
      return {
        title: 'Type error',
        message: `${raw.message}. Check that each value is the kind of value the operation expects.`,
      };
    case 'RangeError':
      return {
        title: 'Out of range',
        message: `${raw.message}. Check loop conditions and values that grow without bound.`,
      };
    default:
      return {
        title: 'Something went wrong',
        message: `${raw.message}. Review the last change you made and try again.`,
      };
  }
}

/** Reported when the sandbox does not answer within the expected time. */
export function fromTimeout(): FriendlyError {
  return {
    title: 'The preview is not responding',
    message:
      'The sandbox did not answer in time. Your code may contain an infinite loop — review it and try again.',
  };
}

/** Reported when a snippet uses import/export (playground code is self-contained). */
export function fromUnsupportedModules(): FriendlyError {
  return {
    title: 'Imports are not supported in the playground',
    message:
      'Playground snippets must be self-contained: remove any import or export statements and keep everything in a single snippet.',
  };
}
