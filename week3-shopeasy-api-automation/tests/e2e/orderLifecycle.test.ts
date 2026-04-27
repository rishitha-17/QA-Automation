import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../src/utils/apiClient';
import config from '../../config/config';
import type { APIRequestContext } from '@playwright/test';

/**
 * End-to-End Test: Full Order Lifecycle
 *
 * TC-E2E-001  Login as admin         → token issued
 * TC-E2E-002  List products          → at least one product available
 * TC-E2E-003  Get product by ID      → product details returned
 * TC-E2E-004  Add product to cart    → item appears in cart
 * TC-E2E-005  View cart              → item count > 0
 * TC-E2E-006  Place order            → orderId assigned
 * TC-E2E-007  Get order details      → status = pending
 * TC-E2E-008  Make payment           → paymentId assigned
 * TC-E2E-009  Get payment status     → status field present
 * TC-E2E-010  Place second order     → orderId assigned (for cancel flow)
 * TC-E2E-011  Cancel second order    → status = cancelled
 */
test.describe('E2E | Full Order Lifecycle', () => {
  let authContext: APIRequestContext;
  let productId: number;
  let orderId: string;
  let paymentId: string;
  let secondOrderId: string;

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  test('TC-E2E-001 | Login as admin and receive a Bearer token', async ({ request }) => {
    const response = await request.post(config.endpoints.auth.login, {
      data: {
        email: config.credentials.admin.email,
        password: config.credentials.admin.password,
      },
    });
    const data = await response.json() as { token: string; userId: number };

    expect(response.status()).toBe(200);
    expect(data.token).toBeDefined();

    authContext = await createAuthenticatedClient(data.token);
  });

  test('TC-E2E-002 | List all products — catalogue should not be empty', async () => {
    const response = await authContext.get(config.endpoints.products.list);
    const data = await response.json() as {
      total: number;
      data: Array<{ id: number; price: number; category: string }>;
    };

    expect(response.status()).toBe(200);
    expect(data.data.length).toBeGreaterThan(0);

    productId = data.data[0]!.id;
  });

  test('TC-E2E-003 | Get product by ID — returns correct product details', async () => {
    const response = await authContext.get(config.endpoints.products.byId(productId));
    const data = await response.json() as { id: number; price: number };

    expect(response.status()).toBe(200);
    expect(data.id).toBe(productId);
    expect(data.price).toBeGreaterThan(0);
  });

  test('TC-E2E-004 | Add picked product to cart', async () => {
    const response = await authContext.post(config.endpoints.cart.items, {
      data: { productId, quantity: 1 },
    });
    const data = await response.json() as { cartTotal: number };

    expect(response.status()).toBe(201);
    expect(data.cartTotal).toBeGreaterThan(0);
  });

  test('TC-E2E-005 | View cart — should contain at least one item', async () => {
    const response = await authContext.get(config.endpoints.cart.view);
    const data = await response.json() as { itemCount: number; subtotal: number };

    expect(response.status()).toBe(200);
    expect(data.itemCount).toBeGreaterThan(0);
    expect(data.subtotal).toBeGreaterThan(0);
  });

  test('TC-E2E-006 | Place order from cart — orderId is assigned', async () => {
    const response = await authContext.post(config.endpoints.orders.place);
    const data = await response.json() as { orderId: string; total: number };

    expect(response.status()).toBe(201);
    expect(typeof data.orderId).toBe('string');
    expect(data.total).toBeGreaterThan(0);

    orderId = data.orderId;
  });

  test('TC-E2E-007 | Get order details — status should be pending', async () => {
    const response = await authContext.get(config.endpoints.orders.byId(orderId));
    const data = await response.json() as { orderId: string; status: string };

    expect(response.status()).toBe(200);
    expect(data.orderId).toBe(orderId);
    expect(data.status).toBe('pending');
  });

  test('TC-E2E-008 | Initiate payment for the order — paymentId is assigned', async () => {
    const response = await authContext.post(config.endpoints.payments.initiate, {
      data: { orderId, method: 'credit_card' },
    });
    const data = await response.json() as { paymentId: string; amount: number };

    expect(response.status()).toBe(201);
    expect(typeof data.paymentId).toBe('string');
    expect(data.amount).toBeGreaterThan(0);

    paymentId = data.paymentId;
  });

  test('TC-E2E-009 | Get payment status — status field present', async () => {
    const response = await authContext.get(config.endpoints.payments.byId(paymentId));
    const data = await response.json() as { paymentId: string; status: string; method: string };

    expect(response.status()).toBe(200);
    expect(data.paymentId).toBe(paymentId);
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('method', 'credit_card');
  });

  test('TC-E2E-010 | Place a second order for cancel flow', async () => {
    await authContext.post(config.endpoints.cart.items, {
      data: { productId, quantity: 1 },
    });

    const response = await authContext.post(config.endpoints.orders.place);
    const data = await response.json() as { orderId: string };

    expect(response.status()).toBe(201);

    secondOrderId = data.orderId;
  });

  test('TC-E2E-011 | Cancel the second order — status becomes cancelled', async () => {
    const response = await authContext.delete(config.endpoints.orders.cancel(secondOrderId));
    const data = await response.json() as { orderId: string; status: string };

    expect(response.status()).toBe(200);
    expect(data.orderId).toBe(secondOrderId);
    expect(data.status).toBe('cancelled');
  });
});

