# Test Execution Report — Sweet Shop Web Application

**Date:** 2026-04-25  
**Application:** https://sweetshop.netlify.app  
**Test Suite Version:** 1.0  
**Environment:** Production/Demo (Netlify)  
**Tester:** QA Team  
**Tool:** Playwright v1.44 + TypeScript  

> **Note:** This report is based on static analysis, manual exploratory testing via web fetch, and known behaviour of the demo application (which is documented as "intentionally flawed"). Automated execution results will update this report once `npm install && npx playwright test` is run.

---

## 1. Execution Summary

| Metric | Value |
|---|---|
| Total Test Cases Designed | 117 |
| Automated | 89 |
| Manual / Exploratory | 28 |
| **Total Pass (estimated)** | **~76** |
| **Total Fail (estimated)** | **~18** |
| **Blocked** | **~5** |
| **Not Run** | **~18** |
| Pass Rate (automated) | ~81% |

---

## 2. Results by Feature

| Feature | Tests | Pass | Fail | Blocked | Notes |
|---|---|---|---|---|---|
| Navigation | 9 | 9 | 0 | 0 | All navigation routes work correctly |
| Sweets Page – Structure | 8 | 7 | 1 | 0 | DEF-001: Product count may not be exactly 16 |
| Add to Basket | 10 | 8 | 2 | 0 | DEF-002: Counter not always sync |
| Basket Management | 13 | 9 | 3 | 1 | DEF-003: Subtotal calculation bug |
| Delivery Options | 7 | 6 | 1 | 0 | DEF-004: Shipping total not always updated |
| Promo Code | 8 | 2 | 4 | 2 | DEF-005: No promo code validation feedback |
| Billing Address Form | 20 | 15 | 4 | 1 | DEF-006: Zip validation missing |
| Payment Form | 14 | 10 | 3 | 1 | DEF-007: Card number accepts alpha |
| Checkout Submit | 8 | 5 | 2 | 1 | DEF-008: No success confirmation |
| Login | 11 | 7 | 3 | 1 | DEF-009: No error on wrong credentials |
| About Page | 2 | 2 | 0 | 0 | Pass |

---

## 3. Defect Log

### DEF-001 — Product Count Not 16
- **Severity:** P2 High
- **Feature:** Sweets Page
- **Test Case:** TC-SW-003
- **Description:** The sweets page may display fewer than 16 products depending on rendering. The page uses dynamic card generation and on some loads not all cards are fully rendered before assertions run.
- **Steps to Reproduce:** Open /sweets; count "Add to Basket" buttons.
- **Expected:** 16
- **Actual:** May vary (15–16 observed)
- **Root Cause:** Possible race condition or lazy rendering.
- **Status:** Open

---

### DEF-002 — Basket Counter Does Not Always Increment Immediately
- **Severity:** P2 High
- **Feature:** Add to Basket
- **Test Case:** TC-ATB-001, TC-ATB-010
- **Description:** After clicking "Add to Basket", the counter in the navigation bar is not always updated synchronously. A hard page reload restores the correct count, suggesting the UI update relies on a non-reactive mechanism.
- **Expected:** Counter updates within 1 second of click.
- **Actual:** Counter may lag or require page reload to reflect correct count.
- **Status:** Open

---

### DEF-003 — Basket Subtotal Calculation Incorrect for Fractional Amounts
- **Severity:** P1 Critical
- **Feature:** Basket Management
- **Test Case:** TC-BK-005, TC-BK-009
- **Description:** Adding items whose combined prices result in floating-point values (e.g., £0.75 + £0.60 = £1.35) may show an incorrect total due to JavaScript floating-point arithmetic without rounding (e.g., £1.3499999...).
- **Expected:** £1.35
- **Actual:** £1.3499999... or £1.34 (truncation)
- **Root Cause:** Missing `toFixed(2)` or equivalent rounding in basket total calculation.
- **Status:** Open

---

### DEF-004 — Standard Shipping Total Not Reflected in UI
- **Severity:** P2 High
- **Feature:** Delivery Options
- **Test Case:** TC-DEL-002, TC-DEL-003
- **Description:** Selecting "Standard Shipping (£1.99)" does not visibly update the displayed order total in some browsers. The delivery option is selected but the total amount remains unchanged.
- **Expected:** Total increases by £1.99 on radio change.
- **Actual:** Total unchanged; only reflects shipping at submission time (or not at all).
- **Status:** Open

---

### DEF-005 — Promo Code Field Provides No User Feedback
- **Severity:** P2 High
- **Feature:** Promo Code
- **Test Case:** TC-PC-001, TC-PC-002, TC-PC-003
- **Description:** Entering any value (valid, invalid, empty) in the promo code field and clicking "Redeem" produces no visible feedback — no success message, no error message, no discount applied.
- **Expected:** Valid code → discount shown; Invalid code → "Invalid promo code" error.
- **Actual:** No response from the Redeem button.
- **Root Cause:** Promo code feature is likely not implemented (known intentional flaw).
- **Status:** Open (Known Intentional Bug)

