import type { Mission } from '../../app/core/models/mission.model';

export const EFFECT_SYNC_MISSION: Mission = {
  id: 'effect-sync',
  title: 'Effects & Auto-Sync',
  description:
    'Run side effects automatically whenever state changes — a from-scratch version of Angular effect().',
  goal: 'Build a tiny reactive value that re-runs subscribers on every change.',
  difficulty: 'intermediate',
  durationMinutes: 14,
  track: 'Reactivity with Signals',
  tags: ['effect', 'reactivity', 'subscribe'],
  prerequisites: ['derived-values'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'Reacting to change',
      type: 'concept',
      content:
        'An effect is code that should re-run whenever the state it depends on changes: update the DOM, log, sync to storage.\n\nAngular gives you `effect(() => ...)`. Here you will build the same idea by hand: a value that keeps a list of listeners and calls them on every set.',
    },
    {
      id: 'example',
      title: 'A reactive value',
      type: 'example',
      content:
        'The editor defines `createState`, a value with `get`, `set`, and `effect`. The counter registers one effect that writes to the label, and it runs immediately and after every click.\n\nRun the preview: you never call `render()` yourself — the effect keeps the label in sync.',
      hint: 'Follow the flow: `set` updates the value, then calls every registered listener.',
    },
    {
      id: 'practice',
      title: 'Add a second effect',
      type: 'practice',
      content:
        'Register a SECOND effect that shows whether the count is "Even" or "Odd" in a separate paragraph. Both effects must run on every click.',
      hint: 'Create another paragraph, append it to `root`, then call `count.effect(() => { ... })` reading `count.get() % 2`.',
    },
    {
      id: 'comparison',
      title: 'computed vs effect',
      type: 'comparison',
      content:
        'Deriving a value and reacting to a change look similar but serve different roles.',
      comparison: {
        titleA: 'computed()',
        titleB: 'effect()',
        points: [
          {
            aspect: 'Produces',
            a: 'A value you read',
            b: 'A side effect, no value',
          },
          {
            aspect: 'When it runs',
            a: 'Lazily, when read',
            b: 'Eagerly, after dependencies change',
          },
          {
            aspect: 'Use for',
            a: 'Totals, filtered lists, formatting',
            b: 'DOM writes, logging, persistence',
          },
        ],
        recommendation:
          'Use `computed()` to derive values; reserve `effect()` for side effects that reach outside your state.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm how effects work.',
      checkpoints: [
        {
          question: 'When should an effect re-run?',
          options: [
            'Only once at startup',
            'Whenever the state it depends on changes',
            'On a fixed timer',
            'Only when the user reloads',
          ],
          correctIndex: 1,
          explanation:
            'Effects re-run in response to changes in the state they read.',
        },
        {
          question: 'What does an effect produce?',
          options: [
            'A derived value to read',
            'Nothing — it performs a side effect',
            'A new component',
            'An HTTP response',
          ],
          correctIndex: 1,
          explanation:
            'Effects perform side effects (DOM writes, logging); they do not return a value to read.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You built a reactive value that re-runs effects on change — the engine behind `effect()`.\n\nNext: derive a filtered list from a search box.',
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
