import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;

test('guest can sign up and access dashboard', async ({ page }) => {
  await page.goto('/signup');

  await expect(page.getByText('Create account', { exact: true })).toBeVisible();

  const email = uniqueEmail();
  await page.getByRole('textbox', { name: 'Your name' }).fill('E2E Tester');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('textbox', { name: '••••••••' }).fill('Password123');

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
  await page.getByRole('textbox', { name: 'Your name' }).fill('Logout Tester');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('textbox', { name: '••••••••' }).fill(password);
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  // Log out
  await page.locator('main').getByRole('button', { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/$/);

  // Log in
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('textbox', { name: '••••••••' }).fill(password);
  await page.locator('main').getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('main').getByText('Logout Tester')).toBeVisible();
});

test('guest sees log in button and cannot access dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
});
