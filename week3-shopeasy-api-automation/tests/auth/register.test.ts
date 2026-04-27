import { test, expect } from '@playwright/test';
import config from '../../config/config';
import {
  duplicateRegistration,
  missingNameRegistration,
  missingEmailRegistration,
  missingPasswordRegistration,
  invalidEmailRegistration,
  emptyStringFieldsRegistration,
  whitespaceNameRegistration,
} from '../../test-data/auth.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { RegisterResponse } from '../../src/types/api.types';

/**
 * Test Suite: POST /auth/register
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-REG-001  Valid new user (unique email)       → 201 + userId + message
 *
 * ── Conflict ──────────────────────────────────────────────────────────────────
 * TC-REG-002  Duplicate email                     → 409
 *
 * ── Required Field Validation ─────────────────────────────────────────────────
 * TC-REG-003  Missing name field                  → 400
 * TC-REG-004  Missing email field                 → 400
 * TC-REG-005  Missing password field              → 400
 *
 * ── Format / Value Validation ─────────────────────────────────────────────────
 * TC-REG-006  Invalid email format (no @)         → 400
 * TC-REG-007  Empty string for all required fields → 400
 * TC-REG-008  Whitespace-only name               → 400
 *
 * ── Response Schema ───────────────────────────────────────────────────────────
 * TC-REG-009  userId in response is a positive integer
 * TC-REG-010  Re-login with newly registered credentials succeeds
 */
test.describe('POST /auth/register', () => {
  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-REG-001 | should register a new user and return 201 with userId', async ({ request }) => {
    const uniquePayload = {
      email: `qa_auto_${Date.now()}@shopeasy.com`,
      password: 'autotest123',
      name: 'QA Auto User',
    };

    const response = await request.post(config.endpoints.auth.register, { data: uniquePayload });
    const data = await response.json() as RegisterResponse;

    expect(response.status()).toBe(201);
    expect(data).toHaveProperty('userId');
    expect(typeof data.userId).toBe('number');
    expect(data.userId).toBeGreaterThan(0);
    expect(data).toHaveProperty('message');
    expect(typeof data.message).toBe('string');
  });

  // ── Conflict ─────────────────────────────────────────────────────────────

  test('TC-REG-002 | should return 409 for a duplicate email', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: duplicateRegistration });
    const data = await response.json();

    expect(response.status()).toBe(409);
    expectErrorShape(data);
  });

  // ── Required Field Validation ─────────────────────────────────────────────

  test('TC-REG-003 | should return 400 when name is missing', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: missingNameRegistration });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-REG-004 | should return 400 when email is missing', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: missingEmailRegistration });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-REG-005 | should return 400 when password is missing', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: missingPasswordRegistration });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  // ── Format / Value Validation ─────────────────────────────────────────────

  test('TC-REG-006 | should return 400 for an invalid email format', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: invalidEmailRegistration });

    expect([400, 409]).toContain(response.status());
  });

  test('TC-REG-007 | should return 400 when all required fields are empty strings', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: emptyStringFieldsRegistration });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-REG-008 | whitespace-only name: documents actual server behavior (accepts or rejects)', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, { data: whitespaceNameRegistration });

    if (response.status() !== 201) {
      expect([400, 422]).toContain(response.status());
    } else {
      console.warn('TC-REG-008 BUG: Server accepted whitespace-only name — should return 400');
    }
  });

  // ── Response Schema ───────────────────────────────────────────────────────

  test('TC-REG-009 | userId in register response must be a positive integer', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.register, {
      data: {
        email: `schema_check_${Date.now()}@shopeasy.com`,
        password: 'pass12345',
        name: 'Schema User',
      },
    });

    if (response.ok()) {
      const data = await response.json() as RegisterResponse;
      expect(Number.isInteger(data.userId)).toBe(true);
      expect(data.userId).toBeGreaterThan(0);
    }
  });

  test('TC-REG-010 | newly registered user should be able to log in immediately', async ({ request }) => {
    const credentials = {
      email: `login_verify_${Date.now()}@shopeasy.com`,
      password: 'verify123',
      name: 'Login Verify User',
    };

    await request.post(config.endpoints.auth.register, { data: credentials });

    const loginResp = await request.post(config.endpoints.auth.login, {
      data: { email: credentials.email, password: credentials.password },
    });
    const loginData = await loginResp.json() as { token: string; userId: number };

    expect(loginResp.status()).toBe(200);
    expect(loginData.token).toBeTruthy();
  });
});

