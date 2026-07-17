import type { Mission } from '../../app/core/models/mission.model';

export const EVENTS_AND_STATE_MISSION: Mission = {
  id: 'events-and-state',
  title: 'Events & State',
  description:
    'Wire user events to state and re-render the UI by hand — the loop every framework automates for you.',
  goal: 'Update an immutable state array from click events and re-render the list.',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Fundamentals',
  tags: ['events', 'state', 'dom'],
  prerequisites: ['dom-playground'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'State drives the UI',
      type: 'concept',
      content:
        'A UI is a function of state: given the current data, you produce the DOM. When an event changes the state, you render again.\n\nKeeping state in one place and re-rendering from it is the mental model behind signals, React, and every modern framework.',
    },
    {
      id: 'example',
      title: 'A toggle list',
      type: 'example',
      content:
        'The editor holds a checklist. Each item has a `done` flag. Clicking an item produces a NEW array with that item flipped, then calls `render()`.\n\nRun the preview and click the items — the ✓/○ marker updates because the state changed and the list re-rendered.',
      hint: 'Notice `items.map(...)` returns a new array instead of mutating the old one.',
    },
    {
      id: 'practice',
      title: 'Show a done counter',
      type: 'practice',
      content:
        'Add a line above the list that shows how many items are done, like "2 / 3 complete". It must update every time you toggle an item.',
      hint: 'Count with `items.filter((item) => item.done).length` inside `render()`, and set it on a paragraph you append to `root` first.',
    },
    {
      id: 'comparison',
      title: 'Mutate vs replace',
      type: 'comparison',
      content:
        'You can change state in place or replace it with a new value. The choice affects how easy your app is to reason about.',
      comparison: {
        titleA: 'Replace (immutable)',
        titleB: 'Mutate in place',
        points: [
          {
            aspect: 'Change detection',
            a: 'New reference: easy to detect a change',
            b: 'Same reference: changes can go unnoticed',
          },
          {
            aspect: 'Debugging',
            a: 'Old and new state both exist',
            b: 'Old state is gone',
          },
          {
            aspect: 'Fits with',
            a: 'Signals, computed, OnPush',
            b: 'Quick scripts and prototypes',
          },
        ],
        recommendation:
          'Prefer replacing state with new objects/arrays. It pairs naturally with signals and Angular change detection.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm the state-driven UI loop.',
      checkpoints: [
        {
          question: 'What is the correct loop for an interactive UI?',
          options: [
            'Render once, then patch the DOM directly forever',
            'Event → change state → render from state',
            'Change state and hope the DOM updates',
            'Render only on page load',
          ],
          correctIndex: 1,
          explanation:
            'An event updates the state, then you re-render the UI from that state.',
        },
        {
          question: 'Why return a new array instead of mutating the old one?',
          options: [
            'It is faster in every case',
            'A new reference makes the change easy to detect',
            'Arrays cannot be mutated in TypeScript',
            'It uses less memory',
          ],
          correctIndex: 1,
          explanation:
            'A fresh reference signals "something changed", which pairs well with signals and OnPush change detection.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You connected events to immutable state and re-rendered from it by hand.\n\nNext: let derived values compute themselves so you never store the same fact twice.',
    },
  ],
  starterCode: `interface Item {
  label: string;
  done: boolean;
}

let items: Item[] = [
  { label: 'Read the concept', done: true },
  { label: 'Run the example', done: false },
  { label: 'Complete the practice', done: false },
];

const list = document.createElement('ul');

function toggle(index: number): void {
  items = items.map((item, i) =>
    i === index ? { ...item, done: !item.done } : item,
  );
  render();
}

function render(): void {
  list.textContent = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = (item.done ? '✓ ' : '○ ') + item.label;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => toggle(index));
    list.append(li);
  });
}

render();
root.append(list);`,
};
