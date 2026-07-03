import { render, screen } from '@testing-library/angular';
import { EditorPanel } from './editor-panel';

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

describe('EditorPanel', () => {
  it('renders editor and preview tabs', async () => {
    await render(EditorPanel, {
      componentInputs: {
        mission: MISSION,
        step: STEP,
        code: 'const x = 1;',
      },
    });

    expect(screen.getByRole('tab', { name: /editor/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /preview/i })).toBeTruthy();
  });
});
