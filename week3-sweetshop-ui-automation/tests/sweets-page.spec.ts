import { test, expect } from '@playwright/test';
import { SweetsPage } from '../page-objects/SweetsPage';

test.describe('Sweets Page @smoke @regression', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/sweets');
    // networkidle waits for network quiet; waitForSelector ensures product JS has rendered
    // before any test interacts with cards — eliminates the flaky half-loaded-page race.
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
  });

  test('TC-SW-001: Page loads with correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Sweet Shop/i);
    await expect(page.getByRole('heading', { name: /Browse sweets/i })).toBeVisible();
  });

  // Covers count, price format, and button availability in one pass
  test('TC-SW-002: 16 products each have a name, a price (£X.XX) and an enabled Add to Basket link', async ({ page }) => {
    const sp = new SweetsPage(page);
    await expect(sp.addToBasketBtns).toHaveCount(16);
    // Prices are plain <p> tags containing £
    const prices = page.locator('p').filter({ hasText: /£\d+\.\d{2}/ });
    const count  = await prices.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      expect(await prices.nth(i).innerText()).toMatch(/£\d+\.\d{2}/);
    }
    for (let i = 0; i < await sp.addToBasketBtns.count(); i++) {
      await expect(sp.addToBasketBtns.nth(i)).toBeVisible();
    }
  });

  // DEF-010: img/whan.jpg (Wham Bars) is a known broken image — filename typo (whan vs wham).
  // Test verifies no NEW broken images appear beyond the documented defect.
  test('TC-SW-003: All product images load without broken src', async ({ page }) => {
    // networkidle ensures all image HTTP requests have settled (success or error)
    await page.waitForLoadState('networkidle');
    const images = page.locator('.card img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    const KNOWN_BROKEN = ['whan.jpg']; // DEF-010: Wham Bars image filename is misspelled
    const broken: string[] = [];

    for (let i = 0; i < count; i++) {
      const [src, w] = await images.nth(i).evaluate(
        (img: HTMLImageElement) => [img.getAttribute('src') ?? '', img.naturalWidth] as [string, number]
      );
      if (w === 0) broken.push(src);
    }

    const unexpectedBroken = broken.filter(src => !KNOWN_BROKEN.some(n => src.includes(n)));
    expect(
      unexpectedBroken,
      `Unexpected broken images (not in known-defects list): ${unexpectedBroken.join(', ')}`
    ).toHaveLength(0);
  });

  // Covers valid range (£0.10 – £1.50) — one test for both bounds
  test('TC-SW-004: All product prices are within range £0.10 – £1.50', async ({ page }) => {
    const prices = page.locator('p').filter({ hasText: /£\d+\.\d{2}/ });
    const count = await prices.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const val = parseFloat((await prices.nth(i).innerText()).replace('£', ''));
      expect(val).toBeGreaterThanOrEqual(0.10);
      expect(val).toBeLessThanOrEqual(1.50);
    }
  });

  // DEF-002: basket counter updates via localStorage on page load — not reactive on click.
  // Reload to verify the counter persists correctly after each add.
  test('TC-ATB-001: Basket counter increments correctly — single add and repeated add', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByIndex(0);
    // Use locator assertion (auto-retries) so init() has time to update the badge
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('1');
    await sp.addProductByIndex(0);
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('2');
  });

  // Edge case: each card must expose the three data attributes the basket JS relies on
  test('TC-SW-005: All Add to Basket buttons have required data-id, data-name, and data-price attributes', async ({ page }) => {
    const sp = new SweetsPage(page);
    const count = await sp.addToBasketBtns.count();
    expect(count).toBe(16);
    for (let i = 0; i < count; i++) {
      const btn = sp.addToBasketBtns.nth(i);
      const dataId    = await btn.getAttribute('data-id');
      const dataName  = await btn.getAttribute('data-name');
      const dataPrice = await btn.getAttribute('data-price');
      expect(dataId,    `Button ${i} missing data-id`).toBeTruthy();
      expect(dataName,  `Button ${i} missing data-name`).toBeTruthy();
      expect(dataPrice, `Button ${i} missing data-price`).toBeTruthy();
      // data-price must be a valid number
      expect(parseFloat(dataPrice!), `Button ${i} data-price not a valid number`).toBeGreaterThan(0);
    }
  });

  // Edge case: adds cheapest (£0.10) and most expensive (£1.50) boundary-value products
  test('TC-SW-006: Cheapest (Bubbly £0.10) and most expensive (Swansea Mixture £1.50) products add to basket correctly', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByName('Bubbly');           // £0.10 — minimum price
    await sp.addProductByName('Swansea Mixture');  // £1.50 — maximum price
    // Confirm both items are stored before navigating (badge-gate prevents empty-basket race)
    await expect(sp.navBasket).toContainText('2');
    // Verify both items appear in the basket
    await page.goto('/basket');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Bubbly');
    await expect(page.locator('body')).toContainText('Swansea Mixture');
    // Counter confirmed via badge-gate above; also assert on basket page
    await expect(sp.navBasket).toContainText('2');
  });

  // Edge case: adding 4 different products produces counter = 4 (no merging / no cap)
  test('TC-SW-007: Adding 4 distinct products increments basket counter to 4', async ({ page }) => {
    const sp = new SweetsPage(page);
    const products = ['Chocolate Cups', 'Bon Bons', 'Jellies', 'Nerds'];
    for (const product of products) {
      await sp.addProductByName(product);
    }
    // Counter reads from localStorage on page load — use locator assertion (auto-retries)
    // so init() has time to write the badge before the assertion fires.
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('4');
  });

  // Edge case: page subheading is visible and correct
  test('TC-SW-008: Page shows correct subheading copy', async ({ page }) => {
    await expect(page.locator('p').filter({ hasText: /retro sweets/i }).first()).toBeVisible();
  });

  // ── Data-attribute / Data Integrity ─────────────────────────────────────────

  // Verifies the displayed £ price matches the data-price attribute that the basket JS reads.
  // A mismatch would silently charge the wrong amount.
  test('TC-SW-009: data-price attribute matches the displayed price for every product card', async ({ page }) => {
    const cards = page.locator('.card').filter({ has: page.locator('a.addItem') });
    const count = await cards.count();
    expect(count).toBe(16);
    for (let i = 0; i < count; i++) {
      const card      = cards.nth(i);
      const btn       = card.locator('a.addItem').first();
      const dataPrice = await btn.getAttribute('data-price');
      const displayed = await card.locator('p').filter({ hasText: /£\d+\.\d{2}/ }).first().innerText();
      const attrVal   = parseFloat(dataPrice ?? '');
      const dispVal   = parseFloat(displayed.replace('£', '').trim());
      expect(attrVal, `Card ${i} — data-price=${attrVal} ≠ displayed ${dispVal}`).toBeCloseTo(dispVal, 2);
    }
  });

  // DEF-011: 6 products have data-name ≠ h4 title (plural/singular, full marketing name, or typo)
  //   Card 2  — h4 "Sherbert Discs"     vs data-name "Sherbet Discs"         (spelling typo)
  //   Card 3  — h4 "Bon Bons"           vs data-name "Strawberry Bon Bons"   (extra qualifier)
  //   Card 7  — h4 "Wham Bars"          vs data-name "Wham Bar"              (singular)
  //   Card 8  — h4 "Whistles"           vs data-name "Sweet Whistle"         (different name)
  //   Card 9  — h4 "Sherbert Fountains" vs data-name "Sherbert Fountain"     (singular)
  //   Card 13 — h4 "Drumsticks"         vs data-name "Raspberry Drumstick"   (different name)
  // Test verifies the count of mismatches; fails if NEW unexpected mismatches appear.
  test('TC-SW-010: data-name attribute matches the displayed product title — documents known mismatches', async ({ page }) => {
    const KNOWN_MISMATCHES: Array<[string, string]> = [
      ['Sherbet Discs',       'Sherbert Discs'],      // DEF-011a: spelling typo in data-name
      ['Strawberry Bon Bons', 'Bon Bons'],             // DEF-011b: extra qualifier in data-name
      ['Wham Bar',            'Wham Bars'],            // DEF-011c: singular vs plural
      ['Sweet Whistle',       'Whistles'],             // DEF-011d: completely different name
      ['Sherbert Fountain',   'Sherbert Fountains'],   // DEF-011e: singular vs plural
      ['Raspberry Drumstick', 'Drumsticks'],           // DEF-011f: different marketing name
    ];

    const cards = page.locator('.card').filter({ has: page.locator('a.addItem') });
    const count = await cards.count();
    const unexpected: string[] = [];

    for (let i = 0; i < count; i++) {
      const card      = cards.nth(i);
      const btn       = card.locator('a.addItem').first();
      const dataName  = (await btn.getAttribute('data-name') ?? '').trim();
      const displayed = (await card.locator('h4').first().innerText()).trim();
      if (dataName.toLowerCase() !== displayed.toLowerCase()) {
        const isKnown = KNOWN_MISMATCHES.some(
          ([dn, h4]) => dn.toLowerCase() === dataName.toLowerCase() && h4.toLowerCase() === displayed.toLowerCase(),
        );
        if (!isKnown) {
          unexpected.push(`Card ${i}: data-name="${dataName}" h4="${displayed}"`);
        }
      }
    }
    expect(
      unexpected,
      `Unexpected NEW data-name/h4 mismatches (not in known-defects list): ${unexpected.join(' | ')}`,
    ).toHaveLength(0);
  });

  // Duplicate data-id values would cause basket items to collide / overwrite each other.
  test('TC-SW-011: All 16 Add-to-Basket buttons have unique data-id values', async ({ page }) => {
    const btns  = page.locator('a.addItem');
    const count = await btns.count();
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push((await btns.nth(i).getAttribute('data-id')) ?? '');
    }
    const unique = new Set(ids);
    expect(unique.size, `Duplicate data-id found: [${ids.join(', ')}]`).toBe(count);
  });

  // Regression guard: all 16 known product names must appear on the page.
  test('TC-SW-012: All 16 expected product names are present on the page', async ({ page }) => {
    const EXPECTED = [
      'Chocolate Cups', 'Sherbert Straws', 'Sherbert Discs', 'Bon Bons',
      'Jellies', 'Fruit Salads', 'Bubble Gums', 'Wham Bars',
      'Whistles', 'Sherbert Fountains', 'Swansea Mixture', 'Chocolate Beans',
      'Nerds', 'Drumsticks', 'Bubbly', 'Dolly Mixture',
    ];
    for (const name of EXPECTED) {
      await expect(
        page.locator('.card').filter({ hasText: name }).first(),
        `Product "${name}" not found on page`,
      ).toBeVisible();
    }
  });

  // ── Accessibility ────────────────────────────────────────────────────────────

  // DEF-012: 2 product images are missing the alt attribute entirely (accessibility regression).
  //   img/cups.jpg  (Chocolate Cups, card 0)  — alt attribute absent
  //   img/tat.jpg   (Bubble Gums,   card 6)  — alt attribute absent
  // Test verifies no NEW alt-less images appear beyond the documented defects.
  test('TC-SW-013: All product card images have alt text — documents known missing-alt defects', async ({ page }) => {
    const KNOWN_MISSING_ALT = ['cups.jpg', 'tat.jpg']; // DEF-012
    const imgs  = page.locator('.card img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    const missingAlt: string[] = [];
    for (let i = 0; i < count; i++) {
      const src = (await imgs.nth(i).getAttribute('src')) ?? '';
      const alt =  await imgs.nth(i).getAttribute('alt');
      if (alt === null || alt.trim() === '') missingAlt.push(src);
    }
    const unexpected = missingAlt.filter(src => !KNOWN_MISSING_ALT.some(n => src.includes(n)));
    expect(
      unexpected,
      `Unexpected images with missing alt (not in known-defects list): ${unexpected.join(', ')}`,
    ).toHaveLength(0);
  });

  // ── Card Structure ───────────────────────────────────────────────────────────

  // Every product card must be self-contained: image, title (h4), description, price, and CTA.
  test('TC-SW-014: Every product card contains image, title, description paragraph, price and Add-to-Basket button', async ({ page }) => {
    const cards = page.locator('.card').filter({ has: page.locator('a.addItem') });
    const count = await cards.count();
    expect(count).toBe(16);
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      await expect(card.locator('img').first(),         `Card ${i} missing image`).toBeVisible();
      await expect(card.locator('h4').first(),          `Card ${i} missing h4 title`).toBeVisible();
      await expect(
        card.locator('p').filter({ hasText: /£\d/ }).first(),
        `Card ${i} missing £ price paragraph`,
      ).toBeVisible();
      await expect(card.locator('a.addItem').first(),   `Card ${i} missing Add-to-Basket button`).toBeVisible();
      // Must have at least one description paragraph (in addition to the price paragraph)
      const paraCount = await card.locator('p').count();
      expect(paraCount, `Card ${i} missing description paragraph`).toBeGreaterThanOrEqual(2);
    }
  });

  // ── Add-to-Basket — Extended Scenarios ──────────────────────────────────────

  // Counter must update reactively in the nav badge without requiring a page reload.
  test('TC-ATB-002: Basket counter increments reactively (no page reload) after each click', async ({ page }) => {
    // jQuery handler fires synchronously via evaluate; avoids intercept issues
    await page.locator('a.addItem').nth(0).evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('nav a[href="/basket"]')).toContainText('1');
    await page.locator('a.addItem').nth(1).evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('nav a[href="/basket"]')).toContainText('2');
  });

  // Adding the same SKU 3 times must appear with quantity 3 in the basket (no missing items).
  test('TC-ATB-003: Adding the same product (Nerds) 3 times shows quantity 3 in the basket', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByName('Nerds');
    await sp.addProductByName('Nerds');
    await sp.addProductByName('Nerds');
    await page.goto('/basket');
    await expect(page.locator('body')).toContainText('Nerds');
    // Qty 3 must be reflected somewhere in the basket (total 3 × £0.60 = £1.80)
    await expect(page.locator('body')).toContainText('3');
    await expect(page.locator('body')).toContainText('1.80');
  });

  // Edge case: mass-add all 16 products — no cap, no drop.
  test('TC-ATB-004: Adding all 16 products results in basket counter of exactly 16', async ({ page }) => {
    const sp    = new SweetsPage(page);
    const count = await sp.addToBasketBtns.count();
    expect(count).toBe(16);
    for (let i = 0; i < count; i++) {
      await sp.addProductByIndex(i);
    }
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    // Use locator assertion (auto-retries) so init() has time to update the badge
    await expect(sp.navBasket).toContainText('16');
  });

  // LocalStorage-backed counter must survive inter-page navigation and not reset.
  test('TC-ATB-005: Basket counter persists after navigating away from and back to the sweets page', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByIndex(0);
    await sp.addProductByIndex(1);
    // Navigate away — counter must persist in localStorage
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    // Use locator assertion (auto-retries) — init() updates the badge async after load
    await expect(sp.navBasket).toContainText('2');
    // Return to sweets — counter still intact
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('2');
  });

  // Boundary: the last card in the grid (index 15 = Dolly Mixture) must be clickable.
  test('TC-ATB-006: Last product (Dolly Mixture, index 15) can be added to the basket', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByIndex(15); // Dolly Mixture — £0.90
    await page.goto('/basket');
    await expect(page.locator('body')).toContainText('Dolly Mixture');
  });

  // Adding an item with a decimal price (Drumsticks £0.20) must store and display the
  // correct price in the basket — guards against floating-point rounding defects.
  // DEF-011f: Drumsticks h4 title ≠ data-name; basket stores as "Raspberry Drumstick".
  test('TC-ATB-007: Basket displays correct price for a fractional-price item (Drumsticks £0.20)', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByName('Drumsticks'); // £0.20 — data-name is "Raspberry Drumstick" (DEF-011f)
    // Badge-gate: confirm item stored before navigating to basket
    await expect(sp.navBasket).toContainText('1');
    await page.goto('/basket');
    await page.waitForLoadState('networkidle');
    // Basket uses data-name so search for the actual stored name (partial match covers both spellings)
    await expect(page.locator('body')).toContainText(/drumstick/i);
    await expect(page.locator('body')).toContainText('0.20');
  });

  // Adding items to a basket that was pre-populated during the SAME session (via earlier
  // clicks) must accumulate — items must not be silently dropped.
  test('TC-ATB-008: New add accumulates on top of an existing non-empty basket', async ({ page }) => {
    const sp = new SweetsPage(page);
    // First add
    await sp.addProductByName('Bon Bons');   // £1.00
    // Use locator assertion + goto instead of reload — more resilient under parallel load
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('1');
    // Second add in a new visit — counter must be 2, not reset to 1
    await sp.addProductByName('Whistles');   // £0.25
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    await expect(sp.navBasket).toContainText('2');
  });

  // ── Page-Level / Navigation ──────────────────────────────────────────────────

  // Verifies the canonical URL so deep-links and bookmarks land on the right page.
  test('TC-SW-015: Direct navigation to /sweets results in the correct canonical URL', async ({ page }) => {
    await expect(page).toHaveURL(/\/sweets/);
  });

  // Smoke: all four nav items and the logo must be visible for full-site navigation.
  test('TC-SW-016: All navigation bar links are visible on the sweets page', async ({ page }) => {
    const sp = new SweetsPage(page);
    await expect(sp.logo).toBeVisible();
    await expect(sp.navSweets).toBeVisible();
    await expect(sp.navAbout).toBeVisible();
    await expect(sp.navLogin).toBeVisible();
    await expect(sp.navBasket).toBeVisible();
  });

  // Footer must be present on every page — its absence is a layout regression.
  test('TC-SW-017: Footer with project credit "Sweet Shop Project 2018" is visible', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Sweet Shop Project 2018');
  });

  // Guards against a stale/cached counter being shown to a returning visitor who
  // cleared their basket externally (e.g. localStorage.clear via DevTools / another tab).
  test('TC-ATB-009: Counter resets to 0 after localStorage is cleared and page is reloaded', async ({ page }) => {
    const sp = new SweetsPage(page);
    // Add two items so counter > 0
    await sp.addProductByIndex(0);
    await sp.addProductByIndex(1);
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('a.addItem', { state: 'visible' });
    expect(await sp.getBasketCount()).toBe(2);
    // Simulate external basket clear
    await sp.clearBasket(); // evaluates localStorage.clear() + reload
    expect(await sp.getBasketCount()).toBe(0);
  });

  // Boundary-value: the mid-range product (Sherbert Discs £0.95) adds correctly and the
  // total displayed in the basket matches the expected price.
  // DEF-011a: Basket stores data-name "Sherbet Discs" (missing 'r') not the h4 "Sherbert Discs".
  test('TC-ATB-010: Mid-price product (Sherbert Discs £0.95) appears in basket with correct total', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByName('Sherbert Discs'); // £0.95 — data-name is "Sherbet Discs" (DEF-011a)
    // Confirm the jQuery click handler stored the item before navigating away.
    // Basket page is populated from localStorage; if we navigate before the store completes
    // the basket arrives empty and the assertion fails.
    await expect(sp.navBasket).toContainText('1');
    await page.goto('/basket');
    await page.waitForLoadState('networkidle');
    // Basket renders data-name; use partial match to cover both spellings
    await expect(page.locator('body')).toContainText(/sherbe.*discs/i);
    await expect(page.locator('body')).toContainText('0.95');
  });

  // Two products with identical prices (Chocolate Cups £1.00 and Bon Bons £1.00) must
  // be stored and displayed as separate line items, not merged.
  test('TC-ATB-011: Two products with the same price are stored as separate basket entries', async ({ page }) => {
    const sp = new SweetsPage(page);
    await sp.addProductByName('Chocolate Cups'); // £1.00
    await sp.addProductByName('Bon Bons');        // £1.00
    await page.goto('/basket');
    await expect(page.locator('body')).toContainText('Chocolate Cups');
    await expect(page.locator('body')).toContainText('Bon Bons');
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle');
    expect(await sp.getBasketCount()).toBe(2);
  });

});

