import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MissionNav } from './mission-nav';

const STEPS = [
  { id: 'concept', title: 'Concept', type: 'concept', content: '' },
  { id: 'practice', title: 'Practice', type: 'practice', content: '' },
] as const;

describe('MissionNav', () => {
  it('renders all steps and highlights the current one', async () => {
    await render(MissionNav, {
      componentInputs: {
        steps: STEPS,
        currentStepId: 'practice',
      },
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('emits selected step on click', async () => {
    const user = userEvent.setup();
    const selectStep = vi.fn();

    await render(MissionNav, {
      componentInputs: {
        steps: STEPS,
        currentStepId: 'concept',
      },
      componentOutputs: { selectStep: { emit: selectStep } as never },
    });

    await user.click(screen.getByRole('button', { name: /practice/i }));
    expect(selectStep).toHaveBeenCalledWith('practice');
  });
});
