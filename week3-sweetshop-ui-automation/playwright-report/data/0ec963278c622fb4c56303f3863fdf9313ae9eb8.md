# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basket.spec.ts >> Basket & Delivery @regression >> TC-BK-003: Empty Basket link clears all items and resets counter to 0
- Location: tests/basket.spec.ts:31:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Sweet Shop" [ref=e4]:
        - /url: /
      - list [ref=e6]:
        - listitem [ref=e7]:
          - link "Sweets" [ref=e8]:
            - /url: /sweets
        - listitem [ref=e9]:
          - link "About" [ref=e10]:
            - /url: bout
        - listitem [ref=e11]:
          - link "Login" [ref=e12]:
            - /url: /login
        - listitem [ref=e13]:
          - link "1 Basket" [ref=e14]:
            - /url: /basket
            - generic [ref=e15]: "1"
            - text: Basket
          - generic [ref=e16]: (current)
  - generic [ref=e17]:
    - banner [ref=e18]:
      - heading "Your Basket" [level=1] [ref=e19]
      - paragraph [ref=e20]: Please check your order details and then enter your payment and delivery details.
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Your Basket 1" [level=4] [ref=e23]:
          - generic [ref=e24]: Your Basket
          - generic [ref=e25]: "1"
        - list [ref=e26]:
          - listitem [ref=e27]:
            - generic [ref=e28]:
              - heading "Chocolate Cups" [level=6] [ref=e29]
              - text: x 1
              - link "Delete Item" [ref=e30]:
                - /url: javascript:removeItem(1);
            - generic [ref=e31]: £1.00
          - listitem [ref=e32]:
            - generic [ref=e33]: Total (GBP)
            - strong [ref=e34]: £1.00
        - heading "Delivery" [level=4] [ref=e35]
        - generic [ref=e36]:
          - generic [ref=e37]:
            - radio "Collect (FREE)" [checked] [ref=e38]
            - generic [ref=e39]: Collect (FREE)
          - generic [ref=e40]:
            - radio "Standard Shipping (£1.99)" [ref=e41]
            - generic [ref=e42]: Standard Shipping (£1.99)
        - separator [ref=e43]
        - generic [ref=e44]:
          - generic [ref=e45]:
            - textbox "Promo code" [ref=e46]
            - button "Redeem" [ref=e48] [cursor=pointer]
          - link "Empty Basket" [ref=e50]:
            - /url: "#"
      - generic [ref=e51]:
        - heading "Billing address" [level=4] [ref=e52]
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]:
              - generic [ref=e56]: First name
              - textbox [ref=e57]
            - generic [ref=e58]:
              - generic [ref=e59]: Last name
              - textbox [ref=e60]
          - generic [ref=e61]:
            - generic [ref=e62]: Email
            - textbox "Email" [ref=e63]:
              - /placeholder: you@example.com
          - generic [ref=e64]:
            - generic [ref=e65]: Address
            - textbox "Address" [ref=e66]:
              - /placeholder: 1234 Main St
          - generic [ref=e67]:
            - generic [ref=e68]: Address 2 (Optional)
            - textbox "Address 2 (Optional)" [ref=e69]:
              - /placeholder: Apartment or suite
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: Country
              - combobox "Country" [ref=e73]:
                - option "Choose..." [selected]
                - option "United Kingdom"
            - generic [ref=e74]:
              - generic [ref=e75]: City
              - combobox [ref=e76]:
                - option "Choose..." [selected]
                - option "Bristol"
                - option "Cardiff"
                - option "Swansea"
            - generic [ref=e77]:
              - generic [ref=e78]: Zip
              - textbox "Zip" [ref=e79]:
                - /placeholder: ""
          - separator [ref=e80]
          - heading "Payment" [level=4] [ref=e81]
          - generic [ref=e82]:
            - generic [ref=e83]:
              - generic [ref=e84]: Name on card
              - textbox "Name on card" [ref=e85]:
                - /placeholder: ""
              - text: Full name as displayed on card
            - generic [ref=e86]:
              - generic [ref=e87]: Credit card number
              - textbox "Credit card number" [ref=e88]:
                - /placeholder: ""
          - generic [ref=e89]:
            - generic [ref=e90]:
              - generic [ref=e91]: Expiration
              - textbox "Expiration CVV" [ref=e92]:
                - /placeholder: ""
            - generic [ref=e93]:
              - generic [ref=e94]: CVV
              - spinbutton [ref=e95]
          - separator [ref=e96]
          - button "Continue to checkout" [ref=e97] [cursor=pointer]
  - contentinfo [ref=e98]:
    - paragraph [ref=e100]: Sweet Shop Project 2018
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BasketPage } from '../page-objects/BasketPage';
  3  | import { SweetsPage } from '../page-objects/SweetsPage';
  4  | 
  5  | test.describe('Basket & Delivery @regression', () => {
  6  | 
  7  |   // TC-BK-001: Empty basket shows heading and continue button
  8  |   test('TC-BK-001: Empty basket page shows correct heading and continue button', async ({ page }) => {
  9  |     const basket = new BasketPage(page);
  10 |     await basket.goto();
  11 |     await expect(basket.pageTitle).toBeVisible();
  12 |     await expect(basket.continueBtn).toBeVisible();
  13 |   });
  14 | 
  15 |   // Covers product name, price, quantity, and subtotal in one basket visit
  16 |   test('TC-BK-002: Basket reflects correct product, quantity, and subtotal after adding items', async ({ page }) => {
  17 |     const sweets = new SweetsPage(page);
  18 |     await sweets.goto();
  19 |     await sweets.addProductByName('Chocolate Cups');  // £1.00
  20 |     await sweets.addProductByName('Chocolate Cups');  // qty 2 → £2.00
  21 |     await sweets.addProductByName('Sherbert Straws'); // £0.75 → total £2.75
  22 |     await page.goto('/basket');
  23 |     await expect(page.locator('body')).toContainText('Chocolate Cups');
  24 |     await expect(page.locator('body')).toContainText('Sherbert Straws');
  25 |     await expect(page.locator('body')).toContainText('2');
  26 |   });
  27 | 
  28 |   // DEF-013 (confirmed app bug): The "Empty Basket" link is non-functional.
  29 |   // Clicking it appends '#' to the URL but does NOT clear localStorage — the basket remains intact.
  30 |   // Marked test.fail() — expected to fail until the app bug is fixed; acts as a living defect indicator.
  31 |   test('TC-BK-003: Empty Basket link clears all items and resets counter to 0', async ({ page }) => {
  32 |     test.fail(true, 'DEF-013: Empty Basket link is non-functional — localStorage is not cleared by the app');
  33 |     const sweets = new SweetsPage(page);
  34 |     await sweets.goto();
  35 |     await sweets.addProductByIndex(0);
  36 |     const basket = new BasketPage(page);
  37 |     await basket.goto();
  38 |     await basket.emptyBasketLink.click();
  39 |     await page.waitForLoadState('networkidle');
  40 |     await page.reload();
> 41 |     expect(await basket.getBasketCount()).toBe(0);
     |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  42 |   });
  43 | 
  44 |   // DEF-004 (app bug): Standard Shipping total does not visually update in UI.
  45 |   // Test only verifies radio state is selectable and defaults correctly.
  46 |   // The total assertion is omitted — the shipping amount display is a known application defect.
  47 |   test('TC-DEL-001: Delivery defaults to Collect; Standard Shipping can be selected; Collect can be reselected', async ({ page }) => {
  48 |     const sweets = new SweetsPage(page);
  49 |     await sweets.goto();
  50 |     await sweets.addProductByName('Chocolate Cups');
  51 |     const basket = new BasketPage(page);
  52 |     await basket.goto();
  53 |     // Default
  54 |     await expect(basket.collectOption).toBeChecked();
  55 |     await expect(basket.shippingOption).not.toBeChecked();
  56 |     // Switch to shipping
  57 |     await basket.selectStandardShipping();
  58 |     await expect(basket.shippingOption).toBeChecked();
  59 |     await expect(basket.collectOption).not.toBeChecked();
  60 |     // Switch back
  61 |     await basket.selectCollect();
  62 |     await expect(basket.collectOption).toBeChecked();
  63 |   });
  64 | 
  65 |   // DEF-005 (app bug): Promo code Redeem button gives no feedback for any input.
  66 |   // Test verifies the field accepts input and clicking Redeem does not crash the page.
  67 |   test('TC-PC-001: Promo code field accepts text and Redeem does not crash the page', async ({ page }) => {
  68 |     const basket = new BasketPage(page);
  69 |     await basket.goto();
  70 |     await basket.promoCodeInput.fill('INVALID99');
  71 |     await basket.redeemBtn.click();
  72 |     // App gives no feedback — verify page is still functional
  73 |     await expect(basket.continueBtn).toBeVisible();
  74 |     // Empty input also safe
  75 |     await basket.promoCodeInput.fill('');
  76 |     await basket.redeemBtn.click();
  77 |     await expect(basket.continueBtn).toBeVisible();
  78 |   });
  79 | 
  80 | });
  81 | 
```