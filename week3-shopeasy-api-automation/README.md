# ShopEasy API Automation Suite

> API automation testing framework for the **ShopEasy Order Management API** (OAS 3.0)
> covering Authentication → Products → Cart → Orders → Payments.

---

## Project Structure

```
api-automation/
├── config/
│   └── config.js               # Centralised config (baseURL, credentials, endpoints)
├── src/
│   └── utils/
│       ├── apiClient.js        # Axios instance + auth client factory
│       ├── authHelper.js       # Login helpers (admin / test-user)
│       └── testHelpers.js      # Shared assertion + safeRequest utilities
├── test-data/
│   ├── auth.data.js            # Payloads for login & register
│   ├── products.data.js        # Product IDs & filter combos
│   ├── cart.data.js            # Cart item payloads
│   ├── orders.data.js          # Order IDs for lookup & cancel
│   └── payments.data.js        # Payment payloads & IDs
├── tests/
│   ├── auth/
│   │   ├── login.test.js       # TC-AUTH-001 → TC-AUTH-006
│   │   └── register.test.js    # TC-REG-001  → TC-REG-005
│   ├── products/
│   │   ├── listProducts.test.js # TC-PROD-001 → TC-PROD-006
│   │   └── getProduct.test.js  # TC-PROD-007 → TC-PROD-009
│   ├── cart/
│   │   ├── addCartItem.test.js  # TC-CART-001 → TC-CART-006
│   │   ├── viewCart.test.js     # TC-CART-007 → TC-CART-008
│   │   └── removeCartItem.test.js # TC-CART-009 → TC-CART-011
│   ├── orders/
│   │   ├── placeOrder.test.js  # TC-ORD-001 → TC-ORD-003
│   │   ├── getOrder.test.js    # TC-ORD-004 → TC-ORD-006
│   │   └── cancelOrder.test.js # TC-ORD-008 → TC-ORD-011
│   ├── payments/
│   │   ├── initiatePayment.test.js # TC-PAY-001 → TC-PAY-007
│   │   └── getPayment.test.js  # TC-PAY-008 → TC-PAY-010
│   └── e2e/
│       └── orderLifecycle.test.js # TC-E2E-001 → TC-E2E-011
├── artifacts/
│   ├── coverageMatrix.js       # Endpoint × scenario coverage map
│   └── testCaseInventory.js    # Flat test case list with priority & type
├── reports/                    # Generated — HTML report + coverage (git-ignored)
├── .env                        # Local environment config (git-ignored)
├── .env.example                # Template for .env
└── package.json
```

---

## Prerequisites

| Tool    | Version  |
|---------|----------|
| Node.js | ≥ 18.x   |
| npm     | ≥ 9.x    |

Ensure the ShopEasy server is running at `http://localhost:3000` before executing tests.

---

## Setup

```bash
cd api-automation
npm install
cp .env.example .env   # edit if your server uses a different port
```

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all test suites |
| `npm run test:auth` | Auth module only |
| `npm run test:products` | Products module only |
| `npm run test:cart` | Cart module only |
| `npm run test:orders` | Orders module only |
| `npm run test:payments` | Payments module only |
| `npm run test:e2e` | End-to-end lifecycle only |
| `npm run test:coverage` | All tests + coverage report |
| `npm run test:report` | All tests + open HTML report in browser |

---

## Reports & Artifacts

### Execution Report (HTML)
Generated at `reports/test-report.html` after every run.  
Open it in a browser — lists every suite, test case, pass/fail status, and error messages.

### Coverage Report
Generated at `reports/coverage/` via Istanbul (built into Jest).  
Open `reports/coverage/lcov-report/index.html` for a line-by-line view.

### Coverage Matrix
```bash
node artifacts/coverageMatrix.js
```
Prints endpoint × scenario status table to the terminal.

### Test Case Inventory
```bash
node artifacts/testCaseInventory.js
```
Prints the full test ID, module, priority, type, and description table.

---

## Test Case Summary

| Module   | Test Cases | Positive | Negative | Security | E2E | Boundary/Schema |
|----------|-----------|----------|----------|----------|-----|-----------------|
| Auth     | 11        | 2        | 8        | 0        | 0   | 0               |
| Products | 9         | 5        | 2        | 0        | 0   | 2               |
| Cart     | 11        | 3        | 4        | 3        | 0   | 1               |
| Orders   | 10        | 2        | 5        | 3        | 0   | 0               |
| Payments | 10        | 2        | 5        | 3        | 0   | 0               |
| E2E      | 11        | 0        | 0        | 0        | 11  | 0               |
| **Total**| **62**    | **14**   | **24**   | **9**    | **11** | **3**        |

---

## API Under Test

**ShopEasy Order Management API v1.0.0**

| Tag      | Method | Path                          | Auth |
|----------|--------|-------------------------------|------|
| Auth     | POST   | /auth/login                   | No   |
| Auth     | POST   | /auth/register                | No   |
| Products | GET    | /products                     | No   |
| Products | GET    | /products/{id}                | No   |
| Cart     | POST   | /cart/items                   | Yes  |
| Cart     | GET    | /cart                         | Yes  |
| Cart     | DELETE | /cart/items/{itemId}          | Yes  |
| Orders   | POST   | /orders                       | Yes  |
| Orders   | GET    | /orders/{orderId}             | Yes  |
| Orders   | DELETE | /orders/{orderId}/cancel      | Yes  |
| Payments | POST   | /payments                     | Yes  |
| Payments | GET    | /payments/{paymentId}         | Yes  |

---

## Environment Variables

| Variable            | Default                       | Description               |
|---------------------|-------------------------------|---------------------------|
| `BASE_URL`          | `http://localhost:3000`        | API base URL              |
| `ADMIN_EMAIL`       | `admin@shopeasy.com`           | Seeded admin email        |
| `ADMIN_PASSWORD`    | `password123`                  | Seeded admin password     |
| `TEST_USER_EMAIL`   | `testuser@shopeasy.com`        | Generic test user         |
| `TEST_USER_PASSWORD`| `testpass123`                  | Generic test user password|
| `TEST_TIMEOUT`      | `30000`                        | Per-test timeout (ms)     |
