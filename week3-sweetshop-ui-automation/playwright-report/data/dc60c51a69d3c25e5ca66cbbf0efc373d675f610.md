# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sweets-page.spec.ts >> Sweets Page @smoke @regression >> TC-ATB-007: Basket displays correct price for a fractional-price item (Drumsticks £0.20)
- Location: tests/sweets-page.spec.ts:346:7

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "https://sweetshop.netlify.app/sweets", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading [level=1] [ref=e5]
  - paragraph
  - paragraph
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SweetsPage } from '../page-objects/SweetsPage';
  3   | 
  4   | test.describe('Sweets Page @smoke @regression', () => {
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
> 7   |     await page.goto('/sweets');
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  8   |     // networkidle waits for network quiet; waitForSelector ensures product JS has rendered
  9   |     // before any test interacts with cards — eliminates the flaky half-loaded-page race.
  10  |     await page.waitForLoadState('networkidle');
  11  |     await page.waitForSelector('a.addItem', { state: 'visible' });
  12  |   });
  13  | 
  14  |   test('TC-SW-001: Page loads with correct title and heading', async ({ page }) => {
  15  |     await expect(page).toHaveTitle(/Sweet Shop/i);
  16  |     await expect(page.getByRole('heading', { name: /Browse sweets/i })).toBeVisible();
  17  |   });
  18  | 
  19  |   // Covers count, price format, and button availability in one pass
  20  |   test('TC-SW-002: 16 products each have a name, a price (£X.XX) and an enabled Add to Basket link', async ({ page }) => {
  21  |     const sp = new SweetsPage(page);
  22  |     await expect(sp.addToBasketBtns).toHaveCount(16);
  23  |     // Prices are plain <p> tags containing £
  24  |     const prices = page.locator('p').filter({ hasText: /£\d+\.\d{2}/ });
  25  |     const count  = await prices.count();
  26  |     expect(count).toBeGreaterThan(0);
  27  |     for (let i = 0; i < count; i++) {
  28  |       expect(await prices.nth(i).innerText()).toMatch(/£\d+\.\d{2}/);
  29  |     }
  30  |     for (let i = 0; i < await sp.addToBasketBtns.count(); i++) {
  31  |       await expect(sp.addToBasketBtns.nth(i)).toBeVisible();
  32  |     }
  33  |   });
  34  | 
  35  |   // DEF-010: img/whan.jpg (Wham Bars) is a known broken image — filename typo (whan vs wham).
  36  |   // Test verifies no NEW broken images appear beyond the documented defect.
  37  |   test('TC-SW-003: All product images load without broken src', async ({ page }) => {
  38  |     // networkidle ensures all image HTTP requests have settled (success or error)
  39  |     await page.waitForLoadState('networkidle');
  40  |     const images = page.locator('.card img');
  41  |     const count = await images.count();
  42  |     expect(count).toBeGreaterThan(0);
  43  | 
  44  |     const KNOWN_BROKEN = ['whan.jpg']; // DEF-010: Wham Bars image filename is misspelled
  45  |     const broken: string[] = [];
  46  | 
  47  |     for (let i = 0; i < count; i++) {
  48  |       const [src, w] = await images.nth(i).evaluate(
  49  |         (img: HTMLImageElement) => [img.getAttribute('src') ?? '', img.naturalWidth] as [string, number]
  50  |       );
  51  |       if (w === 0) broken.push(src);
  52  |     }
  53  | 
  54  |     const unexpectedBroken = broken.filter(src => !KNOWN_BROKEN.some(n => src.includes(n)));
  55  |     expect(
  56  |       unexpectedBroken,
  57  |       `Unexpected broken images (not in known-defects list): ${unexpectedBroken.join(', ')}`
  58  |     ).toHaveLength(0);
  59  |   });
  60  | 
  61  |   // Covers valid range (£0.10 – £1.50) — one test for both bounds
  62  |   test('TC-SW-004: All product prices are within range £0.10 – £1.50', async ({ page }) => {
  63  |     const prices = page.locator('p').filter({ hasText: /£\d+\.\d{2}/ });
  64  |     const count = await prices.count();
  65  |     expect(count).toBeGreaterThan(0);
  66  |     for (let i = 0; i < count; i++) {
  67  |       const val = parseFloat((await prices.nth(i).innerText()).replace('£', ''));
  68  |       expect(val).toBeGreaterThanOrEqual(0.10);
  69  |       expect(val).toBeLessThanOrEqual(1.50);
  70  |     }
  71  |   });
  72  | 
  73  |   // DEF-002: basket counter updates via localStorage on page load — not reactive on click.
  74  |   // Reload to verify the counter persists correctly after each add.
  75  |   test('TC-ATB-001: Basket counter increments correctly — single add and repeated add', async ({ page }) => {
  76  |     const sp = new SweetsPage(page);
  77  |     await sp.addProductByIndex(0);
  78  |     // Use locator assertion (auto-retries) so init() has time to update the badge
  79  |     await page.goto('/sweets');
  80  |     await page.waitForLoadState('networkidle');
  81  |     await page.waitForSelector('a.addItem', { state: 'visible' });
  82  |     await expect(sp.navBasket).toContainText('1');
  83  |     await sp.addProductByIndex(0);
  84  |     await page.goto('/sweets');
  85  |     await page.waitForLoadState('networkidle');
  86  |     await page.waitForSelector('a.addItem', { state: 'visible' });
  87  |     await expect(sp.navBasket).toContainText('2');
  88  |   });
  89  | 
  90  |   // Edge case: each card must expose the three data attributes the basket JS relies on
  91  |   test('TC-SW-005: All Add to Basket buttons have required data-id, data-name, and data-price attributes', async ({ page }) => {
  92  |     const sp = new SweetsPage(page);
  93  |     const count = await sp.addToBasketBtns.count();
  94  |     expect(count).toBe(16);
  95  |     for (let i = 0; i < count; i++) {
  96  |       const btn = sp.addToBasketBtns.nth(i);
  97  |       const dataId    = await btn.getAttribute('data-id');
  98  |       const dataName  = await btn.getAttribute('data-name');
  99  |       const dataPrice = await btn.getAttribute('data-price');
  100 |       expect(dataId,    `Button ${i} missing data-id`).toBeTruthy();
  101 |       expect(dataName,  `Button ${i} missing data-name`).toBeTruthy();
  102 |       expect(dataPrice, `Button ${i} missing data-price`).toBeTruthy();
  103 |       // data-price must be a valid number
  104 |       expect(parseFloat(dataPrice!), `Button ${i} data-price not a valid number`).toBeGreaterThan(0);
  105 |     }
  106 |   });
  107 | 
```