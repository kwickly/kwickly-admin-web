# Global UX/UI Standardization, Branding Delegation, & White Labeling Plan

Based on your request to rigorously enforce the rules from `docs/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md` across the entire app, shift Tenant Branding configuration to the Platform Admin, and introduce **Enterprise White Labeling**, here is the comprehensive architectural plan.

## 1. Database Schema Refactoring & White Labeling (API Repo)

Currently, all branding data (logos, theme config JSON, colors) is tightly coupled within the core `tenants` table. Since only the Platform Owner/Staff should modify this, we will separate concerns and introduce advanced white-label features.

### Proposed Schema Change: `tenant_brandings` Table
- **New Table:** Create `tenant_brandings` with a 1-to-1 relationship to `tenants`.
- **Columns to Migrate:** Move `brand_color`, `logo_url`, `logo_dark_url`, `favicon_url`, `theme_mode`, and the massive `theme_config` JSONB column out of `tenants`.
- **New White Label Columns (All Optional / Nullable):**
  - `custom_domain` (e.g., `orders.theirbrand.com`). If null, defaults to `[slug].kwickly.com`.
  - `custom_email_sender` (e.g., `receipts@theirbrand.com`). If null, defaults to standard Kwickly mailers.
  - `hide_kwickly_branding` (boolean, default `false`). Removes "Powered by Kwickly" on customer receipts/portals.
  - `custom_pwa_manifest` (JSONB, optional). Overrides the PWA name and icons when customers install the web app.
  *(Note: Because these are optional, they can be offered as upsells based on market changes, or tenants can request to add their own custom domains later.)*
- **API Middleware:** Ensure the PUT/PATCH endpoints for `tenant_brandings` strictly require a `platform_owner` or platform `staff` role. Tenant users will only have `GET` access to this table to load their UI.

## 2. Shifting the Branding UI & White Label Manager (Admin Web Repo)

- **Delete:** Remove `src/pages/settings/BrandingSettings.tsx` from the Tenant's settings menu. Tenants will no longer see or interact with theme configurations.
- **Create:** Build a new `TenantOnboardingBranding.tsx` interface in the `src/pages/platform/` directory. 
- **Enterprise White Label Features:** Within the new platform UI, add a "White Labeling" toggle. When active, Platform Staff can input the custom domain, configure SendGrid/SMTP settings for custom sender emails, and upload the custom PWA manifest for that specific enterprise client.

## 3. Global Styles & UI Standardization (Admin Web Repo)

To ensure future changes instantly cascade without manually editing hundreds of files, we will refactor every page to strictly rely on our global tokens (defined in `index.css` / `tokens.json`).

### The Refactoring Checklist (Page by Page)
1. **Strip Hardcoded Colors:** Remove any Tailwind colors like `text-gray-500` or `bg-blue-600`. Replace them exclusively with our semantic tokens: `bg-background`, `bg-card`, `text-primary`, `text-muted-foreground`, and `border-border`.
2. **Enforce 8-pt Grid:** Scan all layouts and convert irregular margins/padding (e.g., `p-3`, `m-5`) to standard 8-pt Tailwind intervals (`p-4` [16px], `gap-2` [8px], `mb-6` [24px]).
3. **44px Touch Targets:** Ensure every `button`, `a`, and interactive element has a minimum height/width or padding to achieve a 44x44px clickable area (following Apple HIG standard). 
4. **Data Density:**
   - Review all list views. 
   - Complex data (like `orders`, `staff`) will be converted to strict generic `Table` components with Z-pattern scanning.
   - Discrete entities (like `menu categories`) will be converted to `Card` components.
5. **Progressive Disclosure:** Hide advanced settings behind "Advanced Options" accordions or modals on heavy forms (like adding a new Menu Item).

---

## Phase-Wise Execution Strategy

Due to the massive scope of touching every single page, we should execute in phases to prevent breaking the application:

### Phase 1: Data Architecture, White Labeling, & Platform UI
- Execute the `tenants` table schema split in the API, adding the White Label columns.
- Move the `BrandingSettings.tsx` logic over to the Platform Admin portal, adding the new White Label configuration options.

### Phase 2: Core Layouts & Navigational Components
- Refactor the global `Sidebar`, `Header`, and `Auth` layouts to strictly use the global semantic tokens and 44px touch targets.
- Implement the "Hide Kwickly Branding" logic in public-facing layouts based on the `tenant_brandings` record.

### Phase 3: Tenant Dashboard & Settings Pages
- Refactor the Tenant Dashboard, Branch Profile, and Loyalty Config to follow the 60-30-10 color rule and 8-pt grid.

### Phase 4: Operational Pages (Menu, Orders, Inventory, POS)
- Refactor the heaviest pages. Implement strict data tables for Orders/Inventory, and Cards for POS terminal buttons.
