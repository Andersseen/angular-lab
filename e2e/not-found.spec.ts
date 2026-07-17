import { test, expect } from '@playwright/test';

test('unknown routes show a friendly not-found page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();

  await page.getByRole('link', { name: /go home/i }).click();
  await expect(page).toHaveURL(/\/$/);
});
