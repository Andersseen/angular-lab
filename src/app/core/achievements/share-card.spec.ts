import type { CompletionCardData } from '../models/achievement.model';
import {
  buildShareCardSvg,
  buildShareText,
  shareCardDataUrl,
  wrapText,
} from './share-card';

function card(overrides: Partial<CompletionCardData> = {}): CompletionCardData {
  return {
    missionTitle: 'Reactive Signals',
    track: 'Reactivity with Signals',
    difficulty: 'intermediate',
    completedOn: 'Jul 19, 2026',
    streakDays: 3,
    missionsCompleted: 5,
    missionsTotal: 12,
    ...overrides,
  };
}

describe('wrapText', () => {
  it('keeps a short title on one line', () => {
    expect(wrapText('Reactive Signals', 26, 2)).toEqual(['Reactive Signals']);
  });

  it('wraps on whole words', () => {
    expect(wrapText('Modern Angular Routing and Data', 20, 2)).toEqual([
      'Modern Angular',
      'Routing and Data',
    ]);
  });

  it('ellipsises what does not fit in the allowed lines', () => {
    const lines = wrapText('one two three four five six seven eight', 10, 2);

    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
  });
});

describe('buildShareCardSvg', () => {
  it('renders the mission, track and stats', () => {
    const svg = buildShareCardSvg(card());

    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('Reactive Signals');
    expect(svg).toContain('Reactivity with Signals · intermediate');
    expect(svg).toContain('3 days');
    expect(svg).toContain('5 / 12');
    expect(svg).toContain('Jul 19, 2026');
  });

  it('escapes text so a title cannot break the markup', () => {
    const svg = buildShareCardSvg(card({ missionTitle: 'Forms & <input>' }));

    expect(svg).toContain('Forms &amp;');
    expect(svg).not.toContain('<input>');
  });

  it('singularises a one-day streak', () => {
    expect(buildShareCardSvg(card({ streakDays: 1 }))).toContain('1 day<');
  });
});

describe('buildShareText', () => {
  it('summarises the completion', () => {
    const text = buildShareText(card());

    expect(text).toContain('"Reactive Signals"');
    expect(text).toContain('5 of 12 missions done');
    expect(text).toContain('3-day streak');
  });

  it('omits the streak when there is nothing to boast about', () => {
    expect(buildShareText(card({ streakDays: 1 }))).not.toContain('streak');
  });
});

describe('shareCardDataUrl', () => {
  it('produces an inline svg image url', () => {
    expect(shareCardDataUrl('<svg/>')).toBe(
      'data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E'
    );
  });
});
