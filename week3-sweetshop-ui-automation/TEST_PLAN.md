# Test Plan — Sweet Shop Web Application

**Document Version:** 1.0  
**Date:** 2026-04-25  
**Application:** Sweet Shop (https://sweetshop.netlify.app)

---

## 1. Introduction

This Test Plan describes the activities required to validate the Sweet Shop web application. It defines features, schedule, resources, test environment, and the allocation of test cases across features.

---

## 2. Features to be Tested

| ID | Feature | Priority |
|---|---|---|
| F-01 | Home Page & Navigation | High |
| F-02 | Sweets Product Listing Page | High |
| F-03 | Add to Basket Functionality | High |
| F-04 | Basket Management | High |
| F-05 | Delivery Options (Collect / Shipping) | High |
| F-06 | Promo Code | Medium |
| F-07 | Billing Address Form | High |
| F-08 | Payment Form | High |
| F-09 | Checkout Submission | High |
| F-10 | Login Page & Validation | Medium |
| F-11 | About Page | Low |

---

## 3. Features Not to be Tested

- Backend logic / API responses
- Email delivery (shipping updates)
- Database persistence
- Social media links on login page (third-party)

---

## 4. Test Environment

| Component | Details |
|---|---|
| OS | macOS / Windows / Linux |
| Browser | Chromium, Firefox, WebKit |
| Node.js | v18+ |
| Playwright | v1.40+ |
| Test Runner | @playwright/test |
| Base URL | https://sweetshop.netlify.app |

---

## 5. Test Case Count by Feature

| Feature | Positive | Negative | Edge | Total |
|---|---|---|---|---|
| Navigation | 6 | 2 | 1 | 9 |
| Sweets Page | 8 | 3 | 4 | 15 |
| Add to Basket | 5 | 2 | 3 | 10 |
| Basket Management | 7 | 3 | 3 | 13 |
| Delivery Options | 4 | 1 | 2 | 7 |
| Promo Code | 2 | 4 | 2 | 8 |
| Billing Form | 8 | 8 | 4 | 20 |
| Payment Form | 5 | 6 | 3 | 14 |
| Checkout Submit | 3 | 3 | 2 | 8 |
| Login | 3 | 6 | 2 | 11 |
| About Page | 2 | 0 | 0 | 2 |
| **Total** | **53** | **38** | **26** | **117** |

---

## 6. Test Schedule

| Phase | Activity | Duration |
|---|---|---|
| Setup | Install Playwright, scaffold project | 0.5 days |
| Design | Write test cases, scenarios, RTM | 1 day |
| Automation | Implement page objects and specs | 2 days |
| Execution | Run full suite, capture results | 0.5 days |
| Reporting | Document defects, generate report | 0.5 days |
| **Total** | | **4.5 days** |

---

## 7. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Lead | Strategy, plan, review |
| QA Engineer | Test cases, automation scripts |
| Developer | Bug investigation and fix |

---

## 8. Suspension and Resumption Criteria

**Suspend** if:
- The application is inaccessible for > 30 minutes
- A P1 defect blocks > 50% of test cases

**Resume** when:
- Application is restored
- Blocking defect is fixed and verified

---

## 9. Assumptions and Dependencies

- The demo site remains publicly accessible throughout testing.
- Basket state is managed via browser localStorage (cleared between tests using `page.evaluate`).
- The application does not require real payment credentials (test data is sufficient).
- City dropdown is limited to Bristol, Cardiff, and Swansea.
- No back-end email verification is required for login testing.
