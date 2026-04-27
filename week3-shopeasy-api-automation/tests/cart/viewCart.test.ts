import { test, expect } from '@playwright/test';
import { getAdminClient } from '../../src/utils/authHelper';
import { createAuthenticatedClient } from '../../src/utils/apiClient';
import config from '../../config/config';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { CartResponse } from '../../src/types/api.types';

/**
 * Test Suite: GET /cart
 *
 * TC-CART-007  Authenticated               → 200 + cart shape (items, subtotal, itemCount)
 * TC-CART-008  No auth token               → 401
 * TC-CART-015  Malformed Bearer token      → 401
 */
test.describe('GET /cart', () => {
  let authContext: APIRequestContext;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  test('TC-CART-007 | should return 200 with cart shape when authenticated', async () => {
    const response = await authContext.get(config.endpoints.cart.view);
    const data = await response.json() as CartResponse;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('subtotal');
    expect(data).toHaveProperty('itemCount');
    expect(Array.isArray(data.items)).toBe(true);
    expect(typeof data.subtotal).toBe('number');
    expect(typeof data.itemCount).toBe('number');
  });

  test('TC-CART-008 | should return 401 when no auth token is provided', async ({ request }) => {
    const response = await request.get(config.endpoints.cart.view);
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  test('TC-CART-015 | should return 401 when a malformed Bearer token is provided', async () => {
    const badCtx = await createAuthenticatedClient('malformed_token_abc');
    const response = await badCtx.get(config.endpoints.cart.view);
    const data = await response.json();
    await badCtx.dispose();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });
});

