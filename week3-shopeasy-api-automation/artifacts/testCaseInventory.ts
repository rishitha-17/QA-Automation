interface TestCase {
  id: string;
  module: string;
  endpoint: string;
  priority: 'P0' | 'P1' | 'P2';
  type: 'Positive' | 'Negative' | 'Security' | 'E2E' | 'Boundary' | 'Schema';
  description: string;
}

export const testCases: TestCase[] = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  { id: 'TC-AUTH-001', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P0', type: 'Positive', description: 'Valid credentials return token' },
  { id: 'TC-AUTH-002', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P0', type: 'Negative', description: 'Invalid password → 401' },
  { id: 'TC-AUTH-003', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P1', type: 'Negative', description: 'Non-existent email → 401' },
  { id: 'TC-AUTH-004', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P1', type: 'Negative', description: 'Missing email → 400' },
  { id: 'TC-AUTH-005', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P1', type: 'Negative', description: 'Missing password → 400' },
  { id: 'TC-AUTH-006', module: 'Auth',     endpoint: 'POST /auth/login',                 priority: 'P2', type: 'Negative', description: 'Empty body → 400' },
  { id: 'TC-REG-001',  module: 'Auth',     endpoint: 'POST /auth/register',              priority: 'P0', type: 'Positive', description: 'Valid registration → 201 + userId' },
  { id: 'TC-REG-002',  module: 'Auth',     endpoint: 'POST /auth/register',              priority: 'P1', type: 'Negative', description: 'Duplicate email → 409' },
  { id: 'TC-REG-003',  module: 'Auth',     endpoint: 'POST /auth/register',              priority: 'P1', type: 'Negative', description: 'Missing name → 400' },
  { id: 'TC-REG-004',  module: 'Auth',     endpoint: 'POST /auth/register',              priority: 'P1', type: 'Negative', description: 'Missing email → 400' },
  { id: 'TC-REG-005',  module: 'Auth',     endpoint: 'POST /auth/register',              priority: 'P1', type: 'Negative', description: 'Missing password → 400' },

  // ── Products ──────────────────────────────────────────────────────────────
  { id: 'TC-PROD-001', module: 'Products', endpoint: 'GET /products',                    priority: 'P0', type: 'Positive', description: 'List products with pagination shape' },
  { id: 'TC-PROD-002', module: 'Products', endpoint: 'GET /products',                    priority: 'P1', type: 'Positive', description: 'Filter by category' },
  { id: 'TC-PROD-003', module: 'Products', endpoint: 'GET /products',                    priority: 'P1', type: 'Positive', description: 'Pagination params respected' },
  { id: 'TC-PROD-004', module: 'Products', endpoint: 'GET /products',                    priority: 'P2', type: 'Positive', description: 'Combined category + pagination' },
  { id: 'TC-PROD-005', module: 'Products', endpoint: 'GET /products',                    priority: 'P2', type: 'Boundary', description: 'Out-of-range page returns empty' },
  { id: 'TC-PROD-006', module: 'Products', endpoint: 'GET /products',                    priority: 'P1', type: 'Schema',   description: 'Product schema validation' },
  { id: 'TC-PROD-007', module: 'Products', endpoint: 'GET /products/{id}',               priority: 'P0', type: 'Positive', description: 'Valid ID returns full product' },
  { id: 'TC-PROD-008', module: 'Products', endpoint: 'GET /products/{id}',               priority: 'P1', type: 'Negative', description: 'Non-existent ID → 404' },
  { id: 'TC-PROD-009', module: 'Products', endpoint: 'GET /products/{id}',               priority: 'P2', type: 'Negative', description: 'String ID → 400 or 404' },

  // ── Cart ──────────────────────────────────────────────────────────────────
  { id: 'TC-CART-001', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P0', type: 'Positive', description: 'Add valid item → 201' },
  { id: 'TC-CART-002', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-CART-003', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P1', type: 'Negative', description: 'Non-existent product → 404' },
  { id: 'TC-CART-004', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P1', type: 'Negative', description: 'Missing productId → 400' },
  { id: 'TC-CART-005', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P1', type: 'Negative', description: 'Missing quantity → 400' },
  { id: 'TC-CART-006', module: 'Cart',     endpoint: 'POST /cart/items',                 priority: 'P2', type: 'Boundary', description: 'Quantity = 0 → 400' },
  { id: 'TC-CART-007', module: 'Cart',     endpoint: 'GET /cart',                        priority: 'P0', type: 'Positive', description: 'Authenticated cart view → 200' },
  { id: 'TC-CART-008', module: 'Cart',     endpoint: 'GET /cart',                        priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-CART-009', module: 'Cart',     endpoint: 'DELETE /cart/items/{itemId}',      priority: 'P0', type: 'Positive', description: 'Remove existing item → 200' },
  { id: 'TC-CART-010', module: 'Cart',     endpoint: 'DELETE /cart/items/{itemId}',      priority: 'P1', type: 'Negative', description: 'Item not in cart → 404' },
  { id: 'TC-CART-011', module: 'Cart',     endpoint: 'DELETE /cart/items/{itemId}',      priority: 'P0', type: 'Security', description: 'No token → 401' },

  // ── Orders ────────────────────────────────────────────────────────────────
  { id: 'TC-ORD-001',  module: 'Orders',   endpoint: 'POST /orders',                     priority: 'P0', type: 'Positive', description: 'Place order from cart → 201' },
  { id: 'TC-ORD-002',  module: 'Orders',   endpoint: 'POST /orders',                     priority: 'P1', type: 'Negative', description: 'Empty cart → 400' },
  { id: 'TC-ORD-003',  module: 'Orders',   endpoint: 'POST /orders',                     priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-ORD-004',  module: 'Orders',   endpoint: 'GET /orders/{orderId}',            priority: 'P0', type: 'Positive', description: 'Valid orderId returns Order schema' },
  { id: 'TC-ORD-005',  module: 'Orders',   endpoint: 'GET /orders/{orderId}',            priority: 'P1', type: 'Negative', description: 'Non-existent orderId → 404' },
  { id: 'TC-ORD-006',  module: 'Orders',   endpoint: 'GET /orders/{orderId}',            priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-ORD-008',  module: 'Orders',   endpoint: 'DELETE /orders/{orderId}/cancel',  priority: 'P0', type: 'Positive', description: 'Cancel pending order → 200' },
  { id: 'TC-ORD-009',  module: 'Orders',   endpoint: 'DELETE /orders/{orderId}/cancel',  priority: 'P1', type: 'Negative', description: 'Non-existent orderId → 404' },
  { id: 'TC-ORD-010',  module: 'Orders',   endpoint: 'DELETE /orders/{orderId}/cancel',  priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-ORD-011',  module: 'Orders',   endpoint: 'DELETE /orders/{orderId}/cancel',  priority: 'P1', type: 'Negative', description: 'Double cancel → 422' },

  // ── Payments ──────────────────────────────────────────────────────────────
  { id: 'TC-PAY-001',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P0', type: 'Positive', description: 'Credit card payment → 201' },
  { id: 'TC-PAY-002',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P1', type: 'Positive', description: 'UPI payment → 201' },
  { id: 'TC-PAY-003',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P1', type: 'Negative', description: 'Duplicate payment → 409' },
  { id: 'TC-PAY-004',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P1', type: 'Negative', description: 'Missing orderId → 400' },
  { id: 'TC-PAY-005',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P1', type: 'Negative', description: 'Missing method → 400' },
  { id: 'TC-PAY-006',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P1', type: 'Negative', description: 'Non-existent orderId → 404' },
  { id: 'TC-PAY-007',  module: 'Payments', endpoint: 'POST /payments',                   priority: 'P0', type: 'Security', description: 'No token → 401' },
  { id: 'TC-PAY-008',  module: 'Payments', endpoint: 'GET /payments/{paymentId}',        priority: 'P0', type: 'Positive', description: 'Valid paymentId → full schema' },
  { id: 'TC-PAY-009',  module: 'Payments', endpoint: 'GET /payments/{paymentId}',        priority: 'P1', type: 'Negative', description: 'Non-existent paymentId → 404' },
  { id: 'TC-PAY-010',  module: 'Payments', endpoint: 'GET /payments/{paymentId}',        priority: 'P0', type: 'Security', description: 'No token → 401' },

  // ── E2E ───────────────────────────────────────────────────────────────────
  { id: 'TC-E2E-001',  module: 'E2E',      endpoint: 'POST /auth/login',                 priority: 'P0', type: 'E2E', description: 'Login step' },
  { id: 'TC-E2E-002',  module: 'E2E',      endpoint: 'GET /products',                    priority: 'P0', type: 'E2E', description: 'Browse products step' },
  { id: 'TC-E2E-003',  module: 'E2E',      endpoint: 'GET /products/{id}',               priority: 'P0', type: 'E2E', description: 'Get product details step' },
  { id: 'TC-E2E-004',  module: 'E2E',      endpoint: 'POST /cart/items',                 priority: 'P0', type: 'E2E', description: 'Add to cart step' },
  { id: 'TC-E2E-005',  module: 'E2E',      endpoint: 'GET /cart',                        priority: 'P0', type: 'E2E', description: 'View cart step' },
  { id: 'TC-E2E-006',  module: 'E2E',      endpoint: 'POST /orders',                     priority: 'P0', type: 'E2E', description: 'Place order step' },
  { id: 'TC-E2E-007',  module: 'E2E',      endpoint: 'GET /orders/{orderId}',            priority: 'P0', type: 'E2E', description: 'Check order status step' },
  { id: 'TC-E2E-008',  module: 'E2E',      endpoint: 'POST /payments',                   priority: 'P0', type: 'E2E', description: 'Initiate payment step' },
  { id: 'TC-E2E-009',  module: 'E2E',      endpoint: 'GET /payments/{paymentId}',        priority: 'P0', type: 'E2E', description: 'Get payment status step' },
  { id: 'TC-E2E-010',  module: 'E2E',      endpoint: 'POST /orders',                     priority: 'P0', type: 'E2E', description: 'Place second order (cancel flow)' },
  { id: 'TC-E2E-011',  module: 'E2E',      endpoint: 'DELETE /orders/{orderId}/cancel',  priority: 'P0', type: 'E2E', description: 'Cancel order step' },
];

function printInventory(): void {
  const pad = (str: string, len: number): string => String(str).padEnd(len);

  console.log('\n' + '═'.repeat(120));
  console.log('  ShopEasy API — Test Case Inventory');
  console.log('═'.repeat(120));
  console.log(
    `  ${pad('ID', 14)} ${pad('Module', 10)} ${pad('Priority', 8)} ${pad('Type', 10)} ${pad('Endpoint', 40)} Description`
  );
  console.log('─'.repeat(120));

  testCases.forEach((tc) => {
    console.log(
      `  ${pad(tc.id, 14)} ${pad(tc.module, 10)} ${pad(tc.priority, 8)} ${pad(tc.type, 10)} ${pad(tc.endpoint, 40)} ${tc.description}`
    );
  });

  console.log('─'.repeat(120));
  console.log(`  Total test cases: ${testCases.length}`);
  console.log('═'.repeat(120) + '\n');
}

if (require.main === module) {
  printInventory();
}
