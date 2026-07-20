# Project Roadmap & Progress Tracking

**Date:** 2026-07-19  
**Status:** Phase 8 Complete — Phase 9 Starting  
**Context:** This document is a high-level roadmap. The detailed phase-by-phase tracker with sub-tasks and bug tracking lives in `docs/progress-and-planning/2026-07-19-master-progress-tracker/progress-tracker.md`.

## Completed Milestones

- **Core Architecture Setup:** Monorepo/Multi-repo setup with Kwickly API, Admin Web, and Client.
- **Database & Schema:** Complete schema audit and alignment for multi-tenant and multi-branch support.
- **Theme & White-Labeling:** V2 of the theme system deployed, enabling dynamic brand colors via OKLCH and CSS variables.
- **RBAC & Audit Module:** Granular permissions, custom roles, global mutation interceptors for audit logs.
- **Phase 1: Menu System & Catalog Management:** Robust menu system with Menus, Modifiers, Options, and live WebSocket syncing.
- **Phase 2: Inventory Tracking & Supply Chain:** Real-time inventory levels, low-stock thresholds, recipe/ingredient mapping.
- **Phase 3: Staff, Timesheets & Payroll:** POS PIN-based clock-in/out, shift scheduling, automated payroll generation.
- **Phase 4: CRM, Wallet & Offline Subscriptions:** Customer directory, loyalty points, subscriptions, campaign logs.
- **Phase 5: Wildcard Subdomain Storefront Refactor:** Host-based tenant resolution, `(storefront)` route group. No middleware.
- **Phase 6: KDS Kanban Redesign:** `@dnd-kit` drag-and-drop board, text-dense tickets, urgency badges, forward-only enforcement.
- **Phase 7: ETA & Kitchen Prep Time:** `defaultPreparationTime` on tenants, SSE-driven live countdown on client tracking page.
- **Phase 8: Theme & Font System:** Plus Jakarta Sans / Inter dual-font, semantic Tailwind tokens, 60-30-10 color rule.

## Upcoming Phases

### 🔴 Phase 9: Table Management & QR Codes
**Goal:** Full restaurant floor management. Registered tables with plan-gated limits (FREE=0, BASIC=10, STARTER=25, GROWTH=75, ENTERPRISE=unlimited). QR tokens baked into URLs. Session-based order management: 1 master order per table sitting, multi-round KOTs. Fix hardcoded tableNumber bug in client.  
**Repos:** kwickly-api (schema + module) · kwickly-admin-web (FloorView + QRManager pages) · kwickly-client (QR token flow + session-aware checkout)

### 🔴 Phase 10: Online Payments (Razorpay)
**Goal:** Wire client checkout to Razorpay. Webhook handler on API. Mark orders as `paid`.

### 🔴 Phase 11: Advanced Analytics Dashboard
**Goal:** Daily/weekly revenue trends, top-selling items, staff performance, inventory forecast.

### 🔴 Phase 12: PWA & Push Notifications
**Goal:** Dynamic `/manifest.json` per tenant. Web Push for order-ready notifications.

### 🔴 Phase 13: Customer-Facing Mobile App
**Goal:** React Native port of storefront. Deep-link QR support. Biometric login.

## Next Action
Begin Phase 9: Table Management & QR Codes. Start with `kwickly-api` schema migration (restaurant_tables + table_sessions), then admin web FloorView page, then client QR token flow.

