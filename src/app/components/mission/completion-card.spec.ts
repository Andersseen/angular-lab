import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import type { CompletionCardData } from '../../core/models/achievement.model';
import type { Mission } from '../../core/models/mission.model';
import { AchievementsService } from '../../core/services/achievements.service';
import { CompletionCard } from './completion-card';

const MISSION: Mission = {
  id: 'reactive-signals',
  title: 'Reactive Signals',
  description: '',
  difficulty: 'intermediate',
  durationMinutes: 12,
  track: 'Fundamentals',
  tags: [],
  steps: [],
  starterCode: '',
};

const CARD: CompletionCardData = {
  missionTitle: MISSION.title,
  track: MISSION.track,
  difficulty: MISSION.difficulty,
  completedOn: 'Jul 19, 2026',
  streakDays: 3,
  missionsCompleted: 5,
  missionsTotal: 12,
};

async function renderCard() {
  return render(CompletionCard, {
    inputs: { mission: MISSION },
    providers: [
      {
        provide: AchievementsService,
        useValue: { completionCard: () => CARD },
      },
    ],
  });
}

describe('CompletionCard', () => {
  it('renders the card as a described image', async () => {
    await renderCard();

    const image = screen.getByRole('img', { name: /reactive signals/i });
    expect(image.getAttribute('src')).toContain('data:image/svg+xml');
    expect(image.getAttribute('alt')).toContain('Jul 19, 2026');
  });

  it('offers to save and to copy, and says so after copying', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });

    await renderCard();
    expect(screen.getByRole('button', { name: /save card/i })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: /copy summary/i }));

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('"Reactive Signals"')
    );
    expect(screen.getByRole('button', { name: /summary copied/i })).toBeTruthy();

    vi.unstubAllGlobals();
  });
});
