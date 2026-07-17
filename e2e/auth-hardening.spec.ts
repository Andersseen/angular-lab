import { test, expect } from '@playwright/test';

const uniqueEmail = () =>
  `reset-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

const octet = () => Math.floor(Math.random() * 254) + 1;
const uniqueIp = () => `10.${octet()}.${octet()}.${octet()}`;

test('user can reset their password and log in with the new one', async ({
  page,
}) => {
  // Isolate this test's rate-limit bucket from other auth tests.
  await page.setExtraHTTPHeaders({ 'CF-Connecting-IP': uniqueIp() });

  const email = uniqueEmail();
  const oldPassword = 'Password123';
  const newPassword = 'Newpass456';

  // Sign up, then log out so we can prove the reset → login flow.
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Your name' }).fill('Reset Tester');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('textbox', { name: '••••••••' }).fill(oldPassword);
  await page.locator('main').getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.locator('main').getByRole('button', { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/$/);

  // Request a reset link. On localhost the endpoint echoes the link.
  await page.goto('/forgot-password');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('button', { name: /send reset link/i }).click();

  const devLink = page.getByTestId('dev-reset-link');
  await expect(devLink).toBeVisible();
  const href = await devLink.getAttribute('href');
  expect(href).toContain('/reset-password?token=');

  // Follow the link and choose a new password.
  await page.goto(href!);
  await page.getByRole('textbox', { name: '••••••••' }).fill(newPassword);
  await page.getByRole('button', { name: /update password/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/password was updated/i)).toBeVisible();

  // The new password works.
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
  await page.getByRole('textbox', { name: '••••••••' }).fill(newPassword);
  await page.locator('main').getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('login is rate limited after too many attempts', async ({ page }) => {
  const ip = uniqueIp();
  const statuses: number[] = [];

  // Login is limited to 10 attempts per window; the 11th+ must be 429.
  for (let i = 0; i < 13; i++) {
    const res = await page.request.post('/api/auth/login', {
      headers: { 'CF-Connecting-IP': ip },
      data: { email: 'nobody@example.com', password: 'wrongpass' },
    });
    statuses.push(res.status());
  }

  expect(statuses[0]).toBe(401); // fresh bucket: first attempt is just invalid
  expect(statuses).toContain(429); // limiter kicks in within the window
});
