# Requirement Traceability Matrix (RTM)
## Sweet Shop Web Application

**Date:** 2026-04-25

---

## How to Read This Matrix

Each row maps a **Functional Requirement (FR)** derived from the application behaviour to:
- The **Test Scenarios** that cover it
- The **Test Cases** that implement it
- The **Automation spec file** containing the automated test

---

## RTM Table

| FR ID | Functional Requirement | Scenario IDs | Test Case IDs | Spec File | Status |
|---|---|---|---|---|---|
| **Navigation** | | | | | |
| FR-NAV-01 | Header navigation links route to correct pages | SCN-NAV-01 | TC-NAV-001..004 | navigation.spec.ts | Covered |
| FR-NAV-02 | Logo click returns to homepage | SCN-NAV-03 | TC-NAV-005 | navigation.spec.ts | Covered |
| FR-NAV-03 | Basket counter displays current item count | SCN-NAV-02 | TC-NAV-006..008, TC-ATB-001..005 | navigation.spec.ts | Covered |
| FR-NAV-04 | Invalid routes handled gracefully | SCN-NAV-04 | TC-NAV-009 | navigation.spec.ts | Covered |
| **Sweets Page** | | | | | |
| FR-SW-01 | Sweets page displays 16 products | SCN-SW-01 | TC-SW-003 | sweets-page.spec.ts | Covered |
| FR-SW-02 | Each product shows name, price, description, image | SCN-SW-01 | TC-SW-004..008 | sweets-page.spec.ts | Covered |
| FR-SW-03 | Prices are formatted as £X.XX | SCN-SW-02 | TC-SW-005, TC-SW-009..011 | sweets-page.spec.ts | Covered |
| FR-SW-04 | Each product has enabled "Add to Basket" button | SCN-SW-03 | TC-SW-008, TC-SW-015 | sweets-page.spec.ts | Covered |
| FR-SW-05 | Page heading and subtitle are correct | SCN-SW-04 | TC-SW-001..002 | sweets-page.spec.ts | Covered |
| FR-SW-06 | Product images load without errors | SCN-SW-01 | TC-SW-007, TC-SW-014 | sweets-page.spec.ts | Covered |
| **Add to Basket** | | | | | |
| FR-ATB-01 | Clicking "Add to Basket" increments basket counter | SCN-ATB-01 | TC-ATB-001 | sweets-page.spec.ts | Covered |
| FR-ATB-02 | Adding multiple products reflects correct count | SCN-ATB-02 | TC-ATB-002..003 | sweets-page.spec.ts | Covered |
| FR-ATB-03 | Adding same product multiple times accumulates quantity | SCN-ATB-03 | TC-ATB-004, TC-ATB-008 | sweets-page.spec.ts | Covered |
| FR-ATB-04 | Basket counter persists across page navigation | SCN-ATB-04 | TC-ATB-005 | sweets-page.spec.ts | Covered |
| FR-ATB-05 | Added products appear in basket page | SCN-ATB-01 | TC-ATB-007 | basket.spec.ts | Covered |
| **Basket Management** | | | | | |
| FR-BK-01 | Empty basket shows zero items | SCN-BK-01 | TC-BK-001 | basket.spec.ts | Covered |
| FR-BK-02 | Basket lists added products with correct names | SCN-BK-02 | TC-BK-002, TC-BK-011 | basket.spec.ts | Covered |
| FR-BK-03 | Basket shows correct product prices and quantities | SCN-BK-03 | TC-BK-003..004 | basket.spec.ts | Covered |
| FR-BK-04 | Subtotal is calculated correctly | SCN-BK-04 | TC-BK-005, TC-BK-009..010 | basket.spec.ts | Covered |
| FR-BK-05 | "Empty Basket" removes all items | SCN-BK-05 | TC-BK-006 | basket.spec.ts | Covered |
| **Delivery Options** | | | | | |
| FR-DEL-01 | "Collect (FREE)" is default delivery option | SCN-DEL-01 | TC-DEL-001, TC-DEL-006 | basket.spec.ts | Covered |
| FR-DEL-02 | Selecting Standard Shipping adds £1.99 to total | SCN-DEL-02 | TC-DEL-002, TC-DEL-005 | basket.spec.ts | Covered |
| FR-DEL-03 | Switching back to Collect removes shipping fee | SCN-DEL-03 | TC-DEL-003 | basket.spec.ts | Covered |
| FR-DEL-04 | Delivery options are mutually exclusive | SCN-DEL-04 | TC-DEL-004 | basket.spec.ts | Covered |
| **Promo Code** | | | | | |
| FR-PC-01 | Valid promo code applies discount | SCN-PC-01 | TC-PC-001, TC-PC-007 | basket.spec.ts | Covered |
| FR-PC-02 | Invalid promo code shows error | SCN-PC-02 | TC-PC-002 | basket.spec.ts | Covered |
| FR-PC-03 | Empty promo code shows validation | SCN-PC-03 | TC-PC-003 | basket.spec.ts | Covered |
| FR-PC-04 | Promo code accepts alphanumeric | SCN-PC-04 | TC-PC-004..005 | basket.spec.ts | Covered |
| **Billing Address** | | | | | |
| FR-BA-01 | First name is a required field | SCN-BA-01 | TC-BA-001, TC-BA-019..020 | checkout.spec.ts | Covered |
| FR-BA-02 | Last name is a required field | SCN-BA-01 | TC-BA-002 | checkout.spec.ts | Covered |
| FR-BA-03 | Address line 1 is required | SCN-BA-01 | TC-BA-003 | checkout.spec.ts | Covered |
| FR-BA-04 | Zip/postcode is required | SCN-BA-01 | TC-BA-004, TC-BA-014..015 | checkout.spec.ts | Covered |
| FR-BA-05 | Email field validates format | SCN-BA-02 | TC-BA-005..006, TC-BA-018 | checkout.spec.ts | Covered |
| FR-BA-06 | Country defaults to United Kingdom | SCN-BA-03 | TC-BA-007 | checkout.spec.ts | Covered |
| FR-BA-07 | City dropdown has Bristol, Cardiff, Swansea | SCN-BA-04 | TC-BA-008..010 | checkout.spec.ts | Covered |
| FR-BA-08 | Address 2 is optional | SCN-BA-05 | TC-BA-011 | checkout.spec.ts | Covered |
| FR-BA-09 | All required fields validated simultaneously on submit | SCN-BA-01 | TC-BA-017 | checkout.spec.ts | Covered |
| **Payment Form** | | | | | |
| FR-PY-01 | All 4 payment fields are present | SCN-PY-01 | TC-PY-001 | checkout.spec.ts | Covered |
| FR-PY-02 | Empty payment fields trigger validation | SCN-PY-02 | TC-PY-002..005 | checkout.spec.ts | Covered |
| FR-PY-03 | Card number validates format and length | SCN-PY-03 | TC-PY-007..009 | checkout.spec.ts | Covered |
| FR-PY-04 | Expiry date validates format and future date | SCN-PY-04 | TC-PY-010..011 | checkout.spec.ts | Covered |
| FR-PY-05 | CVV validates 3–4 digit length | SCN-PY-05 | TC-PY-012..014 | checkout.spec.ts | Covered |
| FR-PY-06 | Valid payment data is accepted | SCN-PY-06 | TC-PY-006 | checkout.spec.ts | Covered |
| **Checkout Submission** | | | | | |
| FR-CH-01 | "Continue to checkout" triggers full form validation | SCN-CH-01 | TC-CH-001 | checkout.spec.ts | Covered |
| FR-CH-02 | Successful checkout with all valid data | SCN-CH-02 | TC-CH-002 | checkout.spec.ts | Covered |
| FR-CH-03 | Total reflects correct subtotal + shipping | SCN-CH-03 | TC-CH-003..004 | checkout.spec.ts | Covered |
| FR-CH-04 | Partial form data shows relevant section errors | SCN-CH-04 | TC-CH-005..006 | checkout.spec.ts | Covered |
| **Login** | | | | | |
| FR-LG-01 | Login page renders correctly | SCN-LG-01 | TC-LG-001..002 | login.spec.ts | Covered |
| FR-LG-02 | Empty fields trigger validation | SCN-LG-02 | TC-LG-003..005 | login.spec.ts | Covered |
| FR-LG-03 | Invalid email format rejected | SCN-LG-03 | TC-LG-006..007, TC-LG-011 | login.spec.ts | Covered |
| FR-LG-04 | Valid credentials authenticate user | SCN-LG-04 | TC-LG-008 | login.spec.ts | Covered |
| FR-LG-05 | Invalid credentials show error | SCN-LG-05 | TC-LG-009 | login.spec.ts | Covered |
| FR-LG-06 | Password field masks input | SCN-LG-06 | TC-LG-010 | login.spec.ts | Covered |
| **About Page** | | | | | |
| FR-AB-01 | About page loads with correct content | SCN-AB-01 | TC-AB-001 | navigation.spec.ts | Covered |
| FR-AB-02 | Promotional offer is displayed | SCN-AB-02 | TC-AB-002 | navigation.spec.ts | Covered |

---

## Coverage Summary

| Feature Area | Total FRs | Covered | % Coverage |
|---|---|---|---|
| Navigation | 4 | 4 | 100% |
| Sweets Page | 6 | 6 | 100% |
| Add to Basket | 5 | 5 | 100% |
| Basket Management | 5 | 5 | 100% |
| Delivery Options | 4 | 4 | 100% |
| Promo Code | 4 | 4 | 100% |
| Billing Address | 9 | 9 | 100% |
| Payment Form | 6 | 6 | 100% |
| Checkout Submit | 4 | 4 | 100% |
| Login | 6 | 6 | 100% |
| About Page | 2 | 2 | 100% |
| **TOTAL** | **55** | **55** | **100%** |
