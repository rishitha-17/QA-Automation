import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login and add a product to cart before each test
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('should complete full checkout flow successfully', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);

    // Verify order summary is displayed
    await expect(page.locator('.checkout_summary_container')).toBeVisible();
    const total = await checkoutPage.getOrderTotal();
    expect(total).toContain('Total:');

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('should show error when first name is missing', async () => {
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('should show error when last name is missing', async () => {
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('should show error when postal code is missing', async () => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('cancel on checkout step one should return to cart', async ({ page }) => {
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/cart/);
  });

  test('cancel on checkout step two should return to inventory', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/inventory/);
  });

  test('checkout overview should show correct item', async ({ page }) => {
    await checkoutPage.fillShippingInfo('Jane', 'Smith', '90210');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('complete page should show back home button', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('back home button on complete page should navigate to inventory', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('checkout with multiple items should show all items in overview', async ({ page }) => {
    // Cancel and add more items
    await checkoutPage.cancel();
    await cartPage.continueShopping();
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two/);

    const itemCount = await page.locator('.inventory_item_name').count();
    expect(itemCount).toBe(2);
  });
});
