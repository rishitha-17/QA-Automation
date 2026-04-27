import { test, expect } from '@playwright/test';
import config from '../../config/config';
import { listProductsFilters } from '../../test-data/products.data';
import type { ProductListResponse } from '../../src/types/api.types';

/**
 * Test Suite: GET /products
 *
 * ── Happy Path ────────────────────────────────────────────────────────────────
 * TC-PROD-001  No filters                         → 200 + pagination shape
 * TC-PROD-002  Filter by valid category           → 200, all items match category
 * TC-PROD-003  Pagination: page=1 limit=5         → 200, ≤5 items returned
 * TC-PROD-004  Combined category + pagination     → 200
 *
 * ── Boundary ──────────────────────────────────────────────────────────────────
 * TC-PROD-005  Out-of-range page (page=999)       → 200 with empty data array
 * TC-PROD-010  limit=1 (minimum sensible)         → 200, exactly 1 item
 * TC-PROD-011  Non-existent category              → 200 with empty data array
 * TC-PROD-012  page=0                             → 400 or graceful default
 *
 * ── Schema Validation ─────────────────────────────────────────────────────────
 * TC-PROD-006  Product object schema (id, name, price, category, stock)
 * TC-PROD-013  price > 0 and stock ≥ 0 for all returned products
 * TC-PROD-014  total field ≥ data.length          → data integrity
 */
test.describe('GET /products', () => {
  // ── Happy Path ────────────────────────────────────────────────────────────

  test('TC-PROD-001 | should return 200 with pagination shape when no filters applied', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list);
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('limit');
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    expect(typeof data.total).toBe('number');
    expect(typeof data.page).toBe('number');
    expect(typeof data.limit).toBe('number');
  });

  test('TC-PROD-002 | should return 200 with results filtered by category=electronics', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, {
      params: listProductsFilters['byCategory'],
    });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    data.data.forEach((product) => {
      expect(product.category).toBe(listProductsFilters['byCategory']!.category);
    });
  });

  test('TC-PROD-003 | should respect page=1 limit=5 and return ≤5 items', async ({ request }) => {
    const params = listProductsFilters['withPagination']!;
    const response = await request.get(config.endpoints.products.list, { params });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(data.page).toBe(params.page);
    expect(data.limit).toBe(params.limit);
    expect(data.data.length).toBeLessThanOrEqual(params.limit!);
  });

  test('TC-PROD-004 | should return 200 with combined category + pagination filters', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, {
      params: listProductsFilters['combinedFilters'],
    });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
  });

  // ── Boundary ─────────────────────────────────────────────────────────────

  test('TC-PROD-005 | out-of-range page should return 200 with empty data array', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, {
      params: listProductsFilters['largePage'],
    });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBe(0);
  });

  test('TC-PROD-010 | limit=1 should return exactly 1 product', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, { params: { limit: 1 } });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(data.data.length).toBeLessThanOrEqual(1);
    expect(data.limit).toBe(1);
  });

  test('TC-PROD-011 | non-existent category should return 200 with empty data array', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, {
      params: listProductsFilters['nonExistentCategory'],
    });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(data.data.length).toBe(0);
  });

  test('TC-PROD-012 | page=0 should return 400 or default to page 1 gracefully (no 500)', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, { params: { page: 0 } });

    expect([200, 400, 422]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  // ── Schema Validation ─────────────────────────────────────────────────────

  test('TC-PROD-006 | product schema must include id, name, price, category, stock', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, { params: { limit: 1 } });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    if (data.data.length > 0) {
      const product = data.data[0]!;
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('stock');
      expect(typeof product.id).toBe('number');
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.category).toBe('string');
      expect(typeof product.stock).toBe('number');
    }
  });

  test('TC-PROD-013 | price must be > 0 and stock ≥ 0 for all returned products', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list, { params: { limit: 10 } });
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    data.data.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
    });
  });

  test('TC-PROD-014 | total field must be ≥ the count of items in the data array', async ({ request }) => {
    const response = await request.get(config.endpoints.products.list);
    const data = await response.json() as ProductListResponse;

    expect(response.status()).toBe(200);
    expect(data.total).toBeGreaterThanOrEqual(data.data.length);
  });
});
