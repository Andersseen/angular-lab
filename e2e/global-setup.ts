import { execSync } from 'node:child_process';

export default function globalSetup(): void {
  // Apply D1 migrations to the local database before running E2E tests.
  execSync('pnpm exec wrangler d1 migrations apply angular-lab-db --local', {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  // Start each run with a clean rate-limit table so reused local D1 state
  // cannot accumulate counters across runs and make auth tests flaky.
  try {
    execSync(
      'pnpm exec wrangler d1 execute angular-lab-db --local --command "DELETE FROM auth_rate_limits"',
      { cwd: process.cwd(), stdio: 'ignore' }
    );
  } catch {
    // Table may not exist yet on a first run before migrations; ignore.
  }
}
