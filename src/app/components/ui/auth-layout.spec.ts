import { render, screen } from '@testing-library/angular';
import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  it('renders the heading, card title and projected content', async () => {
    await render(
      '<app-auth-layout heading="Welcome back" subtitle="Continue your journey" cardTitle="Log in"><p>form goes here</p></app-auth-layout>',
      { imports: [AuthLayout] }
    );

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy();
    expect(screen.getByText('Continue your journey')).toBeTruthy();
    expect(screen.getByText('Log in')).toBeTruthy();
    expect(screen.getByText('form goes here')).toBeTruthy();
  });
});
