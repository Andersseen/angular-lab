import type { MissionMeta } from '../../app/core/models/mission.model';

export const ASYNC_DATA_MISSION: MissionMeta = {
  id: 'async-data',
  difficulty: 'intermediate',
  durationMinutes: 16,
  track: 'Routing & Data',
  tags: ['async', 'promise', 'loading'],
  prerequisites: ['form-validation'],
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
      checkpoints: [{ correctIndex: 2 }, { correctIndex: 1 }],
    },
    {
      id: 'summary',
      type: 'summary',
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
