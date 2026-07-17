import type { Mission } from '../../app/core/models/mission.model';

export const ASYNC_DATA_MISSION: Mission = {
  id: 'async-data',
  title: 'Async Data & Loading States',
  description:
    'Fetch data without freezing the UI and model the loading, success, and error states every real app needs.',
  goal: 'Drive a UI through loading → success/error using async/await.',
  difficulty: 'intermediate',
  durationMinutes: 16,
  track: 'Routing & Data',
  tags: ['async', 'promise', 'loading'],
  prerequisites: ['form-validation'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'Three states, always',
      type: 'concept',
      content:
        'Any data you fetch has at least three states: loading, success, and error. Showing only the success case is the most common UI bug.\n\nWith `async/await` you can move between these states in order and render the right message for each.',
    },
    {
      id: 'example',
      title: 'A fake fetch',
      type: 'example',
      content:
        '`fakeFetch()` returns a Promise that resolves after a short delay, standing in for a network request. Clicking the button shows "Loading…", awaits the result, then shows the name.\n\nRun the preview and click: the UI stays responsive while it waits.',
      hint: 'The click handler is `async`, so it can `await` the promise before updating the status.',
    },
    {
      id: 'practice',
      title: 'Handle the error state',
      type: 'practice',
      content:
        'Make `fakeFetch` reject about half the time, then wrap the await in `try/catch` and show a friendly error message when it fails.',
      hint: 'In `fakeFetch`, use `Math.random() < 0.5` to `reject(new Error("Network error"))`. In the handler, `try { ... } catch (err) { setStatus("Failed — try again"); }`.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm async UI handling.',
      checkpoints: [
        {
          question: 'Which states should a data-fetching UI handle?',
          options: [
            'Only success',
            'Success and error',
            'Loading, success, and error',
            'Loading only',
          ],
          correctIndex: 2,
          explanation:
            'Robust UIs handle loading, success, and error — not just the happy path.',
        },
        {
          question: 'How do you catch a rejected promise with async/await?',
          options: [
            '.then() only',
            'A try/catch around the await',
            'A global window handler',
            'You cannot catch it',
          ],
          correctIndex: 1,
          explanation:
            'Wrapping the `await` in `try/catch` lets you handle a rejected promise like a thrown error.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You moved a UI through loading, success, and error with async/await.\n\nNext: sort and present a table of records.',
    },
  ],
  starterCode: `const status = document.createElement('p');

const button = document.createElement('button');
button.textContent = 'Load user';

function setStatus(text: string): void {
  status.textContent = text;
}

function fakeFetch(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Ada Lovelace'), 600);
  });
}

button.addEventListener('click', async () => {
  setStatus('Loading…');
  const name = await fakeFetch();
  setStatus('Loaded: ' + name);
});

setStatus('Idle — click to load');
root.append(button, status);`,
};
