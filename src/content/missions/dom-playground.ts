import type { Mission } from '../../app/core/models/mission.model';

export const DOM_PLAYGROUND_MISSION: Mission = {
  id: 'dom-playground',
  title: 'DOM Playground',
  description:
    'See your code run for real: build an interactive counter with plain TypeScript and the DOM, the foundation under every Angular template.',
  difficulty: 'beginner',
  durationMinutes: 8,
  track: 'Fundamentals',
  tags: ['typescript', 'dom', 'playground'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'The DOM, up close',
      type: 'concept',
      content:
        'Before Angular renders anything for you, the browser already offers the DOM: a live tree of elements you can create and update with code.\n\nIn this mission you will drive the DOM directly with TypeScript. The preview on the right runs your real code in a sandbox, on every change.',
    },
    {
      id: 'example',
      title: 'A real counter',
      type: 'example',
      content:
        'The editor contains a small counter built with `document.createElement` and a click listener. It renders into `root`, the container the playground hands to your code.\n\nOpen the preview and click Increment: this is your actual code running, not a simulation.',
      hint: 'Try changing the initial value of `count` and watch the preview update.',
    },
    {
      id: 'practice',
      title: 'Add a Decrement button',
      type: 'practice',
      content:
        'Add a second button labeled "Decrement" that lowers the count by one and updates the label.\n\nThe preview re-runs your code as you type, and shows a friendly message if something breaks.',
      hint: 'Mirror the Increment button: create it, set `textContent`, add a click listener that does `count -= 1` and calls `render()`, then append it to `root`.',
    },
    {
      id: 'comparison',
      title: 'Imperative DOM vs declarative templates',
      type: 'comparison',
      content:
        'Updating the DOM by hand works, but Angular offers a different trade-off. Both are worth understanding.',
      comparison: {
        titleA: 'Imperative DOM',
        titleB: 'Angular template',
        points: [
          {
            aspect: 'Mental model',
            a: 'You command each step: create, listen, update',
            b: 'You declare the result; Angular updates the DOM',
          },
          {
            aspect: 'Boilerplate',
            a: 'Grows fast: every element and listener by hand',
            b: 'Minimal: bindings and events inline in the template',
          },
          {
            aspect: 'Best for',
            a: 'Understanding what the browser really does',
            b: 'Building real applications at scale',
          },
        ],
        recommendation:
          'Learn the imperative model to understand the platform; use declarative templates to build applications.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Verify what you learned about the DOM playground.',
      checkpoints: [
        {
          question: 'Where does playground code render its output?',
          options: [
            'Anywhere in the host page',
            'Inside the provided `root` container',
            'In the browser console only',
            'In a new browser tab',
          ],
          correctIndex: 1,
          explanation:
            'The playground runs your code in a sandbox and hands it a dedicated `root` element to render into.',
        },
        {
          question: 'What happens when your code throws an error?',
          options: [
            'The page reloads',
            'Nothing; errors are silent',
            'The preview shows a friendly plain-language message',
            'The mission resets',
          ],
          correctIndex: 2,
          explanation:
            'Errors are captured in the sandbox and shown in the preview panel with a suggested next step.',
        },
        {
          question: 'Why does Angular use declarative templates instead of manual DOM code?',
          options: [
            'Manual DOM code is impossible in browsers',
            'Templates remove boilerplate and let Angular handle updates',
            'Templates run faster than any DOM code',
            'Browsers require templates',
          ],
          correctIndex: 1,
          explanation:
            'Declarative templates state what the UI should look like; Angular performs the DOM updates for you.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You ran real TypeScript in the playground: created elements, handled events, and kept the UI in sync by hand.\n\nNext: see how Angular signals make that synchronization automatic.',
    },
  ],
  starterCode: `let count = 0;

const label = document.createElement('p');

const increment = document.createElement('button');
increment.textContent = 'Increment';
increment.addEventListener('click', () => {
  count += 1;
  render();
});

function render(): void {
  label.textContent = 'Count: ' + count;
}

render();
root.append(label, increment);`,
};
