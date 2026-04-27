# Test Cases — Sweet Shop Web Application

**Date:** 2026-04-25  
**Coverage target:** ~100% of interactive UI elements  

Legend — **Priority:** P1 Critical | P2 High | P3 Medium | P4 Low  
**Type:** POS = Positive | NEG = Negative | EDG = Edge Case

---

## Module 1: Navigation

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-NAV-001 | SCN-NAV-01 | Navigate to Sweets page from header | 1. Open homepage. 2. Click "Sweets" in nav | Sweets page loads; URL = /sweets | POS | P1 |
| TC-NAV-002 | SCN-NAV-01 | Navigate to About page from header | 1. Open homepage. 2. Click "About" in nav | About page loads; URL = /about | POS | P2 |
| TC-NAV-003 | SCN-NAV-01 | Navigate to Login page from header | 1. Open homepage. 2. Click "Login" in nav | Login page loads; URL = /login | POS | P2 |
| TC-NAV-004 | SCN-NAV-01 | Navigate to Basket page from header | 1. Open homepage. 2. Click "Basket" in nav | Basket page loads; URL = /basket | POS | P1 |
| TC-NAV-005 | SCN-NAV-03 | Logo click returns to home | 1. Navigate to /sweets. 2. Click the "Sweet Shop" logo | Homepage loads; URL = / | POS | P2 |
| TC-NAV-006 | SCN-NAV-02 | Basket counter shows 0 initially | 1. Open homepage in fresh browser | Basket counter displays "0" | POS | P2 |
| TC-NAV-007 | SCN-NAV-02 | Basket counter increments after add | 1. Go to /sweets. 2. Click "Add to Basket" on any product | Basket counter increments to 1 | POS | P1 |
| TC-NAV-008 | SCN-NAV-02 | Basket counter persists across pages | 1. Add 2 items. 2. Navigate to About. 3. Navigate to Login | Counter remains at 2 on all pages | POS | P2 |
| TC-NAV-009 | SCN-NAV-04 | Invalid URL returns 404 or redirect | 1. Navigate to /nonexistent | Page shows 404 or redirects to home | EDG | P3 |

---

## Module 2: Sweets Listing Page

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-SW-001 | SCN-SW-01 | Page heading is correct | 1. Open /sweets | Heading reads "Browse sweets" | POS | P2 |
| TC-SW-002 | SCN-SW-01 | Introductory text is present | 1. Open /sweets | Sub-heading reads "Browse our delicious choice of retro sweets." | POS | P3 |
| TC-SW-003 | SCN-SW-01 | All 16 products are displayed | 1. Open /sweets. 2. Count product cards | Exactly 16 product cards visible | POS | P1 |
| TC-SW-004 | SCN-SW-01 | Each product has a name | 1. Open /sweets. 2. Inspect each card | Every card displays a non-empty product name | POS | P1 |
| TC-SW-005 | SCN-SW-01 | Each product has a price | 1. Open /sweets. 2. Inspect each card | Every card displays a price in format £X.XX | POS | P1 |
| TC-SW-006 | SCN-SW-01 | Each product has a description | 1. Open /sweets | Every card displays non-empty description text | POS | P2 |
| TC-SW-007 | SCN-SW-01 | Each product has an image | 1. Open /sweets | Every card displays a visible, loaded image (no broken img) | POS | P2 |
| TC-SW-008 | SCN-SW-01 | Each product has "Add to Basket" button | 1. Open /sweets | Every card has an "Add to Basket" button | POS | P1 |
| TC-SW-009 | SCN-SW-02 | Price format validation — lowest price | 1. Open /sweets. 2. Find Wham Bars | Price displays as £0.15 | POS | P2 |
| TC-SW-010 | SCN-SW-02 | Price format validation — highest price | 1. Open /sweets. 2. Find Swansea Mixture | Price displays as £1.50 | POS | P2 |
| TC-SW-011 | SCN-SW-05 | Price range within expected bounds | 1. Open /sweets. 2. Collect all prices | All prices are between £0.10 and £1.50 inclusive | EDG | P2 |
| TC-SW-012 | SCN-SW-04 | Page title in browser tab | 1. Open /sweets | Browser tab title contains "Sweet Shop" | POS | P3 |
| TC-SW-013 | SCN-SW-01 | No duplicate product names | 1. Open /sweets. 2. Collect all product names | All product names are unique | EDG | P2 |
| TC-SW-014 | SCN-SW-01 | Images have no broken src | 1. Open /sweets. 2. Check all img elements | All img naturalWidth > 0 (no broken images) | EDG | P2 |
| TC-SW-015 | SCN-SW-03 | "Add to Basket" button enabled for all | 1. Open /sweets | All "Add to Basket" buttons are enabled (not disabled) | POS | P1 |

