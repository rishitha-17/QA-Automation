# Test Scenarios — Sweet Shop Web Application

**Date:** 2026-04-25  

Each scenario represents a distinct user journey or behaviour to be verified.

---

## Feature 1: Navigation & Home Page

| ID | Scenario |
|---|---|
| SCN-NAV-01 | User can navigate to all pages via the header navigation |
| SCN-NAV-02 | The basket counter in the header reflects the correct item count |
| SCN-NAV-03 | Logo click returns user to the home page |
| SCN-NAV-04 | Active navigation link is visually highlighted on current page |

---

## Feature 2: Sweets Listing Page

| ID | Scenario |
|---|---|
| SCN-SW-01 | All 16 products are displayed with name, price, description, and image |
| SCN-SW-02 | Product prices are formatted correctly (£X.XX) |
| SCN-SW-03 | Each product has a functional "Add to Basket" button |
| SCN-SW-04 | Page heading and introductory text are present |
| SCN-SW-05 | Products cover the expected price range (£0.10 – £1.50) |

---

## Feature 3: Add to Basket

| ID | Scenario |
|---|---|
| SCN-ATB-01 | Adding a single product updates the basket counter from 0 to 1 |
| SCN-ATB-02 | Adding multiple different products increments the counter correctly |
| SCN-ATB-03 | Adding the same product twice results in quantity 2 in basket |
| SCN-ATB-04 | Basket counter persists when navigating between pages |
| SCN-ATB-05 | Adding all 16 products produces the correct basket count |

---

## Feature 4: Basket Page — Cart Management

| ID | Scenario |
|---|---|
| SCN-BK-01 | Empty basket displays a message / zero items with no total |
| SCN-BK-02 | Basket correctly lists all added products |
| SCN-BK-03 | Product prices and quantities are correctly shown |
| SCN-BK-04 | Subtotal is calculated correctly |
| SCN-BK-05 | "Empty Basket" link removes all items from the cart |
| SCN-BK-06 | Basket state is reflected in the header counter |

---

## Feature 5: Delivery Options

| ID | Scenario |
|---|---|
| SCN-DEL-01 | "Collect (FREE)" is selected by default |
| SCN-DEL-02 | Selecting "Standard Shipping (£1.99)" adds £1.99 to the order total |
| SCN-DEL-03 | Switching back to Collect removes the shipping charge |
| SCN-DEL-04 | Only one delivery option can be selected at a time |

---

## Feature 6: Promo Code

| ID | Scenario |
|---|---|
| SCN-PC-01 | A valid promo code applies a discount to the basket total |
| SCN-PC-02 | An invalid promo code shows an appropriate error message |
| SCN-PC-03 | Submitting an empty promo code shows a validation message |
| SCN-PC-04 | Promo code field accepts alphanumeric input |

---

## Feature 7: Billing Address Form

| ID | Scenario |
|---|---|
| SCN-BA-01 | All required fields (first name, last name, address, zip) show errors when empty on submit |
| SCN-BA-02 | Email field validates correct email format |
| SCN-BA-03 | Country dropdown defaults to "United Kingdom" |
| SCN-BA-04 | City dropdown contains Bristol, Cardiff, and Swansea |
| SCN-BA-05 | Address 2 is optional and submission succeeds without it |
| SCN-BA-06 | Form accepts valid billing data without errors |
| SCN-BA-07 | Special characters in address fields are handled gracefully |
| SCN-BA-08 | Zip/postcode field validates correct UK format |

---

## Feature 8: Payment Form

| ID | Scenario |
|---|---|
| SCN-PY-01 | All payment fields are present (card name, number, expiry, CVV) |
| SCN-PY-02 | Empty payment fields trigger validation on submit |
| SCN-PY-03 | Card number field enforces numeric/length validation |
| SCN-PY-04 | Expiry date enforces future-date validation |
| SCN-PY-05 | CVV accepts only 3–4 digits |
| SCN-PY-06 | Valid test card data allows form submission |

---

## Feature 9: Checkout Submission

| ID | Scenario |
|---|---|
| SCN-CH-01 | Clicking "Continue to checkout" with empty forms shows all required-field errors |
| SCN-CH-02 | Completing all valid fields and submitting succeeds |
| SCN-CH-03 | Total shown at checkout = subtotal + applicable shipping |
| SCN-CH-04 | Attempting checkout with empty basket shows appropriate state |

---

## Feature 10: Login Page

| ID | Scenario |
|---|---|
| SCN-LG-01 | Login page displays email and password fields plus a Login button |
| SCN-LG-02 | Submitting empty form shows validation messages on both fields |
| SCN-LG-03 | Invalid email format is rejected with a validation message |
| SCN-LG-04 | Valid email + correct password logs user in |
| SCN-LG-05 | Valid email + wrong password shows an error |
| SCN-LG-06 | Password field masks input characters |

---

## Feature 11: About Page

| ID | Scenario |
|---|---|
| SCN-AB-01 | About page loads and displays the project description |
| SCN-AB-02 | Promotional banner ("20% off first order") is visible |
