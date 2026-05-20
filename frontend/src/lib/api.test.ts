import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, buildApiUrl } from './api';

const originalFetch = globalThis.fetch;

function mockFailedResponse(body: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => body,
  }) as typeof fetch;
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('api', () => {
  it('leaves requests relative when no API base URL is configured', () => {
    expect(buildApiUrl('/api/v1/auth/login')).toBe('/api/v1/auth/login');
  });

  it('prefixes requests with the configured API base URL', () => {
    expect(buildApiUrl('/api/v1/auth/login', 'https://api.example.com/')).toBe(
      'https://api.example.com/api/v1/auth/login',
    );
  });

  it('sends credentials for auth requests', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 1, username: 'demo' } }),
    });

    await api.login('demo', 'password123');

    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/auth/login',
      expect.objectContaining({ credentials: 'include', method: 'POST' }),
    );
  });

  it('uses the server error message when one is provided', async () => {
    mockFailedResponse({ error: { message: 'ログインできませんでした' } });

    await expect(api.login('demo', 'password123')).rejects.toThrow('ログインできませんでした');
  });

  it('falls back to a Japanese default error message when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as typeof fetch;

    await expect(api.login('demo', 'password123')).rejects.toThrow('リクエストに失敗しました');
  });

  it('falls back to a Japanese default error message when the server does not provide one', async () => {
    mockFailedResponse({});

    await expect(api.login('demo', 'password123')).rejects.toThrow('リクエストに失敗しました');
  });
});
