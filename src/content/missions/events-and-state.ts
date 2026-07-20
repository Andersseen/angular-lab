import type { MissionMeta } from '../../app/core/models/mission.model';

export const EVENTS_AND_STATE_MISSION: MissionMeta = {
  id: 'events-and-state',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Fundamentals',
  tags: ['events', 'state', 'dom'],
  prerequisites: ['dom-playground'],
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
      id: 'comparison',
      type: 'comparison',
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
