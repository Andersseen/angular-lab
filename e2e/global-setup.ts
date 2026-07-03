import { execSync } from 'node:child_process';

export default function globalSetup(): void {
  // Apply D1 migrations to the local database before running E2E tests.
  execSync('pnpm exec wrangler d1 migrations apply angular-lab-db --local', {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
