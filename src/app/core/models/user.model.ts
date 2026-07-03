export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
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
