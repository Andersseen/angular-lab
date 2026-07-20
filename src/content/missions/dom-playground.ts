import type { MissionMeta } from '../../app/core/models/mission.model';

export const DOM_PLAYGROUND_MISSION: MissionMeta = {
  id: 'dom-playground',
  difficulty: 'beginner',
  durationMinutes: 8,
  track: 'Fundamentals',
  tags: ['typescript', 'dom', 'playground'],
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
      checkpoints: [
        { correctIndex: 1 },
        { correctIndex: 2 },
        { correctIndex: 1 },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
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