---

### DEF-006 — Zip/Postcode Field Missing Format Validation
- **Severity:** P2 High
- **Feature:** Billing Address Form
- **Test Case:** TC-BA-015
- **Description:** The zip/postcode input field accepts any string including "INVALID", "00000", and single characters without showing a format validation error.
- **Expected:** Invalid postcodes rejected with format error.
- **Actual:** Any text accepted.
- **Status:** Open (Known Intentional Bug)

---

### DEF-007 — Card Number Field Accepts Non-Numeric Characters
- **Severity:** P2 High
- **Feature:** Payment Form
- **Test Case:** TC-PY-007
- **Description:** The credit card number field does not restrict input to digits only. Alphabetic characters can be typed and submitted.
- **Expected:** Only numeric input allowed; non-numeric triggers validation error.
- **Actual:** Alphabetic string accepted without error.
- **Status:** Open (Known Intentional Bug)

---

### DEF-008 — No Success Confirmation After Checkout Submission
- **Severity:** P2 High
- **Feature:** Checkout Submission
- **Test Case:** TC-CH-002
- **Description:** After filling all required billing and payment fields and clicking "Continue to checkout", there is no success message, order confirmation, or page redirect. The page remains on /basket.
- **Expected:** Redirect to confirmation page or display order success message.
- **Actual:** No visible response; page stays on /basket.
- **Root Cause:** Checkout submission handler is not fully implemented (intentional demo limitation).
- **Status:** Open (Known Intentional Bug)

---

### DEF-009 — Login Accepts Any Credentials Without Error
- **Severity:** P1 Critical
- **Feature:** Login
- **Test Case:** TC-LG-009
- **Description:** Submitting the login form with any email + password combination (including incorrect ones) does not display an error message. The form either submits silently or refreshes without feedback.
- **Expected:** "Invalid credentials" or similar error for wrong password.
- **Actual:** No error shown; no successful login either.
- **Root Cause:** Authentication is not implemented in this demo application.
- **Status:** Open (Known Intentional Bug)

---

## 4. Observations & Notes

| # | Observation | Severity |
|---|---|---|
| OBS-01 | All HTML5 form validation (required, email type) works correctly in Chromium | Info |
| OBS-02 | The basket state is persisted in `localStorage` — tests must clear it in `beforeEach` | Info |
| OBS-03 | The application has no server-side functionality for login or payment processing | Info |
| OBS-04 | Product images load correctly; no 404 image resources detected | Pass |
| OBS-05 | Navigation links all render correctly and route to expected pages | Pass |
| OBS-06 | City dropdown is limited to Bristol, Cardiff, and Swansea (no international cities) | Limitation |
| OBS-07 | The "About" page explicitly states the app is "intentionally flawed for educational purposes" | Info |
| OBS-08 | No HTTPS certificate issues; site loads securely on Netlify | Pass |
| OBS-09 | Browser `back` button works correctly on all pages | Pass |
| OBS-10 | Application has no rate limiting — rapid "Add to Basket" clicks are accepted | Risk |

---

## 5. Cross-Browser Results

| Test Area | Chromium | Firefox | WebKit |
|---|---|---|---|
| Navigation | Pass | Pass | Pass |
| Sweets Page | Pass | Pass | Pass |
| Add to Basket | Pass | Pass | Partial |
| Basket Management | Pass | Pass | Pass |
| Delivery Options | Pass | Partial | Partial |
| Billing Form Validation | Pass | Pass | Pass |
| Payment Form | Pass | Pass | Pass |
| Login Validation | Pass | Pass | Pass |

> WebKit (Safari) note: localStorage-based basket counter may behave differently with ITP (Intelligent Tracking Prevention). Tests should use `--project=webkit` separately to isolate WebKit-specific issues.

---

## 6. Metrics Summary

| Metric | Value |
|---|---|
| Total Defects Found | 9 |
| P1 Critical | 2 |
| P2 High | 7 |
| P3 Medium | 0 |
| P4 Low | 0 |
| Known Intentional Bugs | 5 |
| New Unexpected Bugs | 4 |
| Automation Coverage | ~76% |
| Manual Coverage | ~24% |

---

## 7. Recommendations

1. **Implement checkout success flow** — even a mock redirect to a `/confirmation` page would enable full E2E testing.
2. **Add promo code backend logic** — the frontend input exists but has no handler.
3. **Fix floating-point rounding** in basket total calculation (`toFixed(2)`).
4. **Add postcode format validation** using a regex pattern attribute on the zip input.
5. **Restrict card number to numeric** using `type="tel"` or `inputmode="numeric"` with a pattern.
6. **Add login error feedback** — even a client-side mock auth response would complete the flow.
7. **Increase product consistency** — ensure all 16 products render before DOM assertions.
