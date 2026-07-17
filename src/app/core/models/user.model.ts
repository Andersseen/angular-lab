export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  /** Whether the account's email has been verified (soft-block until then). */
  readonly emailVerified?: boolean;
}

/** Response from reset/verification endpoints; `devLink` appears only on localhost. */
export interface AuthActionResponse {
  readonly ok?: boolean;
  readonly message?: string;
  readonly devLink?: string;
  readonly alreadyVerified?: boolean;
}

export interface AuthResponse {
  readonly user: User;
}

export interface AuthError {
  readonly error: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface SignupCredentials {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
