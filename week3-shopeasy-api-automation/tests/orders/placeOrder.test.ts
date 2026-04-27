import { test, expect } from '@playwright/test';
import { getAdminClient } from '../../src/utils/authHelper';
import config from '../../config/config';
import { validCartItem } from '../../test-data/cart.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { PlaceOrderResponse } from '../../src/types/api.types';

/**
 * Test Suite: POST /orders
 *
 * TC-ORD-001  Authenticated + items in cart  → 201 + orderId, total, status
 * TC-ORD-002  Authenticated + empty cart     → 400
 * TC-ORD-003  No auth token                  → 401
 */
test.describe('POST /orders', () => {
  let authContext: APIRequestContext;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  test('TC-ORD-001 | should place an order and return 201 with orderId', async () => {
    await authContext.post(config.endpoints.cart.items, { data: validCartItem });

    const response = await authContext.post(config.endpoints.orders.place);
    const data = await response.json() as PlaceOrderResponse;

    expect(response.status()).toBe(201);
    expect(data).toHaveProperty('orderId');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('message');
    expect(typeof data.orderId).toBe('string');
    expect(typeof data.total).toBe('number');
  });

  test('TC-ORD-002 | should return 400 when cart is empty', async () => {
    const response = await authContext.post(config.endpoints.orders.place);
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-ORD-003 | should return 401 when no auth token is provided', async ({ request }) => {
    const response = await request.post(config.endpoints.orders.place);
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });
});
