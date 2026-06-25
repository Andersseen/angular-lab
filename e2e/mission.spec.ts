import { test, expect } from '@playwright/test';

test('mission page lets learner switch steps and shows editor', async ({
  page,
}) => {
  await page.goto('/mission');

  await expect(
    page.getByRole('heading', { name: /reactive signals/i })
  ).toBeVisible();

  const stepNav = page.getByLabel('Mission steps');
  await expect(stepNav.getByRole('button', { name: /concept/i })).toBeVisible();
  await expect(stepNav.getByRole('button', { name: /example/i })).toBeVisible();
  await expect(stepNav.getByRole('button', { name: /practice/i })).toBeVisible();

  await stepNav.getByRole('button', { name: /example/i }).click();
  await expect(page.getByText(/editor below contains/i)).toBeVisible();

  await page.getByRole('tab', { name: /editor/i }).click();
  await expect(page.locator('vertex-editor')).toBeVisible();

  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/add a second signal/i)).toBeVisible();
});
