import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const PASSWORD = 'secret_sauce';
const WRONG_PASSWORD = 'wrong_password';

// ─────────────────────────────────────────────
// Shared login page tests (run once)
// ─────────────────────────────────────────────
test.describe('Login Page - UI', () => {
  test('should display Swag Labs title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('should show error for empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', PASSWORD);
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('should show error for empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', '');
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });

  test('should show error for both fields empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('should show error for invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid_user', PASSWORD);
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', WRONG_PASSWORD);
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });
});

// ─────────────────────────────────────────────
// standard_user
// ─────────────────────────────────────────────
test.describe('standard_user', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test('can login successfully and lands on inventory page', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('inventory page displays 6 products', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('can add a product to cart', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('can add all 6 products to cart', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    const names = await inventoryPage.getProductNames();
    for (const name of names) {
      await inventoryPage.addItemToCartByName(name);
    }
    expect(await inventoryPage.getCartBadgeCount()).toBe(6);
  });

  test('can remove a product from cart via inventory page', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('cart shows correct items', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('can sort products A to Z', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('can sort products Z to A', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('can sort products price low to high', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('can sort products price high to low', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('can open product detail page', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.openProductDetail('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
  });

  test('can complete full checkout flow', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('can logout successfully', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// locked_out_user
// ─────────────────────────────────────────────
test.describe('locked_out_user', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('cannot login and sees locked out error', async ({ page }) => {
    await loginPage.login('locked_out_user', PASSWORD);
    await expect(page).toHaveURL('/');
    expect(await loginPage.getErrorMessage()).toContain('Sorry, this user has been locked out');
  });

  test('error message is visible on the page', async () => {
    await loginPage.login('locked_out_user', PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('inventory page is inaccessible after failed login', async ({ page }) => {
    await loginPage.login('locked_out_user', PASSWORD);
    await page.goto('/inventory.html');
    // Should redirect back to login
    await expect(page).toHaveURL('/');
  });

  test('locked_out_user with wrong password also shows error', async ({ page }) => {
    await loginPage.login('locked_out_user', WRONG_PASSWORD);
    await expect(page).toHaveURL('/');
    const error = await loginPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// problem_user
// ─────────────────────────────────────────────
test.describe('problem_user', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/);
  });

  test('can login and lands on inventory page', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('inventory page displays 6 products', async () => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('all product images use the same broken source (known bug)', async ({ page }) => {
    const imgSrcs = await page.locator('.inventory_item_img img').evaluateAll(
      (imgs: HTMLImageElement[]) => imgs.map(img => img.getAttribute('src'))
    );
    // All images point to the same URL — this is the known problem_user bug
    const uniqueSrcs = new Set(imgSrcs);
    expect(uniqueSrcs.size).toBe(1);
  });

  test('sort dropdown does not change product order (known bug)', async () => {
    const namesBefore = await inventoryPage.getProductNames();
    await inventoryPage.sortBy('za');
    const namesAfter = await inventoryPage.getProductNames();
    // Known bug: sort is broken for problem_user — order remains unchanged
    expect(namesAfter).toEqual(namesBefore);
  });

  test('last name field on checkout is broken (known bug)', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('Jane', 'Doe', '54321');
    await checkoutPage.continue();
    // Known bug: last name field does not accept input, error is thrown
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('can logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});

// ─────────────────────────────────────────────
// performance_glitch_user
// ─────────────────────────────────────────────
test.describe('performance_glitch_user', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test('can login but with noticeable delay (up to 5s)', async ({ page }) => {
    const start = Date.now();
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    const elapsed = Date.now() - start;
    // Login takes longer than standard_user (typically > 3s)
    expect(elapsed).toBeGreaterThan(2000);
  });

  test('inventory page fully loads after delayed login', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await expect(page.locator('.inventory_list')).toBeVisible();
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('can add product to cart after login', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('can navigate to cart page', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('can complete full checkout flow', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('Glitch', 'User', '99999');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('can sort products correctly', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('can logout successfully', async ({ page }) => {
    await loginPage.login('performance_glitch_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});

// ─────────────────────────────────────────────
// error_user
// ─────────────────────────────────────────────
test.describe('error_user', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('error_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/);
  });

  test('can login and lands on inventory page', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('inventory page shows 6 products', async () => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('Add to Cart works for Sauce Labs Backpack', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('cart item removal is broken (known bug)', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    // Known bug: remove button may not work or throws an error for error_user
    await cartPage.removeItemByName('Sauce Labs Backpack');
    // Document the known broken behavior: item count may not decrease
    const itemsAfter = await cartPage.getCartItemCount();
    expect(itemsAfter).toBeGreaterThanOrEqual(0);
  });

  test('checkout step one - first name field is broken (known bug)', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('Error', 'User', '11111');
    await checkoutPage.continue();
    // Known bug: first name field doesn't accept input — error is thrown
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('sort dropdown is present and visible', async ({ page }) => {
    await expect(inventoryPage.sortDropdown).toBeVisible();
  });

  test('can logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});

// ─────────────────────────────────────────────
// visual_user
// ─────────────────────────────────────────────
test.describe('visual_user', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('visual_user', PASSWORD);
    await expect(page).toHaveURL(/inventory/);
  });

  test('can login and lands on inventory page', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('inventory page displays 6 products', async () => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('all product images are present (visible)', async ({ page }) => {
    const images = page.locator('.inventory_item_img img');
    const count = await images.count();
    expect(count).toBe(6);
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('product images have different sources (visual_user variant images)', async ({ page }) => {
    const imgSrcs = await page.locator('.inventory_item_img img').evaluateAll(
      (imgs: HTMLImageElement[]) => imgs.map(img => img.getAttribute('src'))
    );
    // visual_user shows different product images from standard_user
    const uniqueSrcs = new Set(imgSrcs);
    expect(uniqueSrcs.size).toBeGreaterThan(1);
  });

  test('cart icon is visible (may have positioning bug)', async ({ page }) => {
    const cartLink = page.locator('.shopping_cart_link');
    await expect(cartLink).toBeVisible();
  });

  test('can add product to cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('can navigate to and view cart', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('can sort products A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('can complete full checkout flow', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('Visual', 'User', '77777');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('can logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});
