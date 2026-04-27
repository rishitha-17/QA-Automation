import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SweetsPage extends BasePage {
  readonly heading:          Locator;
  readonly subheading:       Locator;
  readonly productCards:     Locator;
  readonly addToBasketBtns:  Locator;

  constructor(page: Page) {
    super(page);
    this.heading         = page.getByRole('heading', { name: /Browse sweets/i });
    this.subheading      = page.locator('p').filter({ hasText: /retro sweets/i }).first();
    // 'Add to Basket' elements are <a class="addItem"> WITHOUT href — no "link" ARIA role.
    this.addToBasketBtns = page.locator('a.addItem');
    this.productCards    = page.locator('.card').filter({ has: this.addToBasketBtns });
  }

  async goto(): Promise<void> {
    await this.page.goto('/sweets');
    // Wait for all images to load so card layout is fully stable before clicks
    await this.page.waitForLoadState('networkidle');
  }

  async addProductByIndex(index: number): Promise<void> {
    const btn = this.addToBasketBtns.nth(index);
    await btn.scrollIntoViewIfNeeded();
    // evaluate-based click fires in the page JS context so the jQuery handler
    // runs synchronously — guarantees localStorage is updated before this returns.
    await btn.evaluate((el: HTMLElement) => el.click());
  }

  async addProductByName(name: string): Promise<void> {
    const card = this.page.locator('.card').filter({ hasText: name });
    const btn = card.locator('a.addItem').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.evaluate((el: HTMLElement) => el.click());
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.card-title, h4, .product-name').allInnerTexts();
  }

  async getProductPrices(): Promise<string[]> {
    return this.page.locator('.price, [class*="price"]').allInnerTexts();
  }

  async getProductCount(): Promise<number> {
    return this.addToBasketBtns.count();
  }
}
