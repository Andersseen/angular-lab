import { render, screen } from '@testing-library/angular';
import { FormField } from './form-field';

describe('FormField', () => {
  it('associates the label with the projected control', async () => {
    await render(
      '<app-form-field label="Email" controlId="email"><input id="email" /></app-form-field>',
      { imports: [FormField] }
    );

    expect(screen.getByLabelText('Email')).toBeTruthy();
  });

  it('shows a validation error with an alert role', async () => {
    await render(
      '<app-form-field label="Email" controlId="email" error="Email is required"><input id="email" /></app-form-field>',
      { imports: [FormField] }
    );

    expect(screen.getByRole('alert').textContent).toContain('Email is required');
  });

  it('hides the hint once an error is shown', async () => {
    await render(
      '<app-form-field label="Password" controlId="pw" hint="8+ characters" error="Too short"><input id="pw" /></app-form-field>',
      { imports: [FormField] }
    );

    expect(screen.queryByText('8+ characters')).toBeNull();
    expect(screen.getByText('Too short')).toBeTruthy();
  });
});
