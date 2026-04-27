import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('cart should be empty on first login', async () => {
    await inventoryPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('added product should appear in cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('multiple added products should appear in cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(2);
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('should remove an item from cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItemByName('Sauce Labs Backpack');
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('should remove one item and keep the rest in cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.removeItemByName('Sauce Labs Backpack');
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(1);
    const names = await cartPage.getCartItemNames();
    expect(names).not.toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('continue shopping should navigate back to inventory', async ({ page }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory/);
  });

  test('checkout button should navigate to checkout step one', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('cart items should persist across page navigation', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Fleece Jacket');
    await cartPage.continueShopping();
    await inventoryPage.goToCart();
    const namesAfter = await cartPage.getCartItemNames();
    expect(namesAfter).toContain('Sauce Labs Fleece Jacket');
  });
});
