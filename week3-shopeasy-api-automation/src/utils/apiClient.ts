import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import config from '../../config/config';

/**
 * Creates an unauthenticated Playwright API request context.
 */
export async function createApiClient(): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

/**
 * Creates an authenticated Playwright API request context with a Bearer token.
 */
export async function createAuthenticatedClient(token: string): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
