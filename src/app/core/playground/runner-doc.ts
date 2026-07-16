/**
 * Source markers for the playground postMessage protocol.
 * The sandboxed iframe has an opaque origin ('null'), so messages are
 * authenticated by these markers plus `event.source === iframe.contentWindow`.
 */
export const PLAYGROUND_PARENT_SOURCE = 'angular-lab';
export const PLAYGROUND_SANDBOX_SOURCE = 'angular-lab-playground';

/**
 * Builds the fixed `srcdoc` document for the sandboxed preview iframe.
 *
 * The document provides:
 * - a `<div id="root">` container that learner code renders into,
 * - a message listener for `{ source: 'angular-lab', type: 'run', id, code }`,
 * - execution via `new Function(root, console, code)` inside try/catch,
 * - `error` / `unhandledrejection` capture and console error/warn forwarding,
 * - responses tagged with `source: 'angular-lab-playground'`.
 *
 * Kept as a pure function so the protocol contract is unit-testable.
 */
export function buildRunnerDoc(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; color: #18181b; background: #ffffff; }
      button { cursor: pointer; font: inherit; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      (function () {
        'use strict';
        var PARENT_SOURCE = '${PLAYGROUND_PARENT_SOURCE}';
        var SANDBOX_SOURCE = '${PLAYGROUND_SANDBOX_SOURCE}';
        var currentId = 0;

        function post(message) {
          message.source = SANDBOX_SOURCE;
          parent.postMessage(message, '*');
        }

        function textOf(value) {
          if (typeof value === 'string') {
            return value;
          }
          try {
            return JSON.stringify(value);
          } catch (serializationError) {
            return String(value);
          }
        }

        ['error', 'warn'].forEach(function (level) {
          var original = console[level].bind(console);
          console[level] = function () {
            var args = Array.prototype.slice.call(arguments);
            post({ type: 'console', id: currentId, level: level, text: args.map(textOf).join(' ') });
            original.apply(null, args);
          };
        });

        window.addEventListener('error', function (event) {
          post({ type: 'error', id: currentId, name: 'Error', message: event.message || 'Unknown error' });
        });

        window.addEventListener('unhandledrejection', function (event) {
          var reason = event.reason;
          post({
            type: 'error',
            id: currentId,
            name: (reason && reason.name) || 'Error',
            message: (reason && reason.message) || textOf(reason),
          });
        });

        window.addEventListener('message', function (event) {
          var data = event.data;
          if (!data || data.source !== PARENT_SOURCE || data.type !== 'run') {
            return;
          }
          currentId = data.id;
          var root = document.getElementById('root');
          root.innerHTML = '';
          try {
            var runSnippet = new Function('root', 'console', '"use strict";\\n' + data.code);
            runSnippet(root, console);
            post({ type: 'done', id: data.id });
          } catch (executionError) {
            post({
              type: 'error',
              id: data.id,
              name: (executionError && executionError.name) || 'Error',
              message: (executionError && executionError.message) || String(executionError),
            });
          }
        });

        post({ type: 'ready' });
      })();
    </script>
  </body>
</html>`;
}
