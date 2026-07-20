import type { MissionMeta } from '../../app/core/models/mission.model';

export const LIST_SEARCH_MISSION: MissionMeta = {
  id: 'list-search',
  difficulty: 'intermediate',
  durationMinutes: 12,
  track: 'Reactivity with Signals',
  tags: ['filter', 'search', 'list'],
  prerequisites: ['derived-values'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      type: 'concept',
    },
    {
      id: 'example',
      type: 'example',
    },
    {
      id: 'practice',
      type: 'practice',
    },
    {
      id: 'checkpoint',
      type: 'checkpoint',
      checkpoints: [{ correctIndex: 1 }, { correctIndex: 1 }],
    },
    {
      id: 'summary',
      type: 'summary',
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
