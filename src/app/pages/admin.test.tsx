// @vitest-environment happy-dom

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { Admin } from './admin';

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  window.alert = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async (_input, init) => {
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {};
    if (body?.action === 'get' && body?.key === 'site_config') {
      return new Response(JSON.stringify({
        success: true,
        data: {
          adminUsername: 'admin',
          adminPassword: 'AyBucket2026!',
        },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (body?.action === 'get_bundle') {
      return new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as any);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Admin gate', () => {
  it('shows only the login screen before authentication', () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Panel')).toBeTruthy();
    expect(screen.queryByText('🛠️ Pengaturan Website')).toBeNull();
  });

  it('reveals the admin panel after the correct password', async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getAllByLabelText(/username admin/i)[0], { target: { value: 'admin' } });
    fireEvent.change(screen.getAllByLabelText(/password admin/i)[0], { target: { value: 'AyBucket2026!' } });
    fireEvent.click(screen.getAllByText('MASUK')[0]);

    expect(await screen.findByText('🛠️ Pengaturan Website')).toBeTruthy();
  });
});
