import type { Mission } from '../../app/core/models/mission.model';

export const FORM_VALIDATION_MISSION: Mission = {
  id: 'form-validation',
  title: 'Handle Form Validation',
  description:
    'Give users instant, friendly feedback as they type by validating input and deriving a status message.',
  goal: 'Validate a field on input and show a clear message for each state.',
  difficulty: 'intermediate',
  durationMinutes: 14,
  track: 'Routing & Data',
  tags: ['forms', 'validation', 'events'],
  prerequisites: ['events-and-state'],
  previewMode: 'live',
  steps: [
    {
      id: 'concept',
      title: 'Validation is a pure function',
      type: 'concept',
      content:
        'Good validation is a pure function: given the current value, return a message. No hidden state, no surprises.\n\nYou call it on every input event and show the result. The message is derived from the value — the same reactive idea, applied to forms.',
    },
    {
      id: 'example',
      title: 'Live email feedback',
      type: 'example',
      content:
        'The editor validates an email field. `validate(value)` returns a message for empty input, a missing "@", or a valid address.\n\nRun the preview and type: the message updates on every keystroke because it is derived from the field value.',
      hint: 'The function returns early for each failing case, then a success message last.',
    },
    {
      id: 'practice',
      title: 'Require a password too',
      type: 'practice',
      content:
        'Add a password field that must be at least 8 characters. Show "Ready to submit" only when BOTH the email and the password are valid.',
      hint: 'Write a `validPassword(value)` returning a boolean, add its own message paragraph, and gate the final message on both checks.',
    },
    {
      id: 'comparison',
      title: 'Validate on input vs on submit',
      type: 'comparison',
      content:
        'You can validate as the user types or only when they submit. Each has a place.',
      comparison: {
        titleA: 'On input (live)',
        titleB: 'On submit',
        points: [
          {
            aspect: 'Feedback timing',
            a: 'Immediate, per keystroke',
            b: 'Only after the user is done',
          },
          {
            aspect: 'Risk',
            a: 'Can nag before the user finishes',
            b: 'User discovers all errors at once',
          },
          {
            aspect: 'Good for',
            a: 'Password rules, availability checks',
            b: 'Short forms, final confirmation',
          },
        ],
        recommendation:
          'Validate on input for guidance, but avoid showing errors until the user has interacted with a field. Always re-check on submit.',
      },
    },
    {
      id: 'checkpoint',
      title: 'Quick check',
      type: 'checkpoint',
      content: 'Confirm the validation approach.',
      checkpoints: [
        {
          question: 'Why keep validation as a pure function of the value?',
          options: [
            'It is the only way TypeScript allows',
            'It is predictable and easy to test',
            'It avoids using events',
            'It makes the form submit automatically',
          ],
          correctIndex: 1,
          explanation:
            'A pure function returns the same message for the same input, which is predictable and testable.',
        },
        {
          question: 'When should the "Ready to submit" message appear?',
          options: [
            'When the email is valid',
            'When either field is valid',
            'Only when every field is valid',
            'As soon as the form loads',
          ],
          correctIndex: 2,
          explanation:
            'A submit-ready state requires all fields to pass validation.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Mission complete',
      type: 'summary',
      content:
        'You validated input on every keystroke and derived a clear status from the field values.\n\nNext: load data asynchronously and handle loading and error states.',
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
