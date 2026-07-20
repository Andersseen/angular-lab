import type { MissionMeta } from '../../app/core/models/mission.model';

export const FORM_VALIDATION_MISSION: MissionMeta = {
  id: 'form-validation',
  difficulty: 'intermediate',
  durationMinutes: 14,
  track: 'Routing & Data',
  tags: ['forms', 'validation', 'events'],
  prerequisites: ['events-and-state'],
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
      checkpoints: [{ correctIndex: 1 }, { correctIndex: 2 }],
    },
    {
      id: 'summary',
      type: 'summary',
    },
  ],
  starterCode: `const emailInput = document.createElement('input');
emailInput.placeholder = 'you@example.com';

const message = document.createElement('p');

function validate(value: string): string {
  if (value.length === 0) {
    return 'Email is required.';
  }
  if (!value.includes('@')) {
    return 'Email must contain an @.';
  }
  return 'Looks good!';
}

emailInput.addEventListener('input', () => {
  message.textContent = validate(emailInput.value);
});

message.textContent = validate('');
root.append(emailInput, message);`,
};
