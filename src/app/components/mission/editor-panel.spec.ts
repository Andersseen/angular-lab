import { render, screen } from '@testing-library/angular';
import { vi } from 'vitest';
import { EditorPanel } from './editor-panel';
import { CodeExecutorService } from '../../core/services/code-executor.service';

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

  it('renders the mock preview for missions without live mode', async () => {
    await render(EditorPanel, {
      componentInputs: {
        mission: MISSION,
        step: STEP,
        code: 'const x = 1;',
      },
    });

    expect(screen.getByText(/mock preview/i)).toBeTruthy();
    expect(screen.queryByText(/live preview/i)).toBeNull();
  });

  it('renders the live preview for live missions', async () => {
    await render(EditorPanel, {
      componentInputs: {
        mission: { ...MISSION, previewMode: 'live' as const },
        step: STEP,
        code: 'let a = 1;',
      },
      providers: [
        {
          provide: CodeExecutorService,
          useValue: { run: vi.fn().mockResolvedValue({ ok: true }) },
        },
      ],
    });

    expect(screen.getByText(/live preview/i)).toBeTruthy();
    expect(screen.queryByText(/mock preview/i)).toBeNull();
  });
});