---

## Module 3: Add to Basket

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-ATB-001 | SCN-ATB-01 | Add single product — counter becomes 1 | 1. Open /sweets. 2. Click "Add to Basket" on product 1 | Nav basket counter = 1 | POS | P1 |
| TC-ATB-002 | SCN-ATB-02 | Add two different products — counter becomes 2 | 1. Click ATB on product 1. 2. Click ATB on product 2 | Counter = 2 | POS | P1 |
| TC-ATB-003 | SCN-ATB-02 | Add five products — counter becomes 5 | 1. Click ATB on 5 different products | Counter = 5 | POS | P1 |
| TC-ATB-004 | SCN-ATB-03 | Add same product twice — quantity is 2 | 1. Click ATB on product 1. 2. Click ATB on product 1 again | Counter = 2 (or item quantity = 2 in basket) | POS | P1 |
| TC-ATB-005 | SCN-ATB-04 | Basket counter persists on navigation | 1. Add 3 items. 2. Navigate to /about. 3. Navigate back to /sweets | Counter still shows 3 | POS | P2 |
| TC-ATB-006 | SCN-ATB-05 | Add all 16 products — counter = 16 | 1. Click ATB for each of the 16 products | Counter = 16 | EDG | P2 |
| TC-ATB-007 | SCN-ATB-01 | Basket page reflects added product | 1. Add product "Chocolate Cups". 2. Navigate to /basket | Chocolate Cups appears in basket list | POS | P1 |
| TC-ATB-008 | SCN-ATB-03 | Rapid consecutive clicks on same product | 1. Click ATB on product 1 rapidly 5 times | Counter = 5, quantity = 5 | EDG | P3 |
| TC-ATB-009 | SCN-ATB-02 | Add items from different positions | 1. Add first product. 2. Add last product | Both products appear in basket | EDG | P2 |
| TC-ATB-010 | SCN-ATB-01 | Counter updates immediately (no delay) | 1. Click ATB. 2. Observe counter | Counter updates within 1 second | POS | P2 |

---

## Module 4: Basket Page — Cart Management

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-BK-001 | SCN-BK-01 | Empty basket shows zero items | 1. Open /basket without adding items | Basket shows 0 items / empty state message | POS | P1 |
| TC-BK-002 | SCN-BK-02 | Added product name appears in basket | 1. Add "Chocolate Cups". 2. Open /basket | "Chocolate Cups" is listed | POS | P1 |
| TC-BK-003 | SCN-BK-03 | Product price is shown in basket | 1. Add "Chocolate Cups" (£1.00). 2. Open /basket | £1.00 displayed against item | POS | P1 |
| TC-BK-004 | SCN-BK-03 | Quantity shown correctly | 1. Add product twice. 2. Open /basket | Quantity = 2 displayed | POS | P1 |
| TC-BK-005 | SCN-BK-04 | Subtotal = sum of items * prices | 1. Add Chocolate Cups (£1.00) + Sherbert Straws (£0.75). 2. Open /basket | Subtotal = £1.75 | POS | P1 |
| TC-BK-006 | SCN-BK-05 | "Empty Basket" link clears all items | 1. Add 3 products. 2. Open /basket. 3. Click "Empty Basket" | Basket is empty; counter = 0 | POS | P1 |
| TC-BK-007 | SCN-BK-06 | Header counter reflects basket state | 1. Open /basket. 2. Note counter. 3. Add item. 4. Note counter again | Counter increments by 1 | POS | P2 |
| TC-BK-008 | SCN-BK-01 | Empty basket — checkout form still visible | 1. Open /basket (empty) | Checkout form sections are still rendered | POS | P3 |
| TC-BK-009 | SCN-BK-04 | Multiple quantities subtotal correct | 1. Add same item 3 times. 2. Open /basket | Subtotal = price × 3 | EDG | P1 |
| TC-BK-010 | SCN-BK-04 | Large quantity basket total | 1. Add 10 of cheapest item (£0.15 each). 2. Open /basket | Subtotal = £1.50 | EDG | P2 |
| TC-BK-011 | SCN-BK-02 | Multiple distinct products listed | 1. Add 4 different products. 2. Open /basket | All 4 products listed as separate rows | POS | P2 |
| TC-BK-012 | SCN-BK-05 | Empty basket after checkout | 1. Add item. 2. Submit checkout. 3. Check basket | Basket is empty post-checkout | POS | P2 |
| TC-BK-013 | SCN-BK-06 | "Empty Basket" link href is correct | 1. Open /basket | Link targets correct clear-basket action | EDG | P3 |

