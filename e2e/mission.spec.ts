import { test, expect } from '@playwright/test';

test('mission page lets learner switch steps and shows editor', async ({
  page,
}) => {
  await page.goto('/mission/reactive-signals');

  await expect(
    page.getByRole('heading', { name: /reactive signals/i })
  ).toBeVisible();

  const stepNav = page.getByLabel('Mission steps');
  await expect(stepNav.getByRole('button', { name: /what are signals/i })).toBeVisible();
  await expect(stepNav.getByRole('button', { name: /living counter/i })).toBeVisible();
  await expect(stepNav.getByRole('button', { name: /add double count/i })).toBeVisible();

  await stepNav.getByRole('button', { name: /living counter/i }).click();
  await expect(page.getByText('A living counter', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: /editor/i }).click();
  await expect(page.locator('vertex-editor')).toBeVisible();

  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText('Add double count', { exact: true })).toBeVisible();
});

test('mission catalog lists missions', async ({ page }) => {
  await page.goto('/missions');

  await expect(page.getByRole('heading', { name: /missions/i })).toBeVisible();
  await expect(page.getByText(/reactive signals/i)).toBeVisible();
  await expect(page.getByText(/modern angular routing/i)).toBeVisible();
});
