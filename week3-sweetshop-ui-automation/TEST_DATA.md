# Test Data — Sweet Shop Web Application

**Date:** 2026-04-25

---

## 1. Product Reference Data (Sweets Page)

| Product Name | Price | Notes |
|---|---|---|
| Chocolate Cups | £1.00 | Featured on homepage |
| Sherbert Straws | £0.75 | Featured on homepage |
| Sherbert Discs | £0.95 | Featured on homepage |
| Bon Bons | £1.00 | Featured on homepage |
| Wham Bars | £0.15 | Cheapest product |
| Swansea Mixture | £1.50 | Most expensive product |
| Nerds | £0.60 | American candy |

---

## 2. Valid Billing Address Data

| Field | Value 1 | Value 2 | Value 3 |
|---|---|---|---|
| First Name | John | Alice | O'Brien |
| Last Name | Smith | Johnson | Test-User |
| Email | john.smith@example.com | alice@test.co.uk | user+tag@mail.org |
| Address | 123 High Street | 45 Park Avenue | 7 Queen's Road |
| Address 2 | Flat 3 | (empty) | Suite 100 |
| Country | United Kingdom | United Kingdom | United Kingdom |
| City | Bristol | Cardiff | Swansea |
| Zip / Postcode | BS1 4DJ | CF10 1EP | SA1 1TU |

---

## 3. Invalid Billing Address Data

| Field | Invalid Value | Reason |
|---|---|---|
| First Name | (empty) | Required field |
| Last Name | (empty) | Required field |
| Email | notanemail | Missing @ |
| Email | user@.com | Invalid domain |
| Email | @example.com | Missing local part |
| Email | user @example.com | Space in email |
| Address | (empty) | Required field |
| Zip | INVALID | Not a valid postcode format |
| Zip | (empty) | Required field |
| Zip | 00000 | Non-UK format |

---

## 4. Edge Case Billing Address Data

| Field | Edge Value | Notes |
|---|---|---|
| First Name | A | Single character |
| First Name | Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa | 100 characters |
| First Name | 12345 | Numeric input |
| First Name | <script>alert(1)</script> | XSS attempt |
| Address | 12 O'Brien St, Apt #4-B | Special chars |
| Zip | SW1A 1AA | Valid with space |
| Zip | sw1a1aa | Lowercase, no space |
| Email | user@mail.example.co.uk | Subdomain |

---

## 5. Valid Payment Data

| Field | Value 1 | Value 2 |
|---|---|---|
| Name on Card | John Smith | ALICE JOHNSON |
| Card Number | 4111111111111111 | 5500005555555559 |
| Expiry Date | 12/26 | 06/28 |
| CVV | 123 | 456 |

---

## 6. Invalid Payment Data

| Field | Invalid Value | Reason |
|---|---|---|
| Card Number | (empty) | Required |
| Card Number | 4111 | Too short |
| Card Number | ABCDABCDABCDABCD | Non-numeric |
| Card Number | 41111111111111112345 | Too long (20 digits) |
| Expiry Date | (empty) | Required |
| Expiry Date | 01/20 | Past date |
| Expiry Date | 13/26 | Invalid month |
| Expiry Date | 2025/12 | Wrong format |
| CVV | (empty) | Required |
| CVV | 12 | Too short (< 3 digits) |
| CVV | 12345 | Too long (> 4 digits) |
| CVV | ABC | Non-numeric |
| Name on Card | (empty) | Required |

---

## 7. Valid Login Credentials

| Email | Password | Expected Result |
|---|---|---|
| user@sweetshop.com | password123 | Login success (verify with app) |
| admin@sweetshop.com | admin123 | Login success (verify with app) |

---

## 8. Invalid Login Credentials

| Email | Password | Expected Result |
|---|---|---|
| (empty) | (empty) | Validation errors on both fields |
| notanemail | password | Email format error |
| user@sweetshop.com | wrongpassword | Login error message |
| (empty) | password123 | Email required error |
| user@sweetshop.com | (empty) | Password required error |
| userdomain.com | password | Email format error |
|    (spaces)   | password | Email format error |

---

## 9. Promo Code Data

| Code | Type | Expected Result |
|---|---|---|
| SWEET10 | Valid (assumed) | Discount applied |
| INVALID99 | Invalid | Error message shown |
| (empty) | Empty | No action / validation error |
| sweet10 | Valid lowercase | Same as SWEET10 (case-insensitive) |
| SW!@#$% | Special chars | Invalid code error |
| (200 char string) | Overflow | Truncated or error |

---

## 10. Basket Calculation Test Data

| Items Added | Qty | Unit Price | Expected Subtotal | With Shipping |
|---|---|---|---|---|
| Chocolate Cups | 1 | £1.00 | £1.00 | £2.99 |
| Sherbert Straws | 1 | £0.75 | £0.75 | £2.74 |
| Chocolate Cups + Sherbert Straws | 1+1 | £1.00+£0.75 | £1.75 | £3.74 |
| Wham Bars | 3 | £0.15 | £0.45 | £2.44 |
| Swansea Mixture | 2 | £1.50 | £3.00 | £4.99 |
