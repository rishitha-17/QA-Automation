import { test, expect } from '@playwright/test';
import { getAdminClient } from '../../src/utils/authHelper';
import { createAuthenticatedClient } from '../../src/utils/apiClient';
import config from '../../config/config';
import { validCartItem, nonExistentItemId, stringItemId } from '../../test-data/cart.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { RemoveCartItemResponse } from '../../src/types/api.types';

/**
 * Test Suite: DELETE /cart/items/{itemId}
 *
 * TC-CART-009  Remove an existing item         → 200 + message + cartTotal
 * TC-CART-010  Remove item not in cart          → 404
 * TC-CART-011  No auth token                    → 401
 * TC-CART-016  String (non-numeric) itemId      → 400 or 404
 * TC-CART-017  Malformed Bearer token           → 401
 */
test.describe('DELETE /cart/items/:itemId', () => {
  let authContext: APIRequestContext;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;
    await authContext.post(config.endpoints.cart.items, { data: validCartItem });
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  test('TC-CART-009 | should remove an existing cart item and return 200', async () => {
    const response = await authContext.delete(config.endpoints.cart.removeItem(validCartItem.productId));
    const data = await response.json() as RemoveCartItemResponse;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('cartTotal');
  });

  test('TC-CART-010 | should return 404 when itemId is not in cart', async () => {
    const response = await authContext.delete(config.endpoints.cart.removeItem(nonExistentItemId));
    const data = await response.json();

    expect(response.status()).toBe(404);
    expectErrorShape(data);
  });

  test('TC-CART-011 | should return 401 when no auth token is provided', async ({ request }) => {
    const response = await request.delete(config.endpoints.cart.removeItem(validCartItem.productId));
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  test('TC-CART-016 | should return 4xx for a non-numeric string itemId', async () => {
    const response = await authContext.delete(config.endpoints.cart.removeItem(stringItemId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('TC-CART-017 | should return 401 when a malformed Bearer token is provided', async () => {
    const badCtx = await createAuthenticatedClient('garbage_token_000');
    const response = await badCtx.delete(config.endpoints.cart.removeItem(validCartItem.productId));
    const data = await response.json();
    await badCtx.dispose();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });
});

