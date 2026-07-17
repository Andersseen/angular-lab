/** Shared auth input validation (see specs/auth.md "Password Policy"). */

/** Returns an error message when the password is too weak, else null. */
export function validatePassword(password: string): string | null {
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must be at least 8 characters and include a letter and a number.';
  }
  return null;
}
