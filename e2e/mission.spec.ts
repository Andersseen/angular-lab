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
  await expect(
    page.locator('volt-card-title').getByText('A living counter', { exact: true })
  ).toBeVisible();

  await page.getByRole('tab', { name: /editor/i }).click();
  await expect(page.locator('vertex-editor')).toBeVisible();

  await page.getByRole('button', { name: /next/i }).click();
  await expect(
    page.locator('volt-card-title').getByText('Add double count', { exact: true })
  ).toBeVisible();
});

test('mission catalog lists missions', async ({ page }) => {
  await page.goto('/missions');

  await expect(page.getByRole('heading', { name: /missions/i })).toBeVisible();
  await expect(page.getByText(/reactive signals/i)).toBeVisible();
  await expect(page.getByText(/modern angular routing/i)).toBeVisible();
});

test('guest can browse to a mission and complete it end to end', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Missions', exact: true }).click();
  await expect(page).toHaveURL(/\/missions$/);

  await page
    .locator('a[href="/mission/dom-playground"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/mission\/dom-playground$/);
  await expect(
    page.getByRole('heading', { name: /dom playground/i })
  ).toBeVisible();

  // concept -> example -> practice -> comparison -> checkpoint.
  // Assert each step renders before advancing so the run does not race ahead
  // of the live-preview mission's step transitions.
  const stepTitles = [
    'A real counter',
    'Add a Decrement button',
    'Imperative DOM vs declarative templates',
    'Quick check',
  ];
  for (const title of stepTitles) {
    await page.getByRole('button', { name: /^next$/i }).click();
    await expect(
      page.locator('volt-card-title').getByText(title, { exact: true })
    ).toBeVisible();
  }

  await page.getByRole('radio', { name: /inside the provided/i }).click();
  await page
    .getByRole('radio', { name: /friendly plain-language message/i })
    .click();
  await page
    .getByRole('radio', { name: /templates remove boilerplate/i })
    .click();
  await page.getByRole('button', { name: /check answers/i }).click();
  await expect(page.getByText('Correct!').first()).toBeVisible();

  // checkpoint -> summary
  await page.getByRole('button', { name: /^next$/i }).click();
  await page.getByRole('button', { name: /^complete$/i }).click();

  await expect(
    page.locator('volt-card-title').getByText('Mission completed!', { exact: true })
  ).toBeVisible();
});

test('learner can complete a checkpoint using only the keyboard', async ({
  page,
}) => {
  await page.goto('/mission/dom-playground');

  // Advance one step per keypress, asserting each transition so the loop does
  // not press Enter faster than the step content re-renders.
  const stepTitles = [
    'A real counter',
    'Add a Decrement button',
    'Imperative DOM vs declarative templates',
    'Quick check',
  ];
  for (const title of stepTitles) {
    await page.getByRole('button', { name: /^next$/i }).focus();
    await page.keyboard.press('Enter');
    await expect(
      page.locator('volt-card-title').getByText(title, { exact: true })
    ).toBeVisible();
  }

  const questions = [
    /inside the provided/i,
    /friendly plain-language message/i,
    /templates remove boilerplate/i,
  ];
  for (const optionName of questions) {
    const radio = page.getByRole('radio', { name: optionName });
    await radio.focus();
    await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  }

  await page.getByRole('button', { name: /check answers/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Correct!').first()).toBeVisible();

  await page.getByRole('button', { name: /^next$/i }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^complete$/i }).focus();
  await page.keyboard.press('Enter');

  await expect(
    page.locator('volt-card-title').getByText('Mission completed!', { exact: true })
  ).toBeVisible();
});
