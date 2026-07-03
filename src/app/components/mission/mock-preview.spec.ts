import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MockPreview } from './mock-preview';

const MISSION = {
  id: 'reactive-signals',
  title: 'Reactive Signals',
  description: '',
  difficulty: 'beginner',
  durationMinutes: 10,
  track: 'Fundamentals',
  tags: [],
  steps: [],
  starterCode: '',
} as const;

const STEP = {
  id: 'practice',
  title: 'Practice',
  type: 'practice',
  content: '',
} as const;

describe('MockPreview', () => {
  it('renders counter mock for reactive signals practice step', async () => {
    await render(MockPreview, {
      componentInputs: { mission: MISSION, step: STEP },
    });

    expect(screen.getByText(/mock preview/i)).toBeTruthy();
    expect(screen.getByText(/count/i)).toBeTruthy();
  });

  it('increments counter on click', async () => {
    const user = userEvent.setup();
    await render(MockPreview, {
      componentInputs: { mission: MISSION, step: STEP },
    });

    const button = screen.getByRole('button', { name: '+' });
    await user.click(button);

    expect(screen.getByText('1')).toBeTruthy();
  });
});
