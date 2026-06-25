import { test, expect } from '@playwright/test';

test('homepage counter can be incremented', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByRole('heading', { name: /angular lab/i });
  await expect(heading).toBeVisible();

  const count = page.getByTestId('counter-count');
  await expect(count).toHaveText('0');

  await page.getByRole('button', { name: /increment/i }).click();
  await expect(count).toHaveText('1');

  await page.getByRole('button', { name: /increment/i }).click();
  await expect(count).toHaveText('2');

  await page.getByRole('button', { name: /decrement/i }).click();
  await expect(count).toHaveText('1');

  await page.getByRole('button', { name: /reset/i }).click();
  await expect(count).toHaveText('0');
});
