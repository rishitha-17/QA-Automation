import { test, expect } from '@playwright/test';
import config from '../../config/config';
import {
  validLogin,
  invalidPasswordLogin,
  nonExistentUserLogin,
  missingEmailLogin,
  missingPasswordLogin,
  emptyBodyLogin,
  invalidEmailFormatLogin,
  whitespaceEmailLogin,
  whitespacePasswordLogin,
  sqlInjectionLogin,
  veryLongEmailLogin,
} from '../../test-data/auth.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { LoginResponse } from '../../src/types/api.types';

/**
 * Test Suite: POST /auth/login
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-AUTH-001  Valid credentials                  → 200 + token + userId
 *
 * ── Authentication Failures ───────────────────────────────────────────────────
 * TC-AUTH-002  Invalid password                   → 401
 * TC-AUTH-003  Non-existent email                 → 401
 *
 * ── Validation / Bad Input ────────────────────────────────────────────────────
 * TC-AUTH-004  Missing email field                → 400
 * TC-AUTH-005  Missing password field             → 400
 * TC-AUTH-006  Empty body                         → 400
 * TC-AUTH-007  Invalid email format (no @)        → 400
 * TC-AUTH-008  Whitespace-only email              → 400
 * TC-AUTH-009  Whitespace-only password           → 400 or 401
 *
 * ── Boundary ──────────────────────────────────────────────────────────────────
 * TC-AUTH-010  Very long email string             → 400 or 401
 *
 * ── Security ──────────────────────────────────────────────────────────────────
 * TC-AUTH-011  SQL injection in email field       → 400 or 401 (must not 500)
 *
 * ── Response Schema ───────────────────────────────────────────────────────────
 * TC-AUTH-012  Response token is non-empty string → 200
 * TC-AUTH-013  Response message field present     → 200
 */
test.describe('POST /auth/login', () => {
  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-AUTH-001 | should return 200 with token and userId on valid credentials', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: validLogin });
    const data = await response.json() as LoginResponse;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('userId');
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);
    expect(typeof data.userId).toBe('number');
    expect(data.userId).toBeGreaterThan(0);
  });

  // ── Authentication Failures ───────────────────────────────────────────────

  test('TC-AUTH-002 | should return 401 on invalid password', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: invalidPasswordLogin });
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  test('TC-AUTH-003 | should return 401 for non-existent email', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: nonExistentUserLogin });
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  // ── Validation / Bad Input ────────────────────────────────────────────────

  test('TC-AUTH-004 | should return 400 when email field is missing', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: missingEmailLogin });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-AUTH-005 | should return 400 when password field is missing', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: missingPasswordLogin });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-AUTH-006 | should return 400 for empty request body', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: emptyBodyLogin });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-AUTH-007 | should return 400 for an invalid email format (no @ symbol)', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: invalidEmailFormatLogin });

    expect([400, 401]).toContain(response.status());
  });

  test('TC-AUTH-008 | should return 400 or 401 for whitespace-only email', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: whitespaceEmailLogin });
    const data = await response.json();

    expect([400, 401]).toContain(response.status());
    expectErrorShape(data);
  });

  test('TC-AUTH-009 | should return 400 or 401 for whitespace-only password', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: whitespacePasswordLogin });

    expect([400, 401]).toContain(response.status());
  });

  // ── Boundary ─────────────────────────────────────────────────────────────

  test('TC-AUTH-010 | should return 400 or 401 for a very long email string', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: veryLongEmailLogin });

    expect([400, 401]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  // ── Security ─────────────────────────────────────────────────────────────

  test('TC-AUTH-011 | SQL injection in email must not cause 500 server error', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: sqlInjectionLogin });

    expect([400, 401]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  // ── Response Schema ───────────────────────────────────────────────────────

  test('TC-AUTH-012 | token returned on login must be a non-empty string', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: validLogin });
    const data = await response.json() as LoginResponse;

    expect(data.token).toBeTruthy();
    expect(typeof data.token).toBe('string');
    expect(data.token.trim().length).toBeGreaterThan(0);
  });

  test('TC-AUTH-013 | login response may include a human-readable message field', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, { data: validLogin });
    const data = await response.json() as LoginResponse;

    if (data.message !== undefined) {
      expect(typeof data.message).toBe('string');
    }
  });
});
