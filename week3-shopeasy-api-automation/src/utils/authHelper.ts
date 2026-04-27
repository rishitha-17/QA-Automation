import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import config from '../../config/config';
import type { AuthClientResult, LoginResult } from '../types/api.types';

/**
 * Login with the given credentials and return the token + userId.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const tempCtx = await playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
  const response = await tempCtx.post(config.endpoints.auth.login, {
    data: { email, password },
  });
  const data = await response.json();
  await tempCtx.dispose();
  return { token: data.token as string, userId: data.userId as number };
}

/**
 * Login as admin and return an authenticated API context.
 */
export async function getAdminClient(): Promise<AuthClientResult> {
  const { token, userId } = await login(
    config.credentials.admin.email,
    config.credentials.admin.password
  );
  const client = await playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return { client, token, userId };
}

/**
 * Login as the generic test user and return an authenticated API context.
 */
export async function getTestUserClient(): Promise<AuthClientResult> {
  const { token, userId } = await login(
    config.credentials.testUser.email,
    config.credentials.testUser.password
  );
  const client = await playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return { client, token, userId };
}

/**
 * Creates an authenticated API context for a given token.
 */
export async function createAuthenticatedContext(token: string): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
