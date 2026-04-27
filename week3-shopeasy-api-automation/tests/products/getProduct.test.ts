import { test, expect } from '@playwright/test';
import config from '../../config/config';
import {
  validProductId,
  nonExistentProductId,
  invalidProductId,
  negativeProductId,
  zeroProductId,
  floatProductId,
} from '../../test-data/products.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { Product } from '../../src/types/api.types';

/**
 * Test Suite: GET /products/{id}
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-PROD-007  Valid product ID                   → 200 + full product object
 *
 * ── Not Found ─────────────────────────────────────────────────────────────────
 * TC-PROD-008  Non-existent ID (99999)            → 404
 *
 * ── Invalid Input ─────────────────────────────────────────────────────────────
 * TC-PROD-009  String ID ("abc")                  → 400 or 404
 * TC-PROD-015  Negative ID (-1)                   → 400 or 404
 * TC-PROD-016  Zero ID (0)                        → 400 or 404
 * TC-PROD-017  Float ID ("1.5")                   → 400 or 404
 */
test.describe('GET /products/:id', () => {
  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-PROD-007 | should return 200 with full product schema for a valid ID', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(validProductId));
    const data = await response.json() as Product;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('id', validProductId);
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('category');
    expect(data).toHaveProperty('stock');
    expect(typeof data.price).toBe('number');
    expect(data.price).toBeGreaterThan(0);
    expect(data.stock).toBeGreaterThanOrEqual(0);
  });

  // ── Not Found ─────────────────────────────────────────────────────────────

  test('TC-PROD-008 | should return 404 for a non-existent product ID', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(nonExistentProductId));
    const data = await response.json();

    expect(response.status()).toBe(404);
    expectErrorShape(data);
  });

  // ── Invalid Input ─────────────────────────────────────────────────────────

  test('TC-PROD-009 | should return 4xx for a non-numeric string product ID', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(invalidProductId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('TC-PROD-015 | should return 4xx for a negative product ID (-1)', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(negativeProductId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('TC-PROD-016 | should return 4xx for product ID = 0', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(zeroProductId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('TC-PROD-017 | should return 4xx for a float product ID ("1.5")', async ({ request }) => {
    const response = await request.get(config.endpoints.products.byId(floatProductId));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });
});

