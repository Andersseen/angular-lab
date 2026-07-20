import type { MissionMeta } from '../../app/core/models/mission.model';

export const DATA_TABLE_SORT_MISSION: MissionMeta = {
  id: 'data-table-sort',
  difficulty: 'intermediate',
  durationMinutes: 12,
  track: 'Routing & Data',
  tags: ['sort', 'data', 'list'],
  prerequisites: ['list-search'],
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
