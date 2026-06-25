import { test, expect } from '@playwright/test';

test('landing page navigates to demo mission', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /learn angular by doing/i })
  ).toBeVisible();

  await page.getByRole('link', { name: /start demo mission/i }).click();

  await expect(page).toHaveURL(/\/mission$/);
  await expect(
    page.getByRole('heading', { name: /reactive signals/i })
  ).toBeVisible();
});
