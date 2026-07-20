import type { MissionMeta } from '../../app/core/models/mission.model';

export const EFFECT_SYNC_MISSION: MissionMeta = {
  id: 'effect-sync',
  difficulty: 'intermediate',
  durationMinutes: 14,
  track: 'Reactivity with Signals',
  tags: ['effect', 'reactivity', 'subscribe'],
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
  starterCode: `type Listener = () => void;

function createState<T>(initial: T) {
  let value = initial;
  const listeners: Listener[] = [];
  return {
    get: (): T => value,
    set: (next: T): void => {
      value = next;
      listeners.forEach((run) => run());
    },
    effect: (run: Listener): void => {
      listeners.push(run);
      run();
    },
  };
}

const count = createState(0);

const label = document.createElement('p');

const button = document.createElement('button');
button.textContent = 'Increment';
button.addEventListener('click', () => count.set(count.get() + 1));

// effect: keep the label in sync automatically
count.effect(() => {
  label.textContent = 'Count: ' + count.get();
});

root.append(label, button);`,
};
