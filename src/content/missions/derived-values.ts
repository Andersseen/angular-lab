import type { Mission } from '../../app/core/models/mission.model';

export const DERIVED_VALUES_MISSION: Mission = {
  id: 'derived-values',
  title: 'Derived Values',
  description:
    'Compute values from your source state instead of storing them twice — the idea behind computed() signals.',
  goal: 'Derive a total from source state and keep it correct without duplicating data.',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Reactivity with Signals',
  tags: ['computed', 'derived', 'state'],
  prerequisites: ['reactive-signals'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'Do not store what you can compute',
      type: 'concept',
      content:
        'If a value can be calculated from other values, do not store it separately — derive it. A stored copy can drift out of sync; a derived value is always correct.\n\nThis is exactly what `computed(() => ...)` does in Angular: it recalculates from its sources whenever they change.',
    },
    {
      id: 'example',
      title: 'A live total',
      type: 'example',
      content:
        'The editor tracks `price` and `quantity` as source state. The `total()` function derives the amount instead of storing it.\n\nRun the preview and click "Add one": the total recomputes from the new quantity — you never assign to it directly.',
      hint: 'Look how `total()` is a function of `price` and `quantity`, not a stored variable.',
    },
    {
      id: 'practice',
      title: 'Add a discount',
      type: 'practice',
      content:
        'Add a derived `discounted()` value that takes 10% off the total, and show a second line like "You pay: $36".\n\nIt must stay correct as the quantity changes.',
      hint: 'Return `total() * 0.9` from a new function and print it inside `render()`. Derive it — never store the discounted number.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm the derived-state idea.',
      checkpoints: [
        {
          question: 'Why derive a total instead of storing it in a variable?',
          options: [
            'Stored values are illegal in TypeScript',
            'A derived value cannot drift out of sync with its sources',
            'Functions are always faster than variables',
            'It avoids using state entirely',
          ],
          correctIndex: 1,
          explanation:
            'A derived value recomputes from its sources, so it is always consistent with them.',
        },
        {
          question: 'Which Angular API expresses a derived value?',
          options: ['signal()', 'computed()', 'effect()', 'inject()'],
          correctIndex: 1,
          explanation:
            '`computed(() => ...)` produces a read-only value derived from other signals.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You computed values from source state instead of duplicating them — the core idea of `computed()`.\n\nNext: run side effects automatically whenever state changes.',
    },
  ],
  starterCode: `let price = 20;
let quantity = 2;

// total is DERIVED from price and quantity — never stored on its own
function total(): number {
  return price * quantity;
}

const label = document.createElement('p');

const button = document.createElement('button');
button.textContent = 'Add one';
button.addEventListener('click', () => {
  quantity += 1;
  render();
});

function render(): void {
  label.textContent = quantity + ' × $' + price + ' = $' + total();
}

render();
root.append(label, button);`,
};
