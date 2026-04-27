# Test Execution Guide — Sweet Shop Web Application

**Date:** 2026-04-25

---

## 1. Prerequisites

| Requirement | Version | Check Command |
|---|---|---|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Playwright | v1.44+ | installed via npm |

---

## 2. One-Time Setup

```bash
# 1. Navigate to the project directory
cd /Users/rishitha/Desktop/QA-UI-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. Verify installation
npx playwright --version
```

---

## 3. Running Tests

### Run full suite (all browsers)
```bash
npm test
```

### Run on a single browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run a specific feature file
```bash
npm run test:sweets       # Sweets listing page tests
npm run test:basket       # Basket management tests
npm run test:checkout     # Checkout and form tests
npm run test:login        # Login page tests
npm run test:navigation   # Navigation and about page tests
```

### Run by tag
```bash
# Smoke tests only (fast, critical path)
npm run test:smoke

# Full regression suite
npm run test:regression
```

### Run with browser visible (headed mode)
```bash
npm run test:headed
```

### Run with Playwright UI Mode (interactive)
```bash
npx playwright test --ui
```

---

## 4. Test File Structure

```
QA-UI-automation/
├── playwright.config.ts          # Browser, reporter, base URL config
├── package.json                  # Scripts and dependencies
├── tsconfig.json                 # TypeScript config
│
├── tests/
│   ├── navigation.spec.ts        # TC-NAV-*, TC-AB-* (10 tests)
│   ├── sweets-page.spec.ts       # TC-SW-*, TC-ATB-* (21 tests)
│   ├── basket.spec.ts            # TC-BK-*, TC-DEL-*, TC-PC-* (17 tests)
│   ├── checkout.spec.ts          # TC-BA-*, TC-PY-*, TC-CH-* (30 tests)
│   └── login.spec.ts             # TC-LG-* (11 tests)
│
├── page-objects/
│   ├── BasePage.ts               # Shared: nav, basket counter
│   ├── SweetsPage.ts             # Sweets page interactions
│   ├── BasketPage.ts             # Basket/checkout page interactions
│   └── LoginPage.ts              # Login page interactions
│
└── test-data/
    └── testData.ts               # All test data constants
```

---

## 5. Viewing Reports

After running tests:

```bash
# Open the HTML report in browser
npm run report
# or
npx playwright show-report
```

The report is saved to `./playwright-report/index.html` and includes:
- Pass/fail status per test
- Screenshots on failure
- Video replays on retry
- Traces (open with `npx playwright show-trace`)

---

## 6. CI/CD Integration (GitHub Actions example)

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 7. Troubleshooting

| Problem | Solution |
|---|---|
| Tests timeout | Increase `actionTimeout` / `navigationTimeout` in `playwright.config.ts` |
| Selector not found | Use `npx playwright codegen https://sweetshop.netlify.app` to inspect live selectors |
| Browser fails to launch | Run `npx playwright install` again |
| Tests fail due to basket state | Tests call `localStorage.clear()` in `beforeEach` — verify this runs |
| "baseURL" connection refused | Check internet / VPN; site is at `https://sweetshop.netlify.app` |

---

## 8. Updating Selectors

If the application changes its markup:
1. Run `npx playwright codegen https://sweetshop.netlify.app/sweets`
2. Interact with the element in the browser
3. Copy the generated locator into the relevant Page Object class under `page-objects/`

---

## 9. Test Tagging Reference

| Tag | Meaning | Usage |
|---|---|---|
| `@smoke` | Critical path, fast | Run before every deployment |
| `@regression` | Full coverage | Run nightly or on PR merge |
