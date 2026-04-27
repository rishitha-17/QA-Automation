import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory / Products', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('should display 6 products on inventory page', async () => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('should display product names, images and prices', async ({ page }) => {
    const names = await inventoryPage.getProductNames();
    const prices = await inventoryPage.getProductPrices();
    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);
    prices.forEach(price => expect(price).toBeGreaterThan(0));
    await expect(page.locator('.inventory_item_img').first()).toBeVisible();
  });

  test('should sort products A to Z (default)', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should sort products Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('should sort products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should sort products by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('should add a product to cart and show badge count', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('should add multiple products to cart and reflect correct badge count', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(3);
  });

  test('Add to Cart button should change to Remove after adding item', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    const item = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(item.locator('button')).toHaveText('Remove');
  });

  test('should remove a product from inventory page and remove badge', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should navigate to product detail page', async ({ page }) => {
    await inventoryPage.openProductDetail('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
  });

  test('should navigate to cart when cart icon is clicked', async ({ page }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);
  });

  test('should logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible();
  });
});
