import type { MissionMeta } from '../../app/core/models/mission.model';

export const DERIVED_VALUES_MISSION: MissionMeta = {
  id: 'derived-values',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Reactivity with Signals',
  tags: ['computed', 'derived', 'state'],
  prerequisites: ['reactive-signals'],
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
  starterCode: `let price = 20;
let quantity = 2;

// total is DERIVED from price and quantity — never stored on its own
function total(): number {
  return price * quantity;
}

const label = document.createElement('p');

const button = document.createElement('button');
button.textContent = 'Add one';
button.addEventListener('click', () => {
  quantity += 1;
  render();
});

function render(): void {
  label.textContent = quantity + ' × $' + price + ' = $' + total();
}

render();
root.append(label, button);`,
};
