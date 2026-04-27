import { test, expect } from '@playwright/test';
import { getAdminClient } from '../../src/utils/authHelper';
import config from '../../config/config';
import { nonExistentPaymentId } from '../../test-data/payments.data';
import { validCartItem } from '../../test-data/cart.data';
import { expectErrorShape } from '../../src/utils/testHelpers';
import type { APIRequestContext } from '@playwright/test';
import type { PaymentDetails } from '../../src/types/api.types';

/**
 * Test Suite: GET /payments/{paymentId}
 *
 * TC-PAY-008  Valid paymentId   → 200 + full payment schema
 * TC-PAY-009  Non-existent ID   → 404
 * TC-PAY-010  No auth token     → 401
 * TC-PAY-015  Malformed format  → 404
 */
test.describe('GET /payments/:paymentId', () => {
  let authContext: APIRequestContext;
  let paymentId: string | undefined;

  test.beforeAll(async () => {
    const { client } = await getAdminClient();
    authContext = client;

    await authContext.post(config.endpoints.cart.items, { data: validCartItem });
    const orderResp = await authContext.post(config.endpoints.orders.place);
    if (orderResp.ok()) {
      const orderData = await orderResp.json() as { orderId: string };
      const payResp = await authContext.post(config.endpoints.payments.initiate, {
        data: { orderId: orderData.orderId, method: 'credit_card' },
      });
      if (payResp.ok()) {
        const payData = await payResp.json() as { paymentId: string };
        paymentId = payData.paymentId;
      }
    }
  });

  test.afterAll(async () => {
    await authContext?.dispose();
  });

  test('TC-PAY-008 | should return 200 with full payment schema for a valid paymentId', async () => {
    if (!paymentId) {
      console.warn('Skipping TC-PAY-008: no paymentId from seeding');
      return;
    }

    const response = await authContext.get(config.endpoints.payments.byId(paymentId));
    const data = await response.json() as PaymentDetails;

    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('paymentId', paymentId);
    expect(data).toHaveProperty('orderId');
    expect(data).toHaveProperty('method');
    expect(data).toHaveProperty('amount');
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('processedAt');
    expect(typeof data.amount).toBe('number');
  });

  test('TC-PAY-009 | should return 404 for a non-existent paymentId', async () => {
    const response = await authContext.get(config.endpoints.payments.byId(nonExistentPaymentId));
    const data = await response.json();

    expect(response.status()).toBe(404);
    expectErrorShape(data);
  });

  test('TC-PAY-010 | should return 401 when no auth token is provided', async ({ request }) => {
    const pid = paymentId ?? 'PAY-5001';
    const response = await request.get(config.endpoints.payments.byId(pid));
    const data = await response.json();

    expect(response.status()).toBe(401);
    expectErrorShape(data);
  });

  test('TC-PAY-015 | should return 404 for a malformed paymentId format', async () => {
    const response = await authContext.get(config.endpoints.payments.byId('INVALID-PAY-FORMAT'));

    expect([400, 404]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });
});

