interface Scenario {
  id: string;
  description: string;
  expectedStatus: number;
  status: 'COVERED' | 'PARTIAL' | 'NOT_COVERED';
}

interface EndpointEntry {
  tag: string;
  method: string;
  path: string;
  testFile: string;
  scenarios: Scenario[];
}

interface CoverageMatrixData {
  metadata: {
    api: string;
    version: string;
    generatedAt: string;
    baseURL: string;
  };
  endpoints: EndpointEntry[];
}

export const coverageMatrix: CoverageMatrixData = {
  metadata: {
    api: 'ShopEasy Order Management API',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    baseURL: 'http://localhost:3000',
  },

  endpoints: [
    // ── Auth ──────────────────────────────────────────────────────────────────
    {
      tag: 'Auth', method: 'POST', path: '/auth/login', testFile: 'tests/auth/login.test.ts',
      scenarios: [
        { id: 'TC-AUTH-001', description: 'Valid credentials',  expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-AUTH-002', description: 'Invalid password',   expectedStatus: 401, status: 'COVERED' },
        { id: 'TC-AUTH-003', description: 'Non-existent user',  expectedStatus: 401, status: 'COVERED' },
        { id: 'TC-AUTH-004', description: 'Missing email',      expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-AUTH-005', description: 'Missing password',   expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-AUTH-006', description: 'Empty body',         expectedStatus: 400, status: 'COVERED' },
      ],
    },
    {
      tag: 'Auth', method: 'POST', path: '/auth/register', testFile: 'tests/auth/register.test.ts',
      scenarios: [
        { id: 'TC-REG-001', description: 'Valid new user',       expectedStatus: 201, status: 'COVERED' },
        { id: 'TC-REG-002', description: 'Duplicate email',      expectedStatus: 409, status: 'COVERED' },
        { id: 'TC-REG-003', description: 'Missing name',         expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-REG-004', description: 'Missing email',        expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-REG-005', description: 'Missing password',     expectedStatus: 400, status: 'COVERED' },
      ],
    },

    // ── Products ──────────────────────────────────────────────────────────────
    {
      tag: 'Products', method: 'GET', path: '/products', testFile: 'tests/products/listProducts.test.ts',
      scenarios: [
        { id: 'TC-PROD-001', description: 'No filters',                expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-002', description: 'Filter by category',        expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-003', description: 'Pagination params',         expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-004', description: 'Combined filters',          expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-005', description: 'Out-of-range page',         expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-006', description: 'Product schema validation', expectedStatus: 200, status: 'COVERED' },
      ],
    },
    {
      tag: 'Products', method: 'GET', path: '/products/{id}', testFile: 'tests/products/getProduct.test.ts',
      scenarios: [
        { id: 'TC-PROD-007', description: 'Valid product ID',    expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PROD-008', description: 'Non-existent ID',     expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-PROD-009', description: 'Invalid string ID',   expectedStatus: 400, status: 'COVERED' },
      ],
    },

    // ── Cart ──────────────────────────────────────────────────────────────────
    {
      tag: 'Cart', method: 'POST', path: '/cart/items', testFile: 'tests/cart/addCartItem.test.ts',
      scenarios: [
        { id: 'TC-CART-001', description: 'Authenticated valid item',    expectedStatus: 201, status: 'COVERED' },
        { id: 'TC-CART-002', description: 'No auth token',               expectedStatus: 401, status: 'COVERED' },
        { id: 'TC-CART-003', description: 'Non-existent productId',      expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-CART-004', description: 'Missing productId',           expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-CART-005', description: 'Missing quantity',            expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-CART-006', description: 'Quantity = 0',                expectedStatus: 400, status: 'COVERED' },
      ],
    },
    {
      tag: 'Cart', method: 'GET', path: '/cart', testFile: 'tests/cart/viewCart.test.ts',
      scenarios: [
        { id: 'TC-CART-007', description: 'Authenticated view cart', expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-CART-008', description: 'No auth token',           expectedStatus: 401, status: 'COVERED' },
      ],
    },
    {
      tag: 'Cart', method: 'DELETE', path: '/cart/items/{itemId}', testFile: 'tests/cart/removeCartItem.test.ts',
      scenarios: [
        { id: 'TC-CART-009', description: 'Remove existing item', expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-CART-010', description: 'Item not in cart',     expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-CART-011', description: 'No auth token',        expectedStatus: 401, status: 'COVERED' },
      ],
    },

    // ── Orders ────────────────────────────────────────────────────────────────
    {
      tag: 'Orders', method: 'POST', path: '/orders', testFile: 'tests/orders/placeOrder.test.ts',
      scenarios: [
        { id: 'TC-ORD-001', description: 'Place order (cart has items)', expectedStatus: 201, status: 'COVERED' },
        { id: 'TC-ORD-002', description: 'Empty cart',                   expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-ORD-003', description: 'No auth token',                expectedStatus: 401, status: 'COVERED' },
      ],
    },
    {
      tag: 'Orders', method: 'GET', path: '/orders/{orderId}', testFile: 'tests/orders/getOrder.test.ts',
      scenarios: [
        { id: 'TC-ORD-004', description: 'Valid orderId',         expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-ORD-005', description: 'Non-existent orderId',  expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-ORD-006', description: 'No auth token',         expectedStatus: 401, status: 'COVERED' },
      ],
    },
    {
      tag: 'Orders', method: 'DELETE', path: '/orders/{orderId}/cancel', testFile: 'tests/orders/cancelOrder.test.ts',
      scenarios: [
        { id: 'TC-ORD-008', description: 'Cancel pending order',              expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-ORD-009', description: 'Non-existent orderId',              expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-ORD-010', description: 'No auth token',                     expectedStatus: 401, status: 'COVERED' },
        { id: 'TC-ORD-011', description: 'Cancel already-cancelled order',    expectedStatus: 422, status: 'COVERED' },
      ],
    },

    // ── Payments ──────────────────────────────────────────────────────────────
    {
      tag: 'Payments', method: 'POST', path: '/payments', testFile: 'tests/payments/initiatePayment.test.ts',
      scenarios: [
        { id: 'TC-PAY-001', description: 'Valid credit_card payment', expectedStatus: 201, status: 'COVERED' },
        { id: 'TC-PAY-002', description: 'Valid upi payment',         expectedStatus: 201, status: 'COVERED' },
        { id: 'TC-PAY-003', description: 'Duplicate payment',         expectedStatus: 409, status: 'COVERED' },
        { id: 'TC-PAY-004', description: 'Missing orderId',           expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-PAY-005', description: 'Missing method',            expectedStatus: 400, status: 'COVERED' },
        { id: 'TC-PAY-006', description: 'Non-existent orderId',      expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-PAY-007', description: 'No auth token',             expectedStatus: 401, status: 'COVERED' },
      ],
    },
    {
      tag: 'Payments', method: 'GET', path: '/payments/{paymentId}', testFile: 'tests/payments/getPayment.test.ts',
      scenarios: [
        { id: 'TC-PAY-008', description: 'Valid paymentId',          expectedStatus: 200, status: 'COVERED' },
        { id: 'TC-PAY-009', description: 'Non-existent paymentId',   expectedStatus: 404, status: 'COVERED' },
        { id: 'TC-PAY-010', description: 'No auth token',            expectedStatus: 401, status: 'COVERED' },
      ],
    },
  ],
};

function printSummary(): void {
  let total = 0;
  let covered = 0;

  coverageMatrix.endpoints.forEach((ep) => {
    ep.scenarios.forEach((sc) => {
      total++;
      if (sc.status === 'COVERED') covered++;
    });
  });

  console.log('\n═══════════════════════════════════════════');
  console.log('  ShopEasy API — Test Coverage Matrix');
  console.log('═══════════════════════════════════════════');
  console.log(`  Total scenarios : ${total}`);
  console.log(`  Covered         : ${covered}`);
  console.log(`  Coverage        : ${((covered / total) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════\n');

  coverageMatrix.endpoints.forEach((ep) => {
    console.log(`  [${ep.method}] ${ep.path}`);
    ep.scenarios.forEach((sc) => {
      const icon = sc.status === 'COVERED' ? '✓' : sc.status === 'PARTIAL' ? '~' : '✗';
      console.log(`    ${icon} ${sc.id} — ${sc.description} (HTTP ${sc.expectedStatus})`);
    });
    console.log('');
  });
}

if (require.main === module) {
  printSummary();
}
