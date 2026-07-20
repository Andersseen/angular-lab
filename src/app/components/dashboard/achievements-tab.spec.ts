import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import type { Badge, Streak } from '../../core/models/achievement.model';
import { AchievementsService } from '../../core/services/achievements.service';
import { AchievementsTab } from './achievements-tab';

const BADGES: Badge[] = [
  {
    id: 'first-mission',
    title: 'dashboard.achievements.badges.firstLaunch.title',
    description: 'dashboard.achievements.badges.firstLaunch.description',
    category: 'milestone',
    earned: true,
    current: 1,
    target: 1,
  },
  {
    id: 'streak-7',
    title: 'dashboard.achievements.badges.weekStreak.title',
    description: 'dashboard.achievements.badges.weekStreak.description',
    category: 'streak',
    earned: false,
    current: 2,
    target: 7,
  },
];

async function renderTab(streak: Streak, badges = BADGES) {
  const badgeSignal = signal(badges);
  return render(AchievementsTab, {
    providers: [
      {
        provide: AchievementsService,
        useValue: {
          badges: badgeSignal,
          streak: signal(streak),
          earnedBadges: signal(badges.filter((badge) => badge.earned)),
        },
      },
    ],
  });
}

describe('AchievementsTab', () => {
  it('shows the streak, badge score and the whole catalogue', async () => {
    await renderTab({ current: 2, longest: 5, activeToday: true });

    expect(screen.getByText('2 days')).toBeTruthy();
    expect(screen.getByText('5 days')).toBeTruthy();
    expect(screen.getByText('1 / 2')).toBeTruthy();
    expect(screen.getByText('First Launch')).toBeTruthy();
    expect(screen.getByText('Week Streak')).toBeTruthy();
    expect(screen.getByText('2 / 7')).toBeTruthy();
  });

  it('acknowledges a day that already counted', async () => {
    await renderTab({ current: 3, longest: 3, activeToday: true });

    expect(screen.getByText(/you practiced today/i)).toBeTruthy();
  });

  it('asks the learner to practice when the streak is idle today', async () => {
    await renderTab({ current: 3, longest: 3, activeToday: false });

    expect(screen.getByText(/practice today to keep your streak alive/i)).toBeTruthy();
  });

  it('invites a first streak when there is none', async () => {
    await renderTab({ current: 0, longest: 0, activeToday: false });

    expect(screen.getByText(/work through a mission step/i)).toBeTruthy();
  });

  it('singularises a one-day streak', async () => {
    await renderTab({ current: 1, longest: 1, activeToday: true });

    expect(screen.getAllByText('1 day').length).toBe(2);
  });
});
