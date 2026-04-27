# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store.spec.ts >> Store API >> GET /store/inventory - returns a map of status counts
- Location: tests/store.spec.ts:22:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  1   | /**
  2   |  * Store API Tests — https://petstore.swagger.io/v2/store
  3   |  *
  4   |  * Covers:
  5   |  *  GET    /store/inventory           – returns pet inventories by status
  6   |  *  POST   /store/order               – place an order for a pet
  7   |  *  GET    /store/order/{orderId}     – find purchase order by ID
  8   |  *  DELETE /store/order/{orderId}     – delete purchase order by ID
  9   |  */
  10  | 
  11  | import { test, expect } from '@playwright/test';
  12  | import { randomId, buildOrder } from '../utils/helpers';
  13  | 
  14  | test.describe.serial('Store API', () => {
  15  |   // The Petstore GET /store/order/{orderId} validates orderId is between 1–10.
  16  |   // We use a low random number to stay within range and still minimize collisions.
  17  |   const orderId = Math.floor(Math.random() * 9) + 1; // 1–9
  18  |   const petId = randomId();
  19  | 
  20  |   // ── INVENTORY ──────────────────────────────────────────────────────────────
  21  | 
  22  |   test('GET /store/inventory - returns a map of status counts', async ({ request }) => {
  23  |     const response = await request.get('store/inventory');
  24  | 
> 25  |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  26  |     const body = await response.json();
  27  |     expect(typeof body).toBe('object');
  28  |     expect(body).not.toBeNull();
  29  |     // Inventory values should be numbers
  30  |     for (const [, count] of Object.entries(body)) {
  31  |       expect(typeof count).toBe('number');
  32  |     }
  33  |   });
  34  | 
  35  |   // ── CREATE ORDER ───────────────────────────────────────────────────────────
  36  | 
  37  |   test('POST /store/order - place a new order', async ({ request }) => {
  38  |     const response = await request.post('store/order', {
  39  |       data: buildOrder(orderId, petId),
  40  |     });
  41  | 
  42  |     expect(response.status()).toBe(200);
  43  |     const body = await response.json();
  44  |     expect(body.id).toBe(orderId);
  45  |     expect(body.petId).toBe(petId);
  46  |     expect(body.quantity).toBe(2);
  47  |     expect(body.status).toBe('placed');
  48  |     expect(body.complete).toBe(false);
  49  |   });
  50  | 
  51  |   // ── READ ORDER ─────────────────────────────────────────────────────────────
  52  | 
  53  |   test('GET /store/order/{orderId} - retrieve the order', async ({ request }) => {
  54  |     const response = await request.get(`store/order/${orderId}`);
  55  | 
  56  |     expect(response.status()).toBe(200);
  57  |     const body = await response.json();
  58  |     expect(body.id).toBe(orderId);
  59  |     expect(body.petId).toBe(petId);
  60  |     expect(body.status).toBe('placed');
  61  |     expect(body).toHaveProperty('shipDate');
  62  |   });
  63  | 
  64  |   // ── DELETE ORDER ───────────────────────────────────────────────────────────
  65  | 
  66  |   test('DELETE /store/order/{orderId} - delete the order', async ({ request }) => {
  67  |     const response = await request.delete(`store/order/${orderId}`);
  68  | 
  69  |     expect(response.status()).toBe(200);
  70  |   });
  71  | 
  72  |   test('GET /store/order/{orderId} - order is no longer retrievable after deletion', async ({ request }) => {
  73  |     const response = await request.get(`store/order/${orderId}`);
  74  | 
  75  |     // Public Petstore pre-populates orders 1–9; after deletion they may be recreated by
  76  |     // the server or by another test runner. Accept 404 (deleted) or 200 (recreated).
  77  |     expect([200, 404]).toContain(response.status());
  78  |   });
  79  | 
  80  |   // ── NEGATIVE CASES ─────────────────────────────────────────────────────────
  81  | 
  82  |   test('GET /store/order/{orderId} - returns 4xx for ID = 0 (below minimum)', async ({ request }) => {
  83  |     const response = await request.get('store/order/0');
  84  | 
  85  |     // Spec says 400 for invalid ID; public Petstore may return 404 instead.
  86  |     expect([400, 404]).toContain(response.status());
  87  |   });
  88  | 
  89  |   test('GET /store/order/{orderId} - returns 404 for non-existent order', async ({ request }) => {
  90  |     const response = await request.get('store/order/10');
  91  | 
  92  |     // May be 200 (pre-populated) or 404 (if cleaned up) — both are acceptable
  93  |     expect([200, 404]).toContain(response.status());
  94  |   });
  95  | 
  96  |   test('POST /store/order - returns 400 for invalid order body', async ({ request }) => {
  97  |     const response = await request.post('store/order', {
  98  |       data: { id: 'not-a-number', petId: 'bad', quantity: -1 },
  99  |     });
  100 | 
  101 |     expect([400, 500]).toContain(response.status());
  102 |   });
  103 | });
  104 | 
```