/**
 * Generate a demo user password hash matching functions/api/auth/_crypto.ts.
 * Run with: node scripts/generate-demo-hash.mjs
 */

const ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  return `${bufferToHex(salt)}:${bufferToHex(derived)}`;
}

const password = process.argv[2] || 'Demo1234';
const hash = await hashPassword(password);
console.log(`Password: ${password}`);
console.log(`Hash:     ${hash}`);
