# Test Strategy — Sweet Shop Web Application

**Application URL:** https://sweetshop.netlify.app/sweets  
**Document Version:** 1.0  
**Date:** 2026-04-25  
**Prepared by:** QA Team  

---

## 1. Overview

The Sweet Shop is a demo e-commerce web application offering retro British sweets. It is intentionally flawed for educational/testing purposes. This strategy defines the approach, scope, tools, and methodology for end-to-end UI automation testing.

---

## 2. Objectives

- Validate all user-facing workflows: browse, add to basket, checkout, and login.
- Identify functional defects, UI inconsistencies, and form validation gaps.
- Achieve near-100% functional coverage of all interactive elements.
- Produce a reusable, maintainable Playwright automation suite.

---

## 3. Scope

### In Scope
| Area | Description |
|---|---|
| Sweets Page | Product listing, product data, add-to-basket interaction |
| Basket Page | Cart management, delivery options, promo codes |
| Checkout Form | Billing address and payment form validation |
| Login Page | Authentication form validation |
| Navigation | Header links, basket counter, page routing |

### Out of Scope
- Backend API testing
- Performance / load testing
- Mobile native apps
- Third-party payment gateway integration
- Admin panel (not present)

---

## 4. Test Types

| Type | Approach |
|---|---|
| **Functional** | Verify each feature behaves per requirements |
| **Positive** | Valid inputs — confirm happy-path flows succeed |
| **Negative** | Invalid / empty inputs — confirm errors are shown |
| **Edge Case** | Boundary values, special characters, min/max lengths |
| **UI / Smoke** | Page load, element visibility, navigation |
| **Regression** | Re-run full suite after any change |

---

## 5. Test Approach

### Framework
- **Tool:** Playwright (TypeScript)
- **Pattern:** Page Object Model (POM)
- **Runner:** Playwright Test (`@playwright/test`)
- **Reporting:** HTML report (built-in) + console output

### Browsers Targeted
| Browser | Version |
|---|---|
| Chromium | Latest |
| Firefox | Latest |
| WebKit (Safari) | Latest |

### Environments
| Environment | URL |
|---|---|
| Production / Demo | https://sweetshop.netlify.app |

---

## 6. Entry and Exit Criteria

### Entry Criteria
- Application URL is accessible
- Node.js and Playwright are installed
- Test data file is prepared
- Page objects are implemented

### Exit Criteria
- All planned test cases executed
- No critical (P1) defects open
- Pass rate ≥ 90%
- HTML report generated

---

## 7. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Demo site downtime | Medium | High | Retry logic, local mock fallback |
| Intentional bugs in app | High | Medium | Document as known defects |
| Browser-specific failures | Low | Medium | Cross-browser matrix |
| Dynamic basket state | Medium | High | Clear basket before each test |
| Flaky selectors | Medium | Medium | Use data-* and ARIA attributes |

---

## 8. Defect Classification

| Severity | Definition |
|---|---|
| P1 – Critical | Blocks core flow (cannot checkout, page crash) |
| P2 – High | Major feature broken (basket total wrong, validation absent) |
| P3 – Medium | Minor functional issue (wrong copy, missing field label) |
| P4 – Low | Cosmetic (colour, alignment, typo) |

---

## 9. Deliverables

- `TEST_STRATEGY.md` — this document
- `TEST_PLAN.md` — schedule, resources, feature coverage
- `TEST_SCENARIOS.md` — high-level scenarios per feature
- `TEST_CASES.md` — detailed step-by-step test cases
- `TEST_DATA.ts` — structured test data (valid / invalid / edge)
- `RTM.md` — requirement traceability matrix
- `tests/` — Playwright automation scripts
- `page-objects/` — POM classes
- `EXECUTION_REPORT.md` — pass/fail summary and defect log
