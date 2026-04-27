import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasketPage extends BasePage {
  readonly pageTitle:         Locator;
  readonly emptyBasketLink:   Locator;
  readonly collectOption:     Locator;
  readonly shippingOption:    Locator;
  readonly promoCodeInput:    Locator;
  readonly redeemBtn:         Locator;
  readonly continueBtn:       Locator;

  // Billing fields
  readonly firstNameInput:    Locator;
  readonly lastNameInput:     Locator;
  readonly emailInput:        Locator;
  readonly addressInput:      Locator;
  readonly address2Input:     Locator;
  readonly countrySelect:     Locator;
  readonly citySelect:        Locator;
  readonly zipInput:          Locator;

  // Payment fields
  readonly cardNameInput:     Locator;
  readonly cardNumberInput:   Locator;
  readonly expiryInput:       Locator;
  readonly cvvInput:          Locator;

  constructor(page: Page) {
    super(page);

    // Two headings contain "Your Basket" (h1 and the h4 badge) — exact match targets only the h1.
    this.pageTitle       = page.getByRole('heading', { name: 'Your Basket', exact: true });
    this.emptyBasketLink = page.getByRole('link', { name: /Empty Basket/i });
    this.collectOption   = page.getByLabel(/Collect/i);
    this.shippingOption  = page.getByLabel(/Standard Shipping/i);
    // Promo input has no explicit placeholder text; target it by its sibling Redeem button
    this.promoCodeInput  = page.locator('.input-group').filter({ has: page.getByRole('button', { name: /Redeem/i }) }).locator('input').first()
                              .or(page.locator('input[id*="promo"], input[name*="promo"]'));
    this.redeemBtn       = page.getByRole('button', { name: /Redeem/i });
    this.continueBtn     = page.getByRole('button', { name: /Continue to checkout/i });

    // App bug: label for="firstName" but input id="name" (mismatch) — target by order.
    this.firstNameInput  = page.locator('input[id="name"]').nth(0);
    this.lastNameInput   = page.locator('input[id="name"]').nth(1);
    this.emailInput      = page.getByLabel(/Email/i).or(page.locator('input[type="email"]'));
    this.addressInput    = page.getByLabel(/^Address$/i).or(page.locator('input[id*="address"]:not([id*="2"]):not([id*="two"])'));
    this.address2Input   = page.getByLabel(/Address 2/i).or(page.locator('input[id*="address2"], input[id*="addressTwo"]'));
    this.countrySelect   = page.getByLabel(/Country/i).or(page.locator('select[id*="country"], select[name*="country"]'));
    this.citySelect      = page.getByLabel(/City/i).or(page.locator('select[id*="city"], select[name*="city"]'));
    this.zipInput        = page.getByLabel(/Zip/i).or(page.locator('input[id*="zip"], input[name*="zip"]'));

    this.cardNameInput   = page.getByLabel(/Name on card/i).or(page.locator('input[id*="cardName"], input[name*="cardName"]'));
    this.cardNumberInput = page.getByLabel(/Credit card number/i).or(page.locator('input[id*="cardNumber"], input[name*="cardNumber"]'));
    this.expiryInput     = page.getByLabel(/Expiration/i).or(page.locator('input[id*="expiry"], input[id*="exp"]'));
    // App bug: CVV label for="cc-expiration" (wrong) — target by id directly.
    this.cvvInput        = page.locator('#cc-cvv');
  }

  async goto(): Promise<void> {
    await this.page.goto('/basket');
  }

  async fillBillingAddress(data: {
    firstName: string; lastName: string; email: string;
    address: string; address2?: string; city?: string; zip: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    if (data.address2) await this.address2Input.fill(data.address2);
    if (data.city) await this.citySelect.selectOption(data.city);
    await this.zipInput.fill(data.zip);
  }

  async fillPayment(data: {
    cardName: string; cardNumber: string; expiry: string; cvv: string;
  }): Promise<void> {
    await this.cardNameInput.fill(data.cardName);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryInput.fill(data.expiry);
    await this.cvvInput.fill(data.cvv);
  }

  async getOrderTotal(): Promise<number> {
    const totalText = await this.page
      .locator('[class*="total"], #total, .order-total')
      .last()
      .innerText();
    const match = totalText.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async selectCollect(): Promise<void> {
    // The label overlays the radio input — force bypasses the intercept
    await this.collectOption.check({ force: true });
  }

  async selectStandardShipping(): Promise<void> {
    // The label overlays the radio input — force bypasses the intercept
    await this.shippingOption.check({ force: true });
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.promoCodeInput.fill(code);
    await this.redeemBtn.click();
  }

  async submitCheckout(): Promise<void> {
    await this.continueBtn.click();
  }
}
