# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> E2E — Complete User Journeys @regression >> TC-E2E-004: User empties basket, re-adds an item, and proceeds to checkout
- Location: tests/e2e.spec.ts:92:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
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
          - link "2 Basket" [ref=e14]:
            - /url: /basket
            - generic [ref=e15]: "2"
            - text: Basket
          - generic [ref=e16]: (current)
  - generic [ref=e17]:
    - banner [ref=e18]:
      - heading "Your Basket" [level=1] [ref=e19]
      - paragraph [ref=e20]: Please check your order details and then enter your payment and delivery details.
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Your Basket 2" [level=4] [ref=e23]:
          - generic [ref=e24]: Your Basket
          - generic [ref=e25]: "2"
        - list [ref=e26]:
          - listitem [ref=e27]:
            - generic [ref=e28]:
              - heading "Chocolate Cups" [level=6] [ref=e29]
              - text: x 1
              - link "Delete Item" [ref=e30]:
                - /url: javascript:removeItem(1);
            - generic [ref=e31]: £1.00
          - listitem [ref=e32]:
            - generic [ref=e33]:
              - heading "Sherbert Straws" [level=6] [ref=e34]
              - text: x 1
              - link "Delete Item" [ref=e35]:
                - /url: javascript:removeItem(2);
            - generic [ref=e36]: £0.75
          - listitem [ref=e37]:
            - generic [ref=e38]: Total (GBP)
            - strong [ref=e39]: £1.75
        - heading "Delivery" [level=4] [ref=e40]
        - generic [ref=e41]:
          - generic [ref=e42]:
            - radio "Collect (FREE)" [checked] [ref=e43]
            - generic [ref=e44]: Collect (FREE)
          - generic [ref=e45]:
            - radio "Standard Shipping (£1.99)" [ref=e46]
            - generic [ref=e47]: Standard Shipping (£1.99)
        - separator [ref=e48]
        - generic [ref=e49]:
          - generic [ref=e50]:
            - textbox "Promo code" [ref=e51]
            - button "Redeem" [ref=e53] [cursor=pointer]
          - link "Empty Basket" [ref=e55]:
            - /url: "#"
      - generic [ref=e56]:
        - heading "Billing address" [level=4] [ref=e57]
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]:
              - generic [ref=e61]: First name
              - textbox [ref=e62]
            - generic [ref=e63]:
              - generic [ref=e64]: Last name
              - textbox [ref=e65]
          - generic [ref=e66]:
            - generic [ref=e67]: Email
            - textbox "Email" [ref=e68]:
              - /placeholder: you@example.com
          - generic [ref=e69]:
            - generic [ref=e70]: Address
            - textbox "Address" [ref=e71]:
              - /placeholder: 1234 Main St
          - generic [ref=e72]:
            - generic [ref=e73]: Address 2 (Optional)
            - textbox "Address 2 (Optional)" [ref=e74]:
              - /placeholder: Apartment or suite
          - generic [ref=e75]:
            - generic [ref=e76]:
              - generic [ref=e77]: Country
              - combobox "Country" [ref=e78]:
                - option "Choose..." [selected]
                - option "United Kingdom"
            - generic [ref=e79]:
              - generic [ref=e80]: City
              - combobox [ref=e81]:
                - option "Choose..." [selected]
                - option "Bristol"
                - option "Cardiff"
                - option "Swansea"
            - generic [ref=e82]:
              - generic [ref=e83]: Zip
              - textbox "Zip" [ref=e84]:
                - /placeholder: ""
          - separator [ref=e85]
          - heading "Payment" [level=4] [ref=e86]
          - generic [ref=e87]:
            - generic [ref=e88]:
              - generic [ref=e89]: Name on card
              - textbox "Name on card" [ref=e90]:
                - /placeholder: ""
              - text: Full name as displayed on card
            - generic [ref=e91]:
              - generic [ref=e92]: Credit card number
              - textbox "Credit card number" [ref=e93]:
                - /placeholder: ""
          - generic [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]: Expiration
              - textbox "Expiration CVV" [ref=e97]:
                - /placeholder: ""
            - generic [ref=e98]:
              - generic [ref=e99]: CVV
              - spinbutton [ref=e100]
          - separator [ref=e101]
          - button "Continue to checkout" [ref=e102] [cursor=pointer]
  - contentinfo [ref=e103]:
    - paragraph [ref=e105]: Sweet Shop Project 2018
```

# Test source

```ts
  11  | 
  12  | test.describe('E2E — Complete User Journeys @regression', () => {
  13  | 
  14  |   // Journey 1: Homepage → Sweets → Add item → Basket → Checkout
  15  |   test('TC-E2E-001: User browses from homepage, adds a product, and completes checkout', async ({ page }) => {
  16  |     // 1. Land on homepage ("Sale now on" is an img alt — not in textContent)
  17  |     await page.goto('/');
  18  |     await expect(page.getByRole('heading', { name: /Welcome to the sweet shop/i })).toBeVisible();
  19  | 
  20  |     // 2. Navigate to sweets via Browse Sweets CTA
  21  |     await page.getByRole('link', { name: /Browse Sweets/i }).click();
  22  |     await page.waitForLoadState('networkidle'); // ensure card layout is stable before clicking
  23  |     await expect(page).toHaveURL(/\/sweets/);
  24  | 
  25  |     // 3. Add one product
  26  |     const sweets = new SweetsPage(page);
  27  |     await sweets.addProductByName('Chocolate Cups'); // £1.00
  28  | 
  29  |     // 4. Go to basket — product should appear
  30  |     await page.goto('/basket');
  31  |     await expect(page.locator('body')).toContainText('Chocolate Cups');
  32  |     await expect(page.locator('body')).toContainText('1.00');
  33  | 
  34  |     // 5. Fill billing and payment, submit
  35  |     const basket = new BasketPage(page);
  36  |     await basket.fillBillingAddress(VALID_BILLING);
  37  |     await basket.fillPayment(VALID_PAYMENT);
  38  |     await basket.submitCheckout();
  39  | 
  40  |     // 6. Page remains functional after submit (demo app has no confirmation page)
  41  |     await expect(page.locator('body')).toBeVisible();
  42  |   });
  43  | 
  44  |   // Journey 2: Add multiple items → verify subtotal → apply shipping → checkout
  45  |   test('TC-E2E-002: User adds multiple items, selects shipping, and verifies total before checkout', async ({ page }) => {
  46  |     // 1. Add two different products from sweets page
  47  |     const sweets = new SweetsPage(page);
  48  |     await sweets.goto();
  49  |     await sweets.addProductByName('Sherbert Straws'); // £0.75
  50  |     await sweets.addProductByName('Bon Bons');        // £1.00
  51  | 
  52  |     // 2. Open basket — both items and subtotal should be correct
  53  |     await page.goto('/basket');
  54  |     await expect(page.locator('body')).toContainText('Sherbert Straws');
  55  |     await expect(page.locator('body')).toContainText('Bon Bons');
  56  |     await expect(page.locator('body')).toContainText('1.75'); // subtotal
  57  | 
  58  |     // 3. Select Standard Shipping (DEF-004: total display does not update — only radio state verified)
  59  |     const basket = new BasketPage(page);
  60  |     await basket.selectStandardShipping();
  61  |     await expect(basket.shippingOption).toBeChecked();
  62  | 
  63  |     // 4. Complete checkout
  64  |     await basket.fillBillingAddress(VALID_BILLING);
  65  |     await basket.fillPayment(VALID_PAYMENT);
  66  |     await basket.submitCheckout();
  67  |     await expect(page.locator('body')).toBeVisible();
  68  |   });
  69  | 
  70  |   // Journey 3: Incomplete form — validation blocks checkout
  71  |   test('TC-E2E-003: Checkout is blocked when required billing fields are empty', async ({ page }) => {
  72  |     const sweets = new SweetsPage(page);
  73  |     await sweets.goto();
  74  |     await sweets.addProductByIndex(0);
  75  | 
  76  |     const basket = new BasketPage(page);
  77  |     await basket.goto();
  78  | 
  79  |     // Attempt checkout without filling anything
  80  |     await basket.submitCheckout();
  81  | 
  82  |     // Required field validation should fire — user stays on basket page
  83  |     expect(page.url()).toContain('/basket');
  84  |     const msg = await basket.firstNameInput.evaluate(
  85  |       (el: HTMLInputElement) => el.validationMessage
  86  |     );
  87  |     expect(msg.length).toBeGreaterThan(0);
  88  |   });
  89  | 
  90  |   // Journey 4: Empty basket → clear action → re-add → checkout
  91  |   // Marked test.fail() — DEF-013: Empty Basket link is non-functional; acts as a living defect indicator.
  92  |   test('TC-E2E-004: User empties basket, re-adds an item, and proceeds to checkout', async ({ page }) => {
  93  |     test.fail(true, 'DEF-013: Empty Basket link is non-functional — localStorage is not cleared by the app');
  94  |     const sweets = new SweetsPage(page);
  95  |     await sweets.goto();
  96  | 
  97  |     // Add 2 items then empty the basket
  98  |     await sweets.addProductByIndex(0);
  99  |     await sweets.addProductByIndex(1);
  100 | 
  101 |     const basket = new BasketPage(page);
  102 |     await basket.goto();
  103 |     await basket.emptyBasketLink.click();
  104 |     // DEF-013 (confirmed app bug): Empty Basket link is non-functional — localStorage is not cleared.
  105 |     // Expect 0; this will fail until the app bug is fixed.
  106 |     // Using goto instead of reload is more resilient to ERR_SOCKET_NOT_CONNECTED under parallel load.
  107 |     await page.goto('/basket');
  108 |     await page.waitForLoadState('networkidle');
  109 | 
  110 |     // Counter should be 0 after emptying
> 111 |     expect(await basket.getBasketCount()).toBe(0);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  112 | 
  113 |     // Re-add a single product and proceed
  114 |     await sweets.goto();
  115 |     await sweets.addProductByName('Wham Bar'); // £0.15
  116 |     await basket.goto();
  117 |     await expect(page.locator('body')).toContainText('Wham Bar');
  118 |     await basket.fillBillingAddress(VALID_BILLING);
  119 |     await basket.fillPayment(VALID_PAYMENT);
  120 |     await basket.submitCheckout();
  121 |     await expect(page.locator('body')).toBeVisible();
  122 |   });
  123 | 
  124 |   // Journey 5: Login page → attempt login → navigate to sweets → add item
  125 |   test('TC-E2E-005: User visits login page then continues shopping as guest', async ({ page }) => {
  126 |     // 1. Go to login page
  127 |     const login = new LoginPage(page);
  128 |     await login.goto();
  129 |     await expect(login.heading).toBeVisible();
  130 | 
  131 |     // 2. Skip login — navigate to sweets directly
  132 |     await page.goto('/sweets');
  133 |     await page.waitForLoadState('networkidle'); // ensure card layout is stable before clicking
  134 |     await expect(page.getByRole('heading', { name: /Browse sweets/i })).toBeVisible();
  135 | 
  136 |     // 3. Add item as guest and verify basket updates
  137 |     const sweets = new SweetsPage(page);
  138 |     await sweets.addProductByIndex(0);
  139 |     await page.reload();
  140 |     await page.waitForLoadState('networkidle');
  141 |     expect(await sweets.getBasketCount()).toBe(1);
  142 |   });
  143 | });
  144 | 
```