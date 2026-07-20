import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to English', async () => {
    await render(LanguageSwitcher);

    const select = screen.getByRole('combobox', {
      name: 'Language',
    }) as HTMLSelectElement;
    expect(select.value).toBe('en');
  });

  it('persists the chosen language and updates the select value', async () => {
    await render(LanguageSwitcher);

    const select = screen.getByRole('combobox', {
      name: 'Language',
    }) as HTMLSelectElement;
    await userEvent.selectOptions(select, 'es');

    expect(select.value).toBe('es');
    expect(localStorage.getItem('angular-lab:lang')).toBe('es');
  });
});
