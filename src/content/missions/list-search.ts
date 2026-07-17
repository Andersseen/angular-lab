import type { Mission } from '../../app/core/models/mission.model';

export const LIST_SEARCH_MISSION: Mission = {
  id: 'list-search',
  title: 'Build a Searchable List',
  description:
    'Filter a list as the user types by deriving the visible items from a query — no manual DOM juggling.',
  goal: 'Derive a filtered list from a search query and re-render on every keystroke.',
  difficulty: 'intermediate',
  durationMinutes: 12,
  track: 'Reactivity with Signals',
  tags: ['filter', 'search', 'list'],
  prerequisites: ['derived-values'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'The visible list is derived',
      type: 'concept',
      content:
        'A search box does not hold its own list of results. The results are DERIVED: filter the full list by the current query.\n\nKeep one source of truth (the full list + the query) and compute what to show. This is the same pattern as `computed()` over a signal.',
    },
    {
      id: 'example',
      title: 'Filter as you type',
      type: 'example',
      content:
        'The editor renders an input and a list of fruits. On every keystroke it stores the query and re-renders, showing only fruits that match.\n\nRun the preview and type "a": the list narrows because `visible()` derives it from the query.',
      hint: 'The comparison is case-insensitive: both sides are lower-cased before `includes`.',
    },
    {
      id: 'practice',
      title: 'Handle empty results',
      type: 'practice',
      content:
        'When nothing matches the query, show a "No matches" message instead of an empty list. Also show the match count, like "3 matches".',
      hint: 'Inside `render()`, check `visible().length`. If it is 0, append a paragraph with the message; otherwise render the items and a count line.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm the searchable-list pattern.',
      checkpoints: [
        {
          question: 'Where do the visible results come from?',
          options: [
            'A separate array kept in sync by hand',
            'Deriving them from the full list and the query',
            'The DOM, read back on each keystroke',
            'A server request per keystroke',
          ],
          correctIndex: 1,
          explanation:
            'The visible list is derived from the source list filtered by the current query.',
        },
        {
          question: 'Why lower-case both the item and the query?',
          options: [
            'To sort the list',
            'To make the search case-insensitive',
            'To remove duplicates',
            'It is required by includes()',
          ],
          correctIndex: 1,
          explanation:
            'Lower-casing both sides makes "Apple" match a query of "apple".',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You built a searchable list by deriving the visible items from a query.\n\nNext: validate user input in a form.',
    },
  ],
  starterCode: `const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
];

let query = '';

const input = document.createElement('input');
input.placeholder = 'Search fruits…';
input.addEventListener('input', () => {
  query = input.value;
  render();
});

const list = document.createElement('ul');

function visible(): string[] {
  return fruits.filter((fruit) =>
    fruit.toLowerCase().includes(query.toLowerCase()),
  );
}

function render(): void {
  list.textContent = '';
  for (const fruit of visible()) {
    const li = document.createElement('li');
    li.textContent = fruit;
    list.append(li);
  }
}

render();
root.append(input, list);`,
};