---

## Module 5: Delivery Options

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-DEL-001 | SCN-DEL-01 | "Collect (FREE)" selected by default | 1. Add item. 2. Open /basket | "Collect (FREE)" radio is pre-selected | POS | P1 |
| TC-DEL-002 | SCN-DEL-02 | Select Standard Shipping adds £1.99 | 1. Open /basket with items. 2. Select "Standard Shipping (£1.99)" | Order total increases by £1.99 | POS | P1 |
| TC-DEL-003 | SCN-DEL-03 | Switch back to Collect removes shipping fee | 1. Select Standard Shipping. 2. Select Collect again | £1.99 is removed from total | POS | P1 |
| TC-DEL-004 | SCN-DEL-04 | Only one option selected at a time | 1. Select Standard Shipping. 2. Verify Collect is deselected | Radio buttons are mutually exclusive | POS | P2 |
| TC-DEL-005 | SCN-DEL-02 | Standard Shipping total with multiple items | 1. Add items totalling £2.00. 2. Select Standard Shipping | Total = £3.99 | POS | P1 |
| TC-DEL-006 | SCN-DEL-01 | Delivery options visible on empty basket | 1. Open /basket (no items) | Delivery radio buttons still present | EDG | P3 |
| TC-DEL-007 | SCN-DEL-02 | Shipping label text accuracy | 1. Open /basket. 2. Read delivery options | Labels exactly read "Collect (FREE)" and "Standard Shipping (£1.99)" | POS | P2 |

---

## Module 6: Promo Code

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-PC-001 | SCN-PC-01 | Valid promo code applies discount | 1. Add item. 2. Open /basket. 3. Enter valid code (e.g., "SWEET10"). 4. Click Redeem | Discount applied; total reduces | POS | P2 |
| TC-PC-002 | SCN-PC-02 | Invalid promo code shows error | 1. Open /basket. 2. Enter "INVALID99". 3. Click Redeem | Error message shown (e.g., "Invalid code") | NEG | P2 |
| TC-PC-003 | SCN-PC-03 | Empty promo code submission | 1. Open /basket. 2. Leave code field empty. 3. Click Redeem | Validation message or no action | NEG | P2 |
| TC-PC-004 | SCN-PC-04 | Promo code is case-insensitive | 1. Enter "sweet10". 2. Click Redeem | Same result as uppercase "SWEET10" | EDG | P3 |
| TC-PC-005 | SCN-PC-02 | Promo code with spaces | 1. Enter " SWEET10 " (leading/trailing spaces). 2. Click Redeem | Code accepted (trimmed) or error shown | EDG | P3 |
| TC-PC-006 | SCN-PC-02 | Promo code with special characters | 1. Enter "SW!@#$%". 2. Click Redeem | Invalid code error shown | NEG | P3 |
| TC-PC-007 | SCN-PC-01 | Discount reduces total correctly | 1. Apply 20% promo on £1.00 basket | Total = £0.80 | POS | P2 |
| TC-PC-008 | SCN-PC-03 | Promo code field max length | 1. Enter 200+ character string | Input is truncated or error shown | EDG | P3 |

---

