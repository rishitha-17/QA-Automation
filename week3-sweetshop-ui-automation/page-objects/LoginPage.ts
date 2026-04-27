import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput:    Locator;
  readonly passwordInput: Locator;
  readonly loginBtn:      Locator;
  readonly heading:       Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput    = page.getByLabel(/Email address/i).or(page.locator('input[type="email"]'));
    this.passwordInput = page.getByLabel(/Password/i).or(page.locator('input[type="password"]'));
    this.loginBtn      = page.getByRole('button', { name: /Login/i });
    this.heading       = page.getByRole('heading', { name: /Login/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async getValidationMessage(locator: Locator): Promise<string> {
    return locator.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
