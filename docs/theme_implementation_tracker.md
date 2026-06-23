# Theme Implementation Tracker & UI Audit

This document serves as a comprehensive tracker for ensuring a "classic, professional, trendy" UI/UX across the entire Kwickly platform. It tracks the status of all UI components, standardizes the icon strategy, and provides a clear progress tracker for the theme implementation.

## 1. UI Components Audit

We currently have **26 Core UI Components** powered by Tailwind/Radix. Each must be audited to ensure it correctly binds to the advanced OKLCH theme variables (`--primary`, `--card`, `--muted`, `--ring`, etc.) and adheres to a professional aesthetic.

| Component | Theme Variables Mapped | Professional Polish | Status |
| :--- | :--- | :--- | :--- |
| `badge.tsx` | ✔️ Uses `--primary`, `--destructive`, `--secondary` | Needs hover states check | [ ] Pending Audit |
| `breadcrumbs.tsx` | ✔️ Uses text-slate/zinc fallbacks | Update to use `--muted-foreground` | [x] Audited |
| `button.tsx` | ✔️ Fully mapped | Check active/focus rings | [ ] Pending Audit |
| `card.tsx` | ✔️ Mapped to `--card` | Ensure borders are subtle | [ ] Pending Audit |
| `collapsible.tsx` | ➖ Generic | Add smooth transitions | [ ] Pending Audit |
| `command.tsx` | ➖ Uses generic grays | Map to `--popover` and `--muted` | [ ] Pending Audit |
| `dialog.tsx` | ✔️ Mapped to `--background` | Check overlay blur effect | [ ] Pending Audit |
| `dropdown-menu.tsx` | ➖ Uses generic grays | Map to `--popover` | [ ] Pending Audit |
| `input-group.tsx` | ✔️ Mapped to `--input` | Check focus-within ring | [ ] Pending Audit |
| `input.tsx` | ✔️ Mapped to `--input` | Ensure `--ring` applies | [ ] Pending Audit |
| `label.tsx` | ✔️ Generic | None | [ ] Pending Audit |
| `loaders.tsx` | ➖ Uses generic skeleton | Map to `--muted` | [x] Audited |
| `pagination-controls.tsx` | ➖ Mixed | Standardize with Button | [x] Audited |
| `search-input.tsx` | ➖ Mixed | Standardize with Input | [x] Audited |
| `select.tsx` | ✔️ Mapped to `--popover` | Check border colors | [ ] Pending Audit |
| `separator.tsx` | ✔️ Mapped to `--border` | None | [ ] Pending Audit |
| `sheet.tsx` | ✔️ Mapped to `--background` | Check overlay blur effect | [ ] Pending Audit |
| `sidebar.tsx` | ✔️ Uses `--sidebar-*` | Verify active state colors | [ ] Pending Audit |
| `skeleton.tsx` | ✔️ Mapped to `--muted` | None | [ ] Pending Audit |
| `slider.tsx` | ✔️ Uses `--primary` | Check thumb shadow | [ ] Pending Audit |
| `sonner.tsx` | ➖ Generic | Map to theme variables | [ ] Pending Audit |
| `switch.tsx` | ✔️ Uses `--primary` | None | [ ] Pending Audit |
| `table.tsx` | ➖ Uses generic grays | Map row hover to `--muted` | [ ] Pending Audit |
| `tabs.tsx` | ✔️ Uses `--muted` | Check active tab shadow | [ ] Pending Audit |
| `textarea.tsx` | ✔️ Mapped to `--input` | Ensure `--ring` applies | [ ] Pending Audit |
| `tooltip.tsx` | ✔️ Mapped to `--popover` | None | [ ] Pending Audit |

## 2. Icon Standardization Strategy

For a professional, cohesive application, we will use **Lucide React** icons exclusively. 
Icons should have consistent sizing and stroke widths:
- **Navigation/Sidebar:** `size={20}` or `className="h-5 w-5"`, `strokeWidth={2}`
- **Buttons/Actions:** `size={16}` or `className="h-4 w-4 mr-2"`, `strokeWidth={2}`
- **Empty States/Hero:** `size={48}` or `className="h-12 w-12 text-muted-foreground"`, `strokeWidth={1.5}`

