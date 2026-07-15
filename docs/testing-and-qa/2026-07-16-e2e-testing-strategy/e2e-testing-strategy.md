# End-to-End Testing Strategy (Playwright)

**Date:** 2026-07-16
**Domain:** Testing & QA
**Status:** Approved & Implemented

## Context
While the Admin Web utilizes `vitest` for unit testing and React component testing, there was a critical lack of automated End-to-End (E2E) browser testing for core business flows like User Login, Menu Management, and RBAC evaluations.

## Decision
We have adopted **Playwright** as the official E2E testing framework for the Admin Web. 

## Implementation
- Playwright is installed and configured in the repository root.
- A basic smoke test suite exists in the `e2e/` directory.
- Developers should write Playwright tests for any new critical path (e.g., creating a tenant, assigning staff roles) to ensure regressions do not occur in production.
