import { test, expect } from '@playwright/test';
import { SweetsPage } from '../page-objects/SweetsPage';
import { BasketPage } from '../page-objects/BasketPage';
import { LoginPage } from '../page-objects/LoginPage';
import { VALID_BILLING, VALID_PAYMENT, VALID_LOGIN } from '../test-data/testData';

/**
 * End-to-end flows covering complete user journeys across multiple pages.
 * Each test simulates a real user session from landing to checkout.
 */

test.describe('E2E — Complete User Journeys @regression', () => {

  // Journey 1: Homepage → Sweets → Add item → Basket → Checkout
  test('TC-E2E-001: User browses from homepage, adds a product, and completes checkout', async ({ page }) => {
    // 1. Land on homepage ("Sale now on" is an img alt — not in textContent)
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Welcome to the sweet shop/i })).toBeVisible();

    // 2. Navigate to sweets via Browse Sweets CTA
    await page.getByRole('link', { name: /Browse Sweets/i }).click();
    await page.waitForLoadState('networkidle'); // ensure card layout is stable before clicking
    await expect(page).toHaveURL(/\/sweets/);

    // 3. Add one product
    const sweets = new SweetsPage(page);
    await sweets.addProductByName('Chocolate Cups'); // £1.00

    // 4. Go to basket — product should appear
    await page.goto('/basket');
    await expect(page.locator('body')).toContainText('Chocolate Cups');
    await expect(page.locator('body')).toContainText('1.00');

    // 5. Fill billing and payment, submit
    const basket = new BasketPage(page);
    await basket.fillBillingAddress(VALID_BILLING);
    await basket.fillPayment(VALID_PAYMENT);
    await basket.submitCheckout();

    // 6. Page remains functional after submit (demo app has no confirmation page)
    await expect(page.locator('body')).toBeVisible();
  });

  // Journey 2: Add multiple items → verify subtotal → apply shipping → checkout
  test('TC-E2E-002: User adds multiple items, selects shipping, and verifies total before checkout', async ({ page }) => {
    // 1. Add two different products from sweets page
    const sweets = new SweetsPage(page);
    await sweets.goto();
    await sweets.addProductByName('Sherbert Straws'); // £0.75
    await sweets.addProductByName('Bon Bons');        // £1.00

    // 2. Open basket — both items and subtotal should be correct
    await page.goto('/basket');
    await expect(page.locator('body')).toContainText('Sherbert Straws');
    await expect(page.locator('body')).toContainText('Bon Bons');
    await expect(page.locator('body')).toContainText('1.75'); // subtotal

    // 3. Select Standard Shipping (DEF-004: total display does not update — only radio state verified)
    const basket = new BasketPage(page);
    await basket.selectStandardShipping();
    await expect(basket.shippingOption).toBeChecked();

    // 4. Complete checkout
    await basket.fillBillingAddress(VALID_BILLING);
    await basket.fillPayment(VALID_PAYMENT);
    await basket.submitCheckout();
    await expect(page.locator('body')).toBeVisible();
  });

  // Journey 3: Incomplete form — validation blocks checkout
  test('TC-E2E-003: Checkout is blocked when required billing fields are empty', async ({ page }) => {
    const sweets = new SweetsPage(page);
    await sweets.goto();
    await sweets.addProductByIndex(0);

    const basket = new BasketPage(page);
    await basket.goto();

    // Attempt checkout without filling anything
    await basket.submitCheckout();

    // Required field validation should fire — user stays on basket page
    expect(page.url()).toContain('/basket');
    const msg = await basket.firstNameInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(msg.length).toBeGreaterThan(0);
  });

  // Journey 4: Empty basket → clear action → re-add → checkout
  // Marked test.fail() — DEF-013: Empty Basket link is non-functional; acts as a living defect indicator.
  test('TC-E2E-004: User empties basket, re-adds an item, and proceeds to checkout', async ({ page }) => {
    test.fail(true, 'DEF-013: Empty Basket link is non-functional — localStorage is not cleared by the app');
    const sweets = new SweetsPage(page);
    await sweets.goto();

    // Add 2 items then empty the basket
    await sweets.addProductByIndex(0);
    await sweets.addProductByIndex(1);

    const basket = new BasketPage(page);
    await basket.goto();
    await basket.emptyBasketLink.click();
    // DEF-013 (confirmed app bug): Empty Basket link is non-functional — localStorage is not cleared.
    // Expect 0; this will fail until the app bug is fixed.
    // Using goto instead of reload is more resilient to ERR_SOCKET_NOT_CONNECTED under parallel load.
    await page.goto('/basket');
    await page.waitForLoadState('networkidle');

    // Counter should be 0 after emptying
    expect(await basket.getBasketCount()).toBe(0);

    // Re-add a single product and proceed
    await sweets.goto();
    await sweets.addProductByName('Wham Bar'); // £0.15
    await basket.goto();
    await expect(page.locator('body')).toContainText('Wham Bar');
    await basket.fillBillingAddress(VALID_BILLING);
    await basket.fillPayment(VALID_PAYMENT);
    await basket.submitCheckout();
    await expect(page.locator('body')).toBeVisible();
  });

  // Journey 5: Login page → attempt login → navigate to sweets → add item
  test('TC-E2E-005: User visits login page then continues shopping as guest', async ({ page }) => {
    // 1. Go to login page
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.heading).toBeVisible();

    // 2. Skip login — navigate to sweets directly
    await page.goto('/sweets');
    await page.waitForLoadState('networkidle'); // ensure card layout is stable before clicking
    await expect(page.getByRole('heading', { name: /Browse sweets/i })).toBeVisible();

    // 3. Add item as guest and verify basket updates
    const sweets = new SweetsPage(page);
    await sweets.addProductByIndex(0);
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(await sweets.getBasketCount()).toBe(1);
  });
});
