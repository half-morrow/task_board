import { FullConfig } from '@playwright/test';

const pollIntervalMs = 1_000;
const timeoutMs = 60_000;

async function waitForUrl(url: string, accept: (_response: Response) => boolean) {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (accept(response)) return;
      lastError = new Error(`Unexpected status ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for ${url}`);
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error('Playwright baseURL is not configured');

  const normalizedBaseURL = String(baseURL).replace(/\/$/, '');
  await waitForUrl(normalizedBaseURL, (response) => response.ok);
  await waitForUrl(`${normalizedBaseURL}/api/v1/auth/me`, (response) => response.status === 401 || response.ok);
}
