import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;

test('guest can sign up and access dashboard', async ({ page }) => {
  await page.goto('/signup');

  await expect(page.getByText('Create account', { exact: true })).toBeVisible();

  const email = uniqueEmail();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Tester');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');

  const submit = page.locator('main').getByRole('button', { name: /sign up/i });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('main').getByText('E2E Tester')).toBeVisible();
  await expect(page.locator('main').getByText(email)).toBeVisible();
});

test('user can log in and log out', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'Password123';

  // Sign up first
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Name' }).fill('Logout Tester');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  // Log out
  await page
    .locator('main')
    .getByRole('button', { name: 'Log out', exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);

  // Log in
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('main').getByText('Logout Tester')).toBeVisible();
});

test('progress syncs across a logout/login cycle', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'Password123';

  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Name' }).fill('Sync Tester');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto('/mission/dom-playground');
  // Assert each step renders before advancing so the run does not race ahead of
  // the live-preview mission's step transitions.
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
  await page.getByRole('button', { name: /^next$/i }).click();
  await page.getByRole('button', { name: /^complete$/i }).click();
  await expect(
    page.locator('volt-card-title').getByText('Mission completed!', { exact: true })
  ).toBeVisible();

  await page.goto('/dashboard');
  await page
    .locator('main')
    .getByRole('button', { name: 'Log out', exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.locator('main').getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  const main = page.locator('main');
  await main.getByRole('tab', { name: /progress/i }).click();
  await expect(main.getByText('DOM Playground')).toBeVisible();
  await expect(main.getByText('100%')).toBeVisible();
});

test('guest sees log in button and cannot access dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
});