## Module 7: Billing Address Form

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-BA-001 | SCN-BA-01 | First name required — empty triggers error | 1. Leave First name blank. 2. Click "Continue to checkout" | Validation error shown on First name | NEG | P1 |
| TC-BA-002 | SCN-BA-01 | Last name required — empty triggers error | 1. Leave Last name blank. 2. Submit | Validation error shown on Last name | NEG | P1 |
| TC-BA-003 | SCN-BA-01 | Address required — empty triggers error | 1. Leave Address blank. 2. Submit | Validation error on Address | NEG | P1 |
| TC-BA-004 | SCN-BA-01 | Zip code required — empty triggers error | 1. Leave Zip blank. 2. Submit | Validation error on Zip | NEG | P1 |
| TC-BA-005 | SCN-BA-02 | Email with invalid format rejected | 1. Enter "notanemail". 2. Submit | Email validation error shown | NEG | P2 |
| TC-BA-006 | SCN-BA-02 | Email with valid format accepted | 1. Enter "user@example.com". 2. Submit | No email validation error | POS | P2 |
| TC-BA-007 | SCN-BA-03 | Country defaults to United Kingdom | 1. Open /basket | Country dropdown shows "United Kingdom" | POS | P2 |
| TC-BA-008 | SCN-BA-04 | City dropdown contains Bristol | 1. Open /basket. 2. Click City dropdown | "Bristol" is an option | POS | P2 |
| TC-BA-009 | SCN-BA-04 | City dropdown contains Cardiff | 1. Open city dropdown | "Cardiff" is an option | POS | P2 |
| TC-BA-010 | SCN-BA-04 | City dropdown contains Swansea | 1. Open city dropdown | "Swansea" is an option | POS | P2 |
| TC-BA-011 | SCN-BA-05 | Address 2 is optional | 1. Fill all required fields except Address 2. 2. Submit | No error for Address 2 | POS | P2 |
| TC-BA-012 | SCN-BA-06 | Valid billing data accepted without errors | 1. Fill all billing fields with valid data. 2. Submit | No validation errors on billing section | POS | P1 |
| TC-BA-013 | SCN-BA-07 | Special characters in Address field | 1. Enter "12 O'Brien St, Apt #4". 2. Submit | Accepted without error | EDG | P3 |
| TC-BA-014 | SCN-BA-08 | Valid UK postcode accepted | 1. Enter "SW1A 1AA" in Zip. 2. Submit | No zip validation error | POS | P2 |
| TC-BA-015 | SCN-BA-08 | Invalid postcode rejected | 1. Enter "INVALID". 2. Submit | Zip validation error shown | NEG | P2 |
| TC-BA-016 | SCN-BA-07 | Numeric-only First name | 1. Enter "12345" as First name. 2. Submit | Field accepted or validation error (document behaviour) | EDG | P3 |
| TC-BA-017 | SCN-BA-01 | All required fields empty on submit | 1. Open /basket. 2. Click "Continue to checkout" with no data | All required field errors shown simultaneously | NEG | P1 |
| TC-BA-018 | SCN-BA-06 | Email field with subdomain | 1. Enter "user@mail.example.co.uk" | Accepted without error | EDG | P3 |
| TC-BA-019 | SCN-BA-01 | First name with 1 character | 1. Enter "A" as First name | Accepted (no min-length error) | EDG | P3 |
| TC-BA-020 | SCN-BA-01 | First name with 100 characters | 1. Enter 100-char string | Accepted or truncated gracefully | EDG | P3 |

---

## Module 8: Payment Form

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-PY-001 | SCN-PY-01 | All payment fields are present | 1. Open /basket | Card name, number, expiry, CVV fields visible | POS | P1 |
| TC-PY-002 | SCN-PY-02 | Empty card name triggers error | 1. Leave "Name on card" blank. 2. Submit | Validation error on card name | NEG | P1 |
| TC-PY-003 | SCN-PY-02 | Empty card number triggers error | 1. Leave card number blank. 2. Submit | Validation error on card number | NEG | P1 |
| TC-PY-004 | SCN-PY-02 | Empty expiry date triggers error | 1. Leave expiry blank. 2. Submit | Validation error on expiry | NEG | P1 |
| TC-PY-005 | SCN-PY-02 | Empty CVV triggers error | 1. Leave CVV blank. 2. Submit | Validation error on CVV | NEG | P1 |
| TC-PY-006 | SCN-PY-06 | Valid card data accepted | 1. Enter name "Test User", card "4111111111111111", expiry "12/26", CVV "123". 2. Submit | No payment validation errors | POS | P1 |
| TC-PY-007 | SCN-PY-03 | Non-numeric card number rejected | 1. Enter "ABCD EFGH IJKL MNOP". 2. Submit | Validation error on card number | NEG | P2 |
| TC-PY-008 | SCN-PY-03 | Card number too short | 1. Enter "4111". 2. Submit | Validation error on card number | NEG | P2 |
| TC-PY-009 | SCN-PY-03 | Card number too long | 1. Enter 20-digit number. 2. Submit | Error or input truncated | EDG | P3 |
| TC-PY-010 | SCN-PY-04 | Past expiry date rejected | 1. Enter "01/20" as expiry. 2. Submit | Validation error — card expired | NEG | P2 |
| TC-PY-011 | SCN-PY-04 | Expiry in wrong format rejected | 1. Enter "2025/12". 2. Submit | Validation error on expiry format | NEG | P2 |
| TC-PY-012 | SCN-PY-05 | CVV less than 3 digits rejected | 1. Enter "12" as CVV. 2. Submit | Validation error on CVV | NEG | P2 |
| TC-PY-013 | SCN-PY-05 | CVV 3 digits accepted | 1. Enter "123" as CVV | No CVV validation error | POS | P2 |
| TC-PY-014 | SCN-PY-05 | CVV 4 digits accepted (Amex) | 1. Enter "1234" as CVV | No CVV validation error | EDG | P3 |

