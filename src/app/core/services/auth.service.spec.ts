import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

const MOCK_USER = { id: '1', email: 'ada@example.com', name: 'Ada' };

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches current user on construction', () => {
    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');

    req.flush({ user: MOCK_USER });

    expect(service.user()).toEqual(MOCK_USER);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isGuest()).toBe(false);
  });

  it('handles unauthenticated user', () => {
    const req = httpMock.expectOne('/api/auth/me');
    req.flush({ user: null });

    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isGuest()).toBe(true);
  });

  it('logs in and updates user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: null });

    service.login({ email: 'ada@example.com', password: 'secret' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ user: MOCK_USER });

    expect(service.user()).toEqual(MOCK_USER);
  });

  it('signs up and updates user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: null });

    service
      .signup({ name: 'Ada', email: 'ada@example.com', password: 'secret' })
      .subscribe();

    const req = httpMock.expectOne('/api/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush({ user: MOCK_USER });

    expect(service.user()).toEqual(MOCK_USER);
  });

  it('logs out and clears user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: MOCK_USER });
    expect(service.isAuthenticated()).toBe(true);

    service.logout().subscribe();

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });

    expect(service.user()).toBeNull();
  });

  it('requests a password reset', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: null });

    let response: { message?: string } | undefined;
    service
      .requestPasswordReset('ada@example.com')
      .subscribe((res) => (response = res));

    const req = httpMock.expectOne('/api/auth/request-reset');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'ada@example.com' });
    req.flush({ ok: true, message: 'Sent' });

    expect(response?.message).toBe('Sent');
  });

  it('resets the password with a token', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: null });

    service.resetPassword('tok123', 'Newpass1').subscribe();

    const req = httpMock.expectOne('/api/auth/reset');
    expect(req.request.body).toEqual({ token: 'tok123', password: 'Newpass1' });
    req.flush({ ok: true });
  });

  it('verifies email and refetches the user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: MOCK_USER });

    service.verifyEmail('vtok').subscribe();

    const req = httpMock.expectOne('/api/auth/verify-email');
    expect(req.request.body).toEqual({ token: 'vtok' });
    req.flush({ ok: true });

    // Success triggers a refetch of the current user.
    httpMock
      .expectOne('/api/auth/me')
      .flush({ user: { ...MOCK_USER, emailVerified: true } });
    expect(service.user()?.emailVerified).toBe(true);
  });

  it('logs out everywhere and clears user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: MOCK_USER });

    service.logoutEverywhere().subscribe();

    const req = httpMock.expectOne('/api/auth/logout-all');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });

    expect(service.user()).toBeNull();
  });

  it('deletes the account and clears user', () => {
    httpMock.expectOne('/api/auth/me').flush({ user: MOCK_USER });

    service.deleteAccount().subscribe();

    const req = httpMock.expectOne('/api/auth/delete-account');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });

    expect(service.user()).toBeNull();
  });
});
