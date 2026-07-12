# Project Roadmap & Progress Tracking

**Date:** 2026-07-12
**Status:** Phase 5 Complete
**Context:** This document serves as a high-level tracking tool for context retrieval. It outlines completed milestones and maps out the upcoming epics to ensure all agents and developers maintain alignment on project trajectory.

## Completed Milestones

- **Core Architecture Setup:** Monorepo/Multi-repo setup with Kwickly API, Admin Web, and Client.
- **Database & Schema:** Complete schema audit and alignment for multi-tenant and multi-branch support.
- **Theme & White-Labeling:** V2 of the theme system deployed, enabling dynamic brand colors via OKLCH and CSS variables.
- **RBAC & Audit Module:** Implementation of granular permissions, custom roles, global mutation interceptors for audit logs, and complete UI for staff access and tracking.
- **Phase 1: Menu System & Catalog Management:** Robust menu system with Menus, Modifiers, Options, and live WebSocket syncing to local POS instances.
- **Phase 2: Inventory Tracking & Supply Chain:** Built out real-time inventory levels, low-stock thresholds, and recipe/ingredient mapping.
- **Phase 3: Staff, Timesheets & Payroll:** Comprehensive HR integration allowing secure POS PIN-based clock-in/out, shift scheduling, and automated wage and payroll generation.
- **Phase 4: CRM, Wallet & Offline Subscriptions:** Full omnichannel CRM — customers can be registered at the POS, purchase subscriptions with cash, earn wallet/loyalty points, and redeem them online or at the counter. Admin UI in `CustomerDirectory.tsx` visualises wallet data. API endpoints added for offline registration and subscription selling.
- **Phase 5: Wildcard Subdomain Storefront Refactor:** Removed `[tenantSlug]` path-based routing from `kwickly-client`. The storefront now lives in `src/app/(storefront)/` (a Next.js Route Group) and reads the tenant identity directly from the HTTP `host` header. Each tenant gets `tenant.kwickly.in`. No middleware, no separate deployments. Build verified ✅.

## Upcoming Epics

### Phase 6: Advanced Analytics & Reporting
**Goal:** Deep-dive dashboards for daily/weekly revenue trends, staff performance metrics, and inventory forecasting. Target: Admin Web analytics page.

### Phase 7: Online Payments Integration (Razorpay)
**Goal:** Wire the checkout flow in `kwickly-client` to Razorpay orders API for live UPI/card payments. Webhook handler on `kwickly-api` to mark orders as `paid`.

### Phase 8: Customer-Facing Mobile App (React Native)
**Goal:** Port the customer-facing storefront features into a native iOS/Android app with deep-link QR code support for table-scanning.

### Phase 9: PWA & Push Notifications
**Goal:** Dynamic `/manifest.json` route handler per tenant for "Add to Home Screen". Web Push via service workers for order-ready notifications.

## Next Action
Begin Phase 6: Advanced Analytics dashboard on the Admin Web. Starting with daily revenue chart and top-selling items breakdown.