---

## Module 9: Checkout Submission

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-CH-001 | SCN-CH-01 | Submit with all fields empty | 1. Open /basket. 2. Click "Continue to checkout" | All required field errors appear | NEG | P1 |
| TC-CH-002 | SCN-CH-02 | Successful checkout with valid data | 1. Add item. 2. Fill all billing + payment fields with valid data. 3. Submit | Success message / redirect shown | POS | P1 |
| TC-CH-003 | SCN-CH-03 | Total = subtotal (Collect selected) | 1. Add item. 2. Verify total on basket page | Total = item subtotal (no shipping) | POS | P1 |
| TC-CH-004 | SCN-CH-03 | Total = subtotal + £1.99 (Shipping) | 1. Add item. 2. Select Standard Shipping. 3. Verify total | Total = subtotal + £1.99 | POS | P1 |
| TC-CH-005 | SCN-CH-04 | Submit with only billing filled (no payment) | 1. Fill billing. 2. Leave payment empty. 3. Submit | Payment field errors shown | NEG | P1 |
| TC-CH-006 | SCN-CH-04 | Submit with only payment filled (no billing) | 1. Fill payment. 2. Leave billing empty. 3. Submit | Billing required-field errors shown | NEG | P1 |
| TC-CH-007 | SCN-CH-02 | "Continue to checkout" button is present | 1. Open /basket | Button with text "Continue to checkout" is visible | POS | P2 |
| TC-CH-008 | SCN-CH-04 | Empty basket checkout attempt | 1. Open /basket (no items). 2. Fill all fields. 3. Submit | Either warning about empty basket or checkout proceeds with £0 total | EDG | P2 |

---

## Module 10: Login Page

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-LG-001 | SCN-LG-01 | Login page loads correctly | 1. Navigate to /login | Page loads; email + password fields + Login button visible | POS | P1 |
| TC-LG-002 | SCN-LG-01 | Page heading text | 1. Open /login | Heading contains "Login" | POS | P3 |
| TC-LG-003 | SCN-LG-02 | Empty email shows validation | 1. Leave email blank. 2. Click Login | Validation message on email field | NEG | P1 |
| TC-LG-004 | SCN-LG-02 | Empty password shows validation | 1. Leave password blank. 2. Click Login | Validation message on password field | NEG | P1 |
| TC-LG-005 | SCN-LG-02 | Both fields empty — both errors shown | 1. Click Login with empty form | Both field errors shown | NEG | P1 |
| TC-LG-006 | SCN-LG-03 | Invalid email format rejected | 1. Enter "notanemail". 2. Click Login | Email format error shown | NEG | P2 |
| TC-LG-007 | SCN-LG-03 | Email missing @ symbol | 1. Enter "userdomain.com". 2. Click Login | Validation error shown | NEG | P2 |
| TC-LG-008 | SCN-LG-04 | Valid email + valid password | 1. Enter valid credentials. 2. Click Login | User logged in / success feedback | POS | P1 |
| TC-LG-009 | SCN-LG-05 | Valid email + wrong password | 1. Enter valid email + wrong password. 2. Click Login | Error message displayed | NEG | P1 |
| TC-LG-010 | SCN-LG-06 | Password field type is "password" | 1. Open /login. 2. Inspect password input | Input type = "password" (characters masked) | POS | P1 |
| TC-LG-011 | SCN-LG-03 | Email with spaces only | 1. Enter "   " in email field. 2. Click Login | Validation error — invalid email | NEG | P3 |

---

## Module 11: About Page

| TC ID | Scenario Ref | Title | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-AB-001 | SCN-AB-01 | About page loads | 1. Navigate to /about | Page loads with content | POS | P2 |
| TC-AB-002 | SCN-AB-02 | Promotional offer visible | 1. Open /about | "20% off your first sweet shop order" text visible | POS | P3 |
