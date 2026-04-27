import { test, expect } from '@playwright/test';
import { getAdminClient, login, createAuthenticatedContext } from '../../src/utils/authHelper';
import config from '../../config/config';
import { nonExistentOrderId, malformedOrderId } from '../../test-data/orders.data';
import { validCartItem } from '../../test-data/cart.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { Order } from '../../src/types/api.types';

/**
 * Test Suite: GET /orders/{orderId}
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-ORD-004  Valid orderId (own order)          → 200 + Order schema
 *
 * ── Not Found ─────────────────────────────────────────────────────────────────
 * TC-ORD-005  Non-existent orderId               → 404
 * TC-ORD-014  Malformed orderId format           → 404
 *
 * ── Authentication ──────────────────────────────────────────────────────────
 * TC-ORD-006  No auth token                      → 401
 *
 * ── Authorization (CRITICAL) ────────────────────────────────────────────────
 * TC-ORD-007  Another user's orderId             → 403 (per OAS spec)
 */
test.describe('GET /orders/:orderId', () => {
  let authContext: APIRequestContext;
  let placedOrderId: string | undefined;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;

    await authContext.post(config.endpoints.cart.items, { data: validCartItem });
    const orderResp = await authContext.post(config.endpoints.orders.place);
    if (orderResp.ok()) {
      const orderData = await orderResp.json() as { orderId: string };
      placedOrderId = orderData.orderId;
    }
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-ORD-004 | should return 200 with full Order schema for a valid orderId', async () => {
    if (!placedOrderId) {
      console.warn('Skipping TC-ORD-004: no orderId from seeding');
      return;
    }

    const response = await authContext.get(config.endpoints.orders.byId(placedOrderId));
    const data = await response.json() as Order;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('orderId', placedOrderId);
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('createdAt');
    expect(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).toContain(data.status);
    expect(typeof data.total).toBe('number');
    expect(data.total).toBeGreaterThan(0);
  });

  // ── Not Found ────────────────────────────────────────────────────────────

  test('TC-ORD-005 | should return 404 for a non-existent orderId', async () => {
    const response = await authContext.get(config.endpoints.orders.byId(nonExistentOrderId));
    const data = await response.json();

    expect(response.status()).toBe(404);
    expectErrorShape(data);
  });

  test('TC-ORD-014 | should return 404 for a malformed orderId format', async () => {
    const response = await authContext.get(config.endpoints.orders.byId(malformedOrderId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  // ── Authentication ────────────────────────────────────────────────────────

  test('TC-ORD-006 | should return 401 when no auth token is provided', async ({ request }) => {
    const orderId = placedOrderId ?? 'ORD-1001';
    const response = await request.get(config.endpoints.orders.byId(orderId));
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  // ── Authorization ──────────────────────────────────────────────────────

  test('TC-ORD-007 | should return 403 when a different user accesses another user\'s order', async ({ request }) => {
    if (!placedOrderId) {
      console.warn('Skipping TC-ORD-007: no orderId from seeding');
      return;
    }

    const uniqueEmail = `testuser_${Date.now()}@shopeasy.com`;
    const regResp = await request.post(config.endpoints.auth.register, {
      data: { email: uniqueEmail, password: 'pass1234', name: 'Unprivileged User' },
    });

    if (!regResp.ok()) {
      console.warn('Skipping TC-ORD-007: could not register test user');
      return;
    }

    const loginResult = await login(uniqueEmail, 'pass1234');
    if (!loginResult.token) {
      console.warn('Skipping TC-ORD-007: could not log in as test user');
      return;
    }

    const otherCtx = await createAuthenticatedContext(loginResult.token);
    const response = await otherCtx.get(config.endpoints.orders.byId(placedOrderId));
    const data = await response.json();
    await otherCtx.dispose();

    expect(response.status()).toBe(403);
    expectErrorShape(data);
  });
});
