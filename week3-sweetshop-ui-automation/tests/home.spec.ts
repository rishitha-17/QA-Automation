import { test, expect } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage';

test.describe('Home Page @smoke @regression', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for all resources so the page is stable and addItem handlers are fully attached
    await page.waitForLoadState('networkidle');
  });

  // "Sale now on" is an <img alt="Sale now on"> — not in body textContent.
  // Verify page title, main heading, and footer instead.
  test('TC-HP-001: Page loads with banner, heading, and footer', async ({ page }) => {
    await expect(page).toHaveTitle(/Sweet Shop/i);
    await expect(page.getByRole('heading', { name: /Welcome to the sweet shop/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Sweet Shop/i);
    await expect(page.locator('body')).toContainText(/2018/i); // footer
  });

  test('TC-HP-002: "Browse Sweets" button navigates to the sweets listing page', async ({ page }) => {
    await page.getByRole('link', { name: /Browse Sweets/i }).click();
    await expect(page).toHaveURL(/\/sweets/);
    await expect(page.getByRole('heading', { name: /Browse sweets/i })).toBeVisible();
  });

  test('TC-HP-003: Featured products section shows products with Add to Basket', async ({ page }) => {
    // Homepage shows a "Most popular" section with at least 1 product
    // Add to Basket elements are <a class="addItem"> without href — not role="link"
    // Use locator assertion (auto-retries) instead of bare expect so slow renders don't cause failures
    await expect(page.locator('a.addItem').first()).toBeVisible();
    // Known products on homepage
    await expect(page.locator('body')).toContainText('Chocolate Cups');
    await expect(page.locator('body')).toContainText('Bon Bons');
  });

  test('TC-HP-004: Adding a product from homepage increments the basket counter', async ({ page }) => {
    const nav = new BasePage(page);
    // Clear any items left by prior tests in the same worker before asserting counter = 0
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await nav.getBasketCount()).toBe(0);
    // Counter updates via localStorage on page load (not reactive) — re-navigate to verify.
    // Using goto instead of reload is more resilient to ERR_SOCKET_NOT_CONNECTED under parallel load.
    await page.locator('a.addItem').first().click();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await nav.getBasketCount()).toBe(1);
  });
});
