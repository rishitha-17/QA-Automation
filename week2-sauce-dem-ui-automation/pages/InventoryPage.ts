import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async addItemToCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async removeItemFromCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async openProductDetail(name: string) {
    await this.page.locator('.inventory_item_name').filter({ hasText: name }).click();
  }
}
