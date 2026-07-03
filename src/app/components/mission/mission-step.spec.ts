import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MissionStep } from './mission-step';

describe('MissionStep', () => {
  it('renders step content and metadata', async () => {
    await render(MissionStep, {
      componentInputs: {
        step: {
          id: 'concept',
          title: 'What are signals?',
          type: 'concept',
          content: 'Signals are reactive values.',
          hint: 'Think of them as fine-grained state.',
        },
        currentStepNumber: 1,
        totalSteps: 3,
      },
    });

    expect(screen.getByText(/what are signals/i)).toBeTruthy();
    expect(screen.getByText(/signals are reactive values/i)).toBeTruthy();
    expect(screen.getByText(/hint:/i)).toBeTruthy();
  });

  it('renders checkpoint questions and emits allCorrect', async () => {
    const user = userEvent.setup();
    const allCorrect = vi.fn();

    await render(MissionStep, {
      componentInputs: {
        step: {
          id: 'checkpoint',
          title: 'Quick check',
          type: 'checkpoint',
          content: 'Answer the question.',
          checkpoints: [
            {
              question: 'How do you read a signal?',
              options: ['count.value', 'count()', 'count.get()'],
              correctIndex: 1,
              explanation: 'Signals are read as functions.',
            },
          ],
        },
        currentStepNumber: 2,
        totalSteps: 3,
      },
      componentOutputs: { allCorrect: { emit: allCorrect } as never },
    });

    await user.click(screen.getByRole('button', { name: /count\(\)/i }));
    await user.click(screen.getByRole('button', { name: /check answers/i }));

    expect(allCorrect).toHaveBeenCalled();
  });
});
