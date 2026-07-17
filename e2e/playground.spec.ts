import { test, expect } from '@playwright/test';

test('dom playground mission runs real code in the sandboxed preview', async ({
  page,
}) => {
  await page.goto('/mission/dom-playground');

  await expect(
    page.getByRole('heading', { name: /dom playground/i })
  ).toBeVisible();

  await page.getByRole('tab', { name: /preview/i }).click();

  // The sandbox is isolated from the host page: allow-scripts only.
  const frame = page.locator('iframe[title="Code preview"]');
  await expect(frame).toHaveAttribute('sandbox', 'allow-scripts');

  // Real execution: the starter counter renders and reacts to clicks.
  const preview = page.frameLocator('iframe[title="Code preview"]');
  await expect(preview.getByText('Count: 0')).toBeVisible({ timeout: 15000 });

  await preview.getByRole('button', { name: /increment/i }).click();
  await expect(preview.getByText('Count: 1')).toBeVisible();
});

test('derived-values mission recomputes its total from source state', async ({
  page,
}) => {
  await page.goto('/mission/derived-values');

  await expect(
    page.getByRole('heading', { name: /derived values/i })
  ).toBeVisible();

  await page.getByRole('tab', { name: /preview/i }).click();

  const preview = page.frameLocator('iframe[title="Code preview"]');
  // Real execution: the derived total renders and updates on interaction.
  await expect(preview.getByText(/= \$40/)).toBeVisible({ timeout: 15000 });

  await preview.getByRole('button', { name: /add one/i }).click();
  await expect(preview.getByText(/= \$60/)).toBeVisible();
});
