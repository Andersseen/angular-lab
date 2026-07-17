import type { Mission } from '../../app/core/models/mission.model';

export const DATA_TABLE_SORT_MISSION: Mission = {
  id: 'data-table-sort',
  title: 'Sort a Data Table',
  description:
    'Present records the user can reorder, deriving the sorted view without ever mutating your source data.',
  goal: 'Toggle sort direction and render a derived, sorted copy of a record list.',
  difficulty: 'intermediate',
  durationMinutes: 12,
  track: 'Routing & Data',
  tags: ['sort', 'data', 'list'],
  prerequisites: ['list-search'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'Sort a copy, not the source',
      type: 'concept',
      content:
        'Array `sort` mutates in place. If you sort your source data directly, you lose the original order and can trigger subtle bugs.\n\nInstead, derive a sorted COPY for display and keep the source untouched — the same "derive what you show" rule you used for search.',
    },
    {
      id: 'example',
      title: 'Toggle the order',
      type: 'example',
      content:
        'The editor renders scores and a button that flips between ascending and descending. `sorted()` returns `[...rows].sort(...)`, a fresh copy, so `rows` never changes.\n\nRun the preview and click the button to reorder the list.',
      hint: 'The spread `[...rows]` is what protects the original array from being mutated.',
    },
    {
      id: 'practice',
      title: 'Sort by name too',
      type: 'practice',
      content:
        'Add a second button that sorts the rows alphabetically by name. The score button should still work independently.',
      hint: 'Add a `sortKey` variable ("score" | "name"), set it in each button handler, and branch inside `sorted()` using `a.name.localeCompare(b.name)` for names.',
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm safe sorting.',
      checkpoints: [
        {
          question: 'Why sort a copy instead of the source array?',
          options: [
            'Copies sort faster',
            'sort() mutates in place and would lose the original order',
            'The source array is read-only',
            'It reduces memory use',
          ],
          correctIndex: 1,
          explanation:
            '`sort()` mutates the array it is called on, so you sort a spread copy to protect the source.',
        },
        {
          question: 'How do you make a shallow copy of an array before sorting?',
          options: ['rows.copy()', '[...rows]', 'rows.clone()', 'new Array(rows)'],
          correctIndex: 1,
          explanation:
            '`[...rows]` spreads the items into a new array you can safely sort.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You presented sortable records by deriving a sorted copy and leaving the source intact.\n\nYou have completed the Routing & Data track — you can now build data-driven Angular views with confidence.',
    },
  ],
  starterCode: `interface Row {
  name: string;
  score: number;
}

const rows: Row[] = [
  { name: 'Ada', score: 92 },
  { name: 'Grace', score: 88 },
  { name: 'Alan', score: 95 },
  { name: 'Edsger', score: 90 },
];

let ascending = true;

const button = document.createElement('button');
const list = document.createElement('ol');

function sorted(): Row[] {
  return [...rows].sort((a, b) =>
    ascending ? a.score - b.score : b.score - a.score,
  );
}

function render(): void {
  button.textContent = ascending ? 'Sort: lowest first' : 'Sort: highest first';
  list.textContent = '';
  for (const row of sorted()) {
    const li = document.createElement('li');
    li.textContent = row.name + ' — ' + row.score;
    list.append(li);
  }
}

button.addEventListener('click', () => {
  ascending = !ascending;
  render();
});

render();
root.append(button, list);`,
};
