import { test, expect, type Page } from '@playwright/test';

const uniqueEmail = () =>
  `achv-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

const octet = () => Math.floor(Math.random() * 254) + 1;
const uniqueIp = () => `10.${octet()}.${octet()}.${octet()}`;

/** Local calendar days, most recent first — the same keys the app writes. */
function recentDays(count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.now() - index * 86_400_000);
    return [
      date.getFullYear(),
      `${date.getMonth() + 1}`.padStart(2, '0'),
      `${date.getDate()}`.padStart(2, '0'),
    ].join('-');
  });
}

async function openAchievements(page: Page) {
  await page.goto('/dashboard');
  await page.getByRole('tab', { name: /achievements/i }).click();
}

test('completing a mission shows the shareable card and the badges it unlocked', async ({
  page,
}) => {
  await page.goto('/mission/dom-playground');

  // Mark it complete the way the app does, then reload into the completed view.
  await page.evaluate(() => {
    localStorage.setItem(
      'angular-lab:v1:mission:dom-playground',
      JSON.stringify({
        missionId: 'dom-playground',
        currentStepId: 'summary',
        stepCode: {},
        completed: true,
        completedAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
  });
  await page.reload();

  await expect(page.getByText('Mission completed!')).toBeVisible();
  await expect(page.getByText(/badges? unlocked/i)).toBeVisible();
  await expect(page.getByText('First Launch')).toBeVisible();

  const card = page.getByRole('img', { name: /completion card for dom playground/i });
  await expect(card).toBeVisible();
  expect(await card.getAttribute('src')).toContain('data:image/svg+xml');

  await expect(page.getByRole('button', { name: /save card/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /copy summary/i })).toBeVisible();
});

test('practice days survive a logout / login cycle', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'CF-Connecting-IP': uniqueIp() });

  const email = uniqueEmail();
  const password = 'Password123';

  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Name' }).fill('Streak Tester');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  // Three consecutive practice days on this device; the reload pushes them.
  await page.evaluate((days) => {
    localStorage.setItem('angular-lab:v1:activity', JSON.stringify(days));
  }, recentDays(3));

  await openAchievements(page);
  await expect(page.getByText('3 days').first()).toBeVisible();

  // Log out lives on the profile tab, not the one we just opened.
  await page.getByRole('tab', { name: /profile/i }).click();
  await page
    .locator('main')
    .getByRole('button', { name: 'Log out', exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);

  // Wipe the device: anything that comes back now came from the account.
  await page.evaluate(() => localStorage.clear());

  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await openAchievements(page);
  await expect(page.getByText('3 days').first()).toBeVisible();
});

test('a learner with no practice sees the full badge catalogue at zero', async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ 'CF-Connecting-IP': uniqueIp() });

  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Name' }).fill('Fresh Tester');
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail());
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await openAchievements(page);

  await expect(page.getByText(/work through a mission step/i)).toBeVisible();
  await expect(page.getByText('0 / 9')).toBeVisible();
  await expect(page.getByText('Lab Graduate')).toBeVisible();
  await expect(page.getByText('0 / 12')).toBeVisible();
});
