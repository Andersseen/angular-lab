import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import type {
  AuthError,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<User | null | undefined>(undefined);
  readonly isLoading = signal(false);

  readonly isAuthenticated = computed(() => !!this.user());
  readonly isGuest = computed(() => this.user() === null);

  constructor() {
    this.fetchCurrentUser().subscribe();
  }

  private apiUrl(path: string): string {
    return `/api/auth${path}`;
  }

  fetchCurrentUser(): Observable<User | null> {
    return this.http
      .get<{ user: User | null }>(this.apiUrl('/me'), {
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(
        map((response) => response.user),
        tap((user) => this.user.set(user)),
        catchError(() => {
          this.user.set(null);
          return of(null);
        })
      );
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(this.apiUrl('/login'), credentials).pipe(
      tap((response) => this.user.set(response.user)),
      map((response) => response.user),
      tap(() => this.isLoading.set(false)),
      catchError((error) => {
        this.isLoading.set(false);
        throw this.extractError(error);
      })
    );
  }

  signup(credentials: SignupCredentials): Observable<User> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(this.apiUrl('/signup'), credentials).pipe(
      tap((response) => this.user.set(response.user)),
      map((response) => response.user),
      tap(() => this.isLoading.set(false)),
      catchError((error) => {
        this.isLoading.set(false);
        throw this.extractError(error);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.apiUrl('/logout'), {}).pipe(
      tap(() => this.user.set(null)),
      catchError(() => {
        this.user.set(null);
        return of(undefined);
      })
    );
  }

  private extractError(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as AuthError).error === 'string'
    ) {
      return (error as AuthError).error;
    }
    return 'Something went wrong. Please try again.';
  }
}
