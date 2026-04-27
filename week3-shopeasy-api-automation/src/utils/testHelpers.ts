import { expect } from '@playwright/test';

/**
 * Assert a standard error response shape: { error: string }
 * Accepts `unknown` so callers can pass response.json() data directly.
 */
export function expectErrorShape(data: unknown): void {
  expect(data).toHaveProperty('error');
  expect(typeof (data as { error: unknown }).error).toBe('string');
}
