import { test, expect } from '@playwright/test';

test('landing page navigates to mission catalog', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /learn angular by doing/i })
  ).toBeVisible();

  await page.getByRole('link', { name: /browse missions/i }).click();

  await expect(page).toHaveURL(/\/missions$/);
  await expect(page.getByRole('heading', { name: /missions/i })).toBeVisible();
});
