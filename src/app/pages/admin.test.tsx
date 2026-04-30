// @vitest-environment happy-dom

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Admin } from './admin';

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  window.alert = vi.fn();
});

describe('Admin gate', () => {
  it('shows only the login screen before authentication', () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Login')).toBeTruthy();
    expect(screen.queryByText('🛠️ Pengaturan Website')).toBeNull();
  });

  it('reveals the admin panel after the correct password', () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getAllByLabelText(/password admin/i)[0], { target: { value: 'elbouquet' } });
    fireEvent.click(screen.getAllByText('Masuk')[0]);

    expect(screen.getByText('🛠️ Pengaturan Website')).toBeTruthy();
  });
});
