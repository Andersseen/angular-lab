import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Angular Lab E2E tests.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  globalSetup: './e2e/global-setup.ts',
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8788',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm build:prod && pnpm exec wrangler pages dev dist/analog/public --port 8788 --compatibility-date=2026-06-27',
    url: 'http://localhost:8788',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