### Required Icon Vocabulary
- **Dashboards:** `LayoutDashboard`, `Activity`, `TrendingUp`
- **Users/Staff:** `Users`, `UserCog`, `BadgeCheck`
- **Settings:** `Settings`, `Palette`, `Shield`
- **Actions:** `Plus`, `Edit`, `Trash2`, `Search`, `Filter`
- **Status:** `CheckCircle2` (Success), `AlertCircle` (Error), `Info` (Info)

## 3. Implementation Progress Tracker

### Phase 1: Core Theme Engine Validation
- `[x]` Verify OKLCH generator math in `ThemeGenerator.ts`
- `[ ]` Audit `index.css` to ensure no conflicting base styles

### Phase 2: Component-Level Audit
- `[ ]` Audit Inputs, Buttons, Select, and Form controls (ensure `--ring` and `--primary` apply flawlessly)
- `[ ]` Audit Cards, Dialogs, Popovers, and Dropdowns (ensure `--card` and `--popover` are used with subtle `--border`)
- `[x]` Audit Tables and Lists (ensure `--muted` is used for hovers)
- `[x]` Audit Charts (ensure `--chart-1` to `--chart-5` are bound)

### Phase 3: Page-Level Audit

**Root Pages**
- `[x]` Audit `Ads.tsx`
- `[x]` Audit `Combos.tsx`
- `[x]` Audit `Dashboard.tsx`
- `[x]` Audit `ForgotPassword.tsx` & `ResetPassword.tsx` & `Login.tsx`
- `[x]` Audit `Orders.tsx`
- `[x]` Audit `PlatformAuditLogs.tsx`
- `[x]` Audit `PlatformDashboard.tsx`
- `[x]` Audit `PlatformTenants.tsx`
- `[x]` Audit `Subscriptions.tsx`
- `[x]` Audit `SupportTickets.tsx`
- `[x]` Audit `TenantAnalytics.tsx`
- `[x]` Audit `TenantDashboard.tsx`

**CRM**
- `[x]` Audit `crm/CampaignLogs.tsx`
- `[x]` Audit `crm/CustomerDirectory.tsx`
- `[x]` Audit `crm/CustomerSegments.tsx`
- `[x]` Audit `crm/WalletTransactions.tsx`

**Inventory**
- `[x]` Audit `inventory/Stock.tsx`
- `[x]` Audit `inventory/Suppliers.tsx`

**Menus**
- `[x]` Audit `menus/MenuCategories.tsx`
- `[x]` Audit `menus/MenuItems.tsx`
- `[x]` Audit `menus/MenuModifiers.tsx`

**Platform**
- `[x]` Audit `platform/GlobalBilling.tsx`
- `[x]` Audit `platform/PlatformRoles.tsx`
- `[x]` Audit `platform/PlatformSettings.tsx`
- `[x]` Audit `platform/PlatformStaff.tsx`
- `[x]` Audit `platform/PlatformTimesheets.tsx`
- `[x]` Audit `platform/SupportTickets.tsx`
- `[x]` Audit `platform/TenantSettings.tsx`
- `[x]` Audit `platform/TenantUsage.tsx`

**Promotions**
- `[x]` Audit `promotions/Discounts.tsx`

**Settings**
- `[x]` Audit `settings/BranchProfile.tsx`
- `[x]` Audit `settings/BrandingSettings.tsx` (Live Preview)
- `[x]` Audit `settings/LoyaltyConfig.tsx`
- `[x]` Audit `settings/UserProfile.tsx`

**Staff**
- `[x]` Audit `staff/PayrollRunDetails.tsx`
- `[x]` Audit `staff/PublicHolidays.tsx`
- `[x]` Audit `staff/StaffDirectory.tsx`
- `[x]` Audit `staff/StaffLeaves.tsx`
- `[x]` Audit `staff/StaffPayroll.tsx`
- `[x]` Audit `staff/StaffRoles.tsx`
- `[x]` Audit `staff/StaffTimesheets.tsx`
