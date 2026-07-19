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
  // One local retry absorbs transient local-server/browser hiccups
  // (e.g. ERR_NETWORK_IO_SUSPENDED) without masking real failures; CI retries more.
  retries: process.env['CI'] ? 2 : 1,
  // All tests share one local D1 (SQLite) database and per-IP auth rate-limit
  // buckets, so they must run serially: parallel workers cause write contention
  // and rate-limit-bucket collisions that make the auth flows flaky. CI already
  // runs single-worker; pin local to match.
  workers: 1,
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
