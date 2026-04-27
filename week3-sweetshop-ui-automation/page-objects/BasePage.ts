import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  readonly navSweets:   Locator;
  readonly navAbout:    Locator;
  readonly navLogin:    Locator;
  readonly navBasket:   Locator;
  readonly basketCount: Locator;
  readonly logo:        Locator;

  constructor(page: Page) {
    this.page        = page;
    this.navSweets   = page.getByRole('link', { name: 'Sweets', exact: true });
    this.navAbout    = page.getByRole('link', { name: 'About' });
    this.navLogin    = page.getByRole('link', { name: 'Login' });
    // Use href to avoid strict-mode violation when "Empty Basket" link is also on the page
    this.navBasket   = page.locator('nav a[href="/basket"]');
    this.basketCount = page.locator('.basket-count, .badge, #basketCount, a[href="/basket"] .badge').first();
    this.logo        = page.getByRole('link', { name: /Sweet Shop/i }).first();
  }

  async getBasketCount(): Promise<number> {
    const text = await this.navBasket.innerText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async clearBasket(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }
}
