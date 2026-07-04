-- Seed demo user for local development and manual testing
-- Credentials: demo@angular-lab.dev / Demo1234
-- Run: pnpm db:migrate

INSERT OR IGNORE INTO users (id, email, name, password_hash, password_salt, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@angular-lab.dev',
  'Demo User',
  'c19aa7a0bfb31a749b29bedac7abd0e3:1b36542e4ed740319f5334fd0e4d2f6f4f5951d7a154699647cd4f168253b8cf',
  '',
  1720000000000,
  1720000000000
);
