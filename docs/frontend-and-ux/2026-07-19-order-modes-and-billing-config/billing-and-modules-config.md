# ADR: Order Modes Toggle & Billing Configuration UI

**Date:** 2026-07-19  
**Domain:** Frontend & UX  
**Status:** Approved  

---

## 1. Context

Restaurant owners need granular control over which ordering modes are active on their customer storefront (e.g., toggling off delivery during peak hours or if delivery staff is unavailable). However, these choices must be locked or validated against the limits of their platform subscription plan. 

Furthermore, platform super-admins require a UI inside the Platform Tenant Dashboard to manage and update a tenant's billing details, change plans (including the Custom tier), set metered billing parameters, and configure custom flat order rates.

---

## 2. Decision

We will implement new settings panels and platform controls in the Kwickly Admin Web.

### A. Restaurant Settings: Order Modes Configuration
* We will implement an **Order Modes Configuration Panel** under Branch Settings.
* Toggles will correspond to Dine-In, Takeaway, and Delivery.
* Feature locking rules:
  * **Basic/Starter Plan:** "Delivery" and "Subscriptions" toggles are disabled and render a "Lock" icon with a CTA to upgrade to the Growth or Enterprise plan.
  * **Growth Plan:** "Subscriptions" toggle is disabled with an upgrade CTA.
  * **Enterprise/Custom Plan:** All toggles are active.
* State modifications are saved back to the database via `/v1/tenant/settings` using the `enabledModules` JSONB payload.

### B. Platform Settings: Tenant Plan & Billing Editor
* We will update the **Platform Tenants Dashboard** (available to super-admins and platform-owners) to configure:
  * **Subscription Plan:** Basic, Starter, Growth, Enterprise, or Custom.
  * **Billing Model:** Flat-rate vs. Metered (Pay-As-You-Go).
  * **Custom Pricing Overrides:** Fields to define `baseFee`, `customOrderRate`, and `maxOrdersPerMonth`.

---

## 3. Consequences

* **Clear Value Upgrades:** Encourages self-serve conversions by visually locking premium modules (Delivery, Subscriptions) and offering inline upgrade paths.
* **Control and Flexibility:** Restaurant owners can instantly toggle storefront options to match kitchen load without requiring technical support.
* **Streamlined Enterprise Setup:** Super-admins can adjust pricing terms and manually activate features for high-volume custom contracts.
