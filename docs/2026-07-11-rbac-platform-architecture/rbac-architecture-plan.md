# Kwickly SaaS Architecture & RBAC Implementation Plan

Based on a comprehensive audit of the complete Kwickly API database schema (`users.ts`, `tenants.ts`, `rbac.ts`, `orders.ts`, `subscriptions.ts`, `auditLogs.ts`), this document outlines the current state, missing architectural components, and a phase-wise implementation plan for a production-grade SaaS and POS platform.

## 1. Platform Owner (Super Admin) Architecture

The Platform Owner (`tenantId = null` with role `platform_owner` or `super_admin`) manages the overarching SaaS business, billing, and global configuration.

### Current Pages (Based on existing UI structure)
- Platform Dashboard (High-level KPIs)
- Global Billing & Subscriptions
- Platform Tenants (Merchant management)
- Platform Staff & Roles
- Global Support Tickets

### 🔴 What is Missing for a Production-Grade App?
1. **Tenant Impersonation:** Support teams need the ability to "Login As" a specific merchant to troubleshoot issues.
2. **Global Feature Flag Management:** Ability to roll out beta features to specific tenants before a global release.
3. **System Health & Webhook Logs:** A dashboard to monitor failed API requests and third-party webhook deliveries.
4. **Subscription Tier Builder:** A UI to dynamically edit SaaS features tied to `FREE`, `STARTER`, `GROWTH`, and `ENTERPRISE` plans.
5. **Global Audit Trail Viewer:** The `auditLogs.ts` table captures detailed mutation payloads and IP addresses. Super Admins need a dedicated security dashboard to search and filter these logs globally across all tenants.

### Platform Staff RBAC
Platform staff (Support Agents, Account Executives, Engineers) must use the dynamic `roles` table with `isSystem = true`. 
- **Example Roles:** `support_agent` (can view tenants, cannot change billing), `billing_admin` (can modify plans).

---

## 2. Tenant (Merchant) Architecture

The Tenant Owner (`tenant_owner`) manages their restaurant brand across multiple `branches`.

### Current Pages
- Tenant Dashboard & Analytics
- Menu Management (Categories, Items, Modifiers)
- Inventory & Stock Management
- Staff Directory & Payroll
- Orders & CRM

### 🔴 What is Missing for a Production-Grade App?
1. **Multi-Branch Aggregation vs. Isolation:** The UI must clearly indicate if the user is viewing "All Branches" or a specific "Downtown Branch". 
2. **Hardware/Device Management (KDS & POS):** POS apps rely on physical hardware. The admin panel needs a "Devices" page to generate secure pairing codes to authenticate iPads without a password.
3. **Custom Role Builder UI:** A matrix where a Tenant Owner can create a custom role (e.g., "Shift Supervisor") and toggle specific granular permissions (e.g., `orders:refund`, `menu:read`).
4. **B2C Customer Subscription Management:** The schema (`customerSubscriptions`) reveals a complex meal-plan subscription engine (QR secrets, meal carry-forwards). The tenant needs a robust "Loyalty & Subscriptions" dashboard to manage these end-customer plans.
5. **Tenant-Level Security Audit Log:** A scoped version of the Audit Trail so the Tenant Owner can see which staff member triggered a refund or deleted an inventory item.

---

## 3. Tenant Staff & RBAC (Role-Based Access Control)

### Industry Best Practice Recommendations
1. **Deprecate the Static Enum for Staff:** Rely entirely on the dynamic `roles` and `permissions` tables. The `user_role` enum should strictly isolate `platform_owner`, `tenant_owner`, and `staff`.
2. **Implement ABAC (Attribute-Based Access Control):** A staff member might be a `manager` (Role), but only for `branchId = X` (Attribute). The backend middleware must check the granular permission token (`inventory:write`) AND the branch constraint.
3. **PIN-Based POS Login:** Staff operating the POS terminal shouldn't use an email/password. They need a 4-digit PIN system tied to their `userId` for rapid switching on shared hardware.

---

## Phase-Wise Implementation Plan

To build this into a production-grade system, we will execute in the following phases:

### Phase 1: RBAC UI & Security Hardening (Immediate)
- `[ ]` **Backend:** Update the API auth middleware to validate granular `permissions` via `roleId`, rather than relying solely on the `userRoleEnum`.
- `[ ]` **Frontend:** Build the `settings/RolesAndPermissions.tsx` UI matrix.
- `[ ]` **Frontend:** Implement React Route Guards to block access to routes if the `user.permissions` array lacks the required token.

### Phase 2: Operations & Customer Subscriptions (Short-Term)
- `[ ]` **Frontend:** Build the "Customer Subscriptions & Loyalty" dashboard to expose the `customerSubscriptions` table logic (managing active/paused meal plans).
- `[ ]` **Frontend:** Build the scoped Tenant Audit Log viewer to track staff actions (e.g., tracing unauthorized refunds).

### Phase 3: Platform Admin Upgrades (Medium-Term)
- `[ ]` **Backend:** Create a `/api/admin/impersonate` endpoint.
- `[ ]` **Frontend:** Add a "Login As Tenant" button for Super Admins.
- `[ ]` **Frontend:** Build the Global Audit Logs view.

### Phase 4: Hardware & POS Authentication (Long-Term)
- `[ ]` **Backend:** Add a `devices` table to the schema. Add a `pos_pin` (hashed) column to the `users` table.
- `[ ]` **Frontend:** Build the "Device Management" page to generate 6-digit iPad pairing codes.
- `[ ]` **Frontend:** Build the rapid PIN-entry lock screen for the POS app.
