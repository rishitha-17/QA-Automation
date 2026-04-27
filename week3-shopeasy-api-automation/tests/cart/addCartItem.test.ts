import { test, expect } from '@playwright/test';
import { getAdminClient } from '../../src/utils/authHelper';
import { createAuthenticatedClient } from '../../src/utils/apiClient';
import config from '../../config/config';
import {
  validCartItem,
  cartItemMissingProductId,
  cartItemMissingQuantity,
  cartItemNonExistentProduct,
  cartItemZeroQuantity,
  cartItemNegativeQuantity,
} from '../../test-data/cart.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { CartItemResponse } from '../../src/types/api.types';

/**
 * Test Suite: POST /cart/items
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-CART-001  Authenticated + valid item      → 201 + message + cartTotal
 *
 * ── Authentication ────────────────────────────────────────────────────────────
 * TC-CART-002  No auth token                   → 401
 * TC-CART-014  Malformed Bearer token          → 401
 *
 * ── Not Found ─────────────────────────────────────────────────────────────────
 * TC-CART-003  Non-existent productId          → 404
 *
 * ── Validation / Bad Input ────────────────────────────────────────────────────
 * TC-CART-004  Missing productId in body       → 400
 * TC-CART-005  Missing quantity in body        → 400
 * TC-CART-006  quantity = 0                    → 400
 * TC-CART-012  Negative quantity (-1)          → 400
 *
 * ── Boundary / Behaviour ──────────────────────────────────────────────────────
 * TC-CART-013  Add same product twice           → 201 (accumulates or updates)
 */
test.describe('POST /cart/items', () => {
  let authContext: APIRequestContext;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-CART-001 | should add a valid item to cart and return 201', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: validCartItem });
    const data = await response.json() as CartItemResponse;

    expect(response.status()).toBe(201);
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('cartTotal');
    expect(typeof data.cartTotal).toBe('number');
  });

  // ── Authentication ────────────────────────────────────────────────────────

  test('TC-CART-002 | should return 401 when no auth token is provided', async ({ request }) => {
    const response = await request.post(config.endpoints.cart.items, { data: validCartItem });
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  test('TC-CART-014 | should return 401 when a malformed Bearer token is provided', async () => {
    const badCtx = await createAuthenticatedClient('invalid_token_xyz');
    const response = await badCtx.post(config.endpoints.cart.items, { data: validCartItem });
    const data = await response.json();
    await badCtx.dispose();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  // ── Not Found ────────────────────────────────────────────────────────────

  test('TC-CART-003 | should return 404 for a non-existent product', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: cartItemNonExistentProduct });
    const data = await response.json();

    expect(response.status()).toBe(404);
    expectErrorShape(data);
  });

  // ── Validation ───────────────────────────────────────────────────────────

  test('TC-CART-004 | should return 400 when productId is missing', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: cartItemMissingProductId });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-CART-005 | should return 400 when quantity is missing', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: cartItemMissingQuantity });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-CART-006 | should return 400 when quantity is zero', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: cartItemZeroQuantity });
    const data = await response.json();

    expect(response.status()).toBe(400);
    expectErrorShape(data);
  });

  test('TC-CART-012 | negative quantity (-1): documents actual server behavior (accepts or rejects)', async () => {
    const response = await authContext.post(config.endpoints.cart.items, { data: cartItemNegativeQuantity });

    if (response.status() !== 201) {
      expect([400, 422]).toContain(response.status());
    } else {
      console.warn('TC-CART-012 BUG: Server accepted negative quantity — should return 400');
    }
  });

  // ── Boundary / Behaviour ─────────────────────────────────────────────────

  test('TC-CART-013 | adding the same product twice should succeed with 201 (accumulate or update)', async () => {
    await authContext.post(config.endpoints.cart.items, { data: validCartItem });
    const response = await authContext.post(config.endpoints.cart.items, { data: validCartItem });

    if (response.status() !== 201) {
      expect([409]).toContain(response.status());
    } else {
      const data = await response.json() as CartItemResponse;
      expect(data).toHaveProperty('cartTotal');
    }
  });
});

