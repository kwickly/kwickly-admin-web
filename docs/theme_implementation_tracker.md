# Theme Implementation Tracker & UI Audit

This document serves as a comprehensive tracker for ensuring a "classic, professional, trendy" UI/UX across the entire Kwickly platform. It tracks the status of all UI components, standardizes the icon strategy, and provides a clear progress tracker for the theme implementation.

---

## Audit Legend
- `[✅]` — Fully compliant, no violations
- `[🔴]` — Critical violation — hardcoded colors bypass the global token system
- `[🟡]` — Moderate violation — raw Tailwind palette (emerald/amber/rose) used for semantic states
- `[🟢]` — Minor violation — minor inconsistency, low impact
- `[🔧]` — Fix in progress / completed this session
- `[ ]` — Not yet audited

---

## 1. UI Components Audit

All **26 Core UI Components** powered by Tailwind/Base-UI have been fully audited.
**Result: ALL 26 components are fully theme-compliant.** ✅

| Component | Theme Variables Used | Compliance |
| :--- | :--- | :--- |
| `badge.tsx` | `--primary`, `--secondary`, `--destructive`, `--border`, `--muted` | ✅ Compliant |
| `breadcrumbs.tsx` | `--muted-foreground` | ✅ Compliant |
| `button.tsx` | `--primary`, `--secondary`, `--muted`, `--ring`, `--destructive` | ✅ Compliant |
| `card.tsx` | `--card`, `--card-foreground`, `--muted` | ✅ Compliant |
| `collapsible.tsx` | No direct color classes | ✅ Compliant |
| `command.tsx` | `--popover`, `--accent`, `--muted` | ✅ Compliant |
| `dialog.tsx` | `--popover`, `--muted`, `--ring`, `--background` | ✅ Compliant |
| `dropdown-menu.tsx` | `--popover`, `--accent`, `--border`, `--destructive` | ✅ Compliant |
| `input-group.tsx` | `--input`, `--ring` | ✅ Compliant |
| `input.tsx` | `--input`, `--ring`, `--border`, `--destructive` | ✅ Compliant |
| `label.tsx` | Minimal, no color concerns | ✅ Compliant |
| `loaders.tsx` | `--muted`, `--primary` | ✅ Compliant |
| `pagination-controls.tsx` | Delegates to Button | ✅ Compliant |
| `search-input.tsx` | Delegates to Input | ✅ Compliant |
| `select.tsx` | `--input`, `--popover`, `--accent`, `--border`, `--ring` | ✅ Compliant |
| `separator.tsx` | `--border` | ✅ Compliant |
| `sheet.tsx` | `--background`, `--muted` | ✅ Compliant |
| `sidebar.tsx` | All `--sidebar-*` tokens | ✅ Compliant |
| `skeleton.tsx` | `--muted` | ✅ Compliant |
| `slider.tsx` | `--primary` | ✅ Compliant |
| `sonner.tsx` | `--popover`, `--border`, `--radius` | ✅ Compliant |
| `switch.tsx` | `--primary` | ✅ Compliant |
| `table.tsx` | `--muted`, `--border`, `--foreground` | ✅ Compliant |
| `tabs.tsx` | `--muted`, `--background`, `--foreground`, `--ring` | ✅ Compliant |
| `textarea.tsx` | `--input`, `--ring` | ✅ Compliant |
| `tooltip.tsx` | `--popover` | ✅ Compliant |

---

## 2. Icon Standardization Strategy

Using **Lucide React** icons exclusively. Consistent sizing and stroke widths:
- **Navigation/Sidebar:** `size={20}` or `className="h-5 w-5"`, `strokeWidth={2}`
- **Buttons/Actions:** `size={16}` or `className="h-4 w-4 mr-2"`, `strokeWidth={2}`
- **Empty States/Hero:** `size={48}` or `className="h-12 w-12 text-muted-foreground"`, `strokeWidth={1.5}`

---

## 3. Violations Found — Layouts & Pages

> **Summary:** All component-level violations are CLEAR. The problems are entirely in layouts, pages, and feature components that use raw Tailwind palette classes instead of CSS custom properties.

### 🔴 CRITICAL — `src/layouts/AppShell.tsx`
The outermost shell wrapper used on every authenticated page.

| Violation | Line | Fixed? |
| :--- | :--- | :--- |
| `bg-slate-50 dark:bg-zinc-950` main wrapper | L104 | 🔧 Fixed |
| `bg-white/80 dark:bg-zinc-900/80` header | L124 | 🔧 Fixed |
| `text-slate-500` sidebar trigger | L126 | 🔧 Fixed |
| `text-slate-400` branch label | L132 | 🔧 Fixed |
| `bg-slate-50 dark:bg-zinc-800` select trigger | L139 | 🔧 Fixed |
| `focus:ring-indigo-500` select trigger | L139 | 🔧 Fixed |
| `border-slate-200 dark:border-zinc-800 bg-slate-50` search bar | L168 | 🔧 Fixed |
| `focus:ring-indigo-500/20 focus:border-indigo-500/50` search bar | L168 | 🔧 Fixed |
| `text-slate-400 text-indigo-500` search icon | L170 | 🔧 Fixed |
| `border-slate-200 bg-white dark:bg-zinc-900` kbd badge | L172 | 🔧 Fixed |
| `text-slate-500 hover:text-indigo-600` theme toggle | L183 | 🔧 Fixed |
| `text-slate-500` action buttons (bell, help) | L188, L191 | 🔧 Fixed |
| `hover:bg-slate-100 dark:hover:bg-zinc-800` user menu | L200 | 🔧 Fixed |
| `bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600` avatar | L201 | 🔧 Fixed |
| `text-slate-900 dark:text-white` user name | L209 | 🔧 Fixed |
| `text-slate-500 dark:text-zinc-500` user role | L210 | 🔧 Fixed |
| `text-slate-500 border-slate-100 dark:border-zinc-800` dropdown header | L217 | 🔧 Fixed |
| `bg-amber-500 text-slate-950` inspection banner | L108 | 🔧 Fixed |
| `bg-slate-950 hover:bg-slate-800` exit button | L118 | 🔧 Fixed |

### 🔴 CRITICAL — `src/components/AppSidebar.tsx`
Primary navigation sidebar.

| Violation | Lines | Fixed? |
| :--- | :--- | :--- |
| `bg-indigo-600 shadow-indigo-600/20` logo badge | L266 | 🔧 Fixed |
| `text-slate-900 dark:text-white` brand name | L270 | 🔧 Fixed |
| `text-slate-500` "Admin Portal" label | L271 | 🔧 Fixed |
| `text-slate-400 dark:text-zinc-500` group labels | L279 | 🔧 Fixed |
| `bg-slate-100 dark:bg-zinc-800` active nav item | L301, L336, L380 | 🔧 Fixed |
| `text-slate-500 hover:bg-slate-50` inactive nav item | L302, L337, L381 | 🔧 Fixed |
| `text-indigo-600 dark:text-indigo-400` active icon | L305, L340, L354, L385 | 🔧 Fixed |
| `text-slate-400 dark:text-zinc-500` inactive icon | L305, L340, L385 | 🔧 Fixed |
| `text-slate-400` chevron icon | L307, L342 | 🔧 Fixed |
| `text-slate-500 dark:text-zinc-400` sub-item label | L311 | 🔧 Fixed |
| `border-slate-200 dark:border-zinc-800` sub-menu indent | L346 | 🔧 Fixed |
| `bg-indigo-50 dark:bg-indigo-500/10` active sub-item | L354 | 🔧 Fixed |
| `hover:bg-slate-100 dark:hover:bg-zinc-800/50` inactive sub-item | L355 | 🔧 Fixed |

### 🟡 MODERATE — `src/pages/PlatformDashboard.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `text-emerald-500 bg-emerald-500/5 bg-emerald-500/10` (Platform Users card) | 🔧 Fixed |
| `bg-amber-500/5 bg-amber-500/10 text-amber-500` (Total Orders card) | 🔧 Fixed |
| `bg-rose-500/5 bg-rose-500/10 text-rose-500` (Platform GMV card) | 🔧 Fixed |
| `text-emerald-500` active tenants badge | 🔧 Fixed |
| `text-emerald-500` Plan Distribution icon | 🔧 Fixed |

### 🟡 MODERATE — `src/pages/Orders.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `text-blue-500 bg-blue-500/10` (New Orders column) | 🔧 Fixed |
| `text-amber-500 bg-amber-500/10` (Preparing column) | 🔧 Fixed |
| `text-emerald-500 bg-emerald-500/10` (Ready column) | 🔧 Fixed |
| WS status badge `bg-emerald-500/10 text-emerald-600` | 🔧 Fixed |
| WS status badge `bg-amber-500/10 text-amber-600` | 🔧 Fixed |

### 🟡 MODERATE — `src/pages/staff/StaffLeaves.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `bg-blue-500/10 text-blue-600` (VACATION badge) | 🔧 Fixed |
| `bg-orange-500/10 text-orange-600` (SICK badge) | 🔧 Fixed |
| `bg-emerald-500/10 text-emerald-600` (APPROVED badge) | 🔧 Fixed |
| `bg-rose-500/10 text-rose-600` (REJECTED badge) | 🔧 Fixed |
| `bg-amber-500/10 text-amber-600` (PENDING badge) | 🔧 Fixed |
| `text-emerald-600 hover:bg-emerald-500/10` approve action | 🔧 Fixed |
| `text-rose-600 hover:bg-rose-500/10` reject action | 🔧 Fixed |

### 🟡 MODERATE — `src/pages/staff/PayrollRunDetails.tsx`

| Violation | Fixed? |
| :--- | :--- |
| All `text-emerald-600 bg-emerald-500/*` (earnings side) | 🔧 Fixed |
| All `text-rose-600 bg-rose-500/*` (deductions side) | 🔧 Fixed |
| `bg-emerald-600 hover:bg-emerald-700 text-white` (Mark Paid btn) | 🔧 Fixed |

### 🟡 MODERATE — `src/pages/staff/StaffPayroll.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `border-emerald-500/20 text-emerald-600 bg-emerald-500/10` (PAID badge) | 🔧 Fixed |

### 🟡 MODERATE — `src/features/staff/components/Timesheets.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `text-slate-500` (search icon, empty states) | 🔧 Fixed |
| `bg-white dark:bg-zinc-900/50` (input, select bg) | 🔧 Fixed |
| `bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800` (empty container) | 🔧 Fixed |
| `bg-slate-50 dark:bg-zinc-900/50` (table header) | 🔧 Fixed |
| `border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950` (table wrapper) | 🔧 Fixed |
| `text-amber-500` (Still Clocked In) | 🔧 Fixed |
| `border-emerald-500 text-emerald-600 bg-emerald-50/50` (clocked in row) | 🔧 Fixed |
| `bg-emerald-600 hover:bg-emerald-700 text-white` (Clock Out button) | 🔧 Fixed |
| `bg-emerald-600 hover:bg-emerald-700 text-white` (APPROVED action btn) | 🔧 Fixed |

### 🟢 MINOR — `src/pages/ForgotPassword.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `bg-emerald-500/10 text-emerald-600` success message | 🔧 Fixed |

### 🟢 MINOR — `src/pages/ResetPassword.tsx`

| Violation | Fixed? |
| :--- | :--- |
| `bg-emerald-500/10 text-emerald-600` success message | 🔧 Fixed |

---

## 4. New Semantic Tokens Added to `index.css`

To systematically replace all hardcoded status colors, the following tokens were added:

```css
--success:          oklch(0.65 0.15 160);   /* green — approved, ready, paid */
--success-foreground: oklch(1.0 0 0);
--success-subtle:   oklch(0.96 0.04 160);

--warning:          oklch(0.78 0.17 75);    /* amber — pending, in-progress */
--warning-foreground: oklch(0.2 0 0);
--warning-subtle:   oklch(0.97 0.04 75);

--info:             oklch(0.65 0.15 240);   /* blue — informational */
--info-foreground:  oklch(1.0 0 0);
--info-subtle:      oklch(0.95 0.04 240);
```

Dark mode equivalents also added with appropriately adjusted lightness values.

---

## 5. Implementation Progress Tracker

### Phase 1: Core Theme Engine Validation
- `[✅]` Verify OKLCH generator math in `ThemeGenerator.ts`
- `[✅]` Audit `index.css` — extended with semantic `--success`, `--warning`, `--info` tokens

### Phase 2: Component-Level Audit
- `[✅]` All 26 UI components are fully compliant — no violations found
- `[✅]` Charts use `--chart-1` through `--chart-5` correctly

### Phase 3: Layout-Level Fixes (This Session)
- `[✅]` Fix `AppShell.tsx` — all slate/zinc/indigo → theme tokens
- `[✅]` Fix `AppSidebar.tsx` — all slate/zinc/indigo → sidebar tokens + primary

### Phase 4: Page-Level Fixes (This Session)
- `[✅]` Fix `PlatformDashboard.tsx` — KPI card colors
- `[✅]` Fix `Orders.tsx` — KDS column status colors
- `[✅]` Fix `staff/StaffLeaves.tsx` — status badge colors
- `[✅]` Fix `staff/PayrollRunDetails.tsx` — earnings/deductions colors
- `[✅]` Fix `staff/StaffPayroll.tsx` — PAID badge color
- `[✅]` Fix `features/staff/components/Timesheets.tsx` — tables, inputs, status colors
- `[✅]` Fix `ForgotPassword.tsx` — success message color
- `[✅]` Fix `ResetPassword.tsx` — success message color

### Phase 5: Remaining Pages (Previously Audited — No Violations Found)
- `[✅]` `Ads.tsx` — compliant
- `[✅]` `Combos.tsx` — compliant
- `[✅]` `Dashboard.tsx` — compliant
- `[✅]` `PlatformAuditLogs.tsx` — compliant
- `[✅]` `PlatformTenants.tsx` — 4 violations found & fixed: active status dot (`bg-emerald-500`→`bg-success`), active label (`text-emerald-600`→`text-success`), view modal ACTIVE badge, Users icon (`text-emerald-500`→`text-[var(--chart-2)]`)
- `[✅]` `Subscriptions.tsx` — compliant
- `[✅]` `SupportTickets.tsx` — compliant
- `[✅]` `TenantAnalytics.tsx` — compliant
- `[✅]` `TenantDashboard.tsx` — uses chart vars + theme tokens ✅
- `[✅]` `crm/CampaignLogs.tsx` — compliant
- `[✅]` `crm/CustomerDirectory.tsx` — compliant
- `[✅]` `crm/CustomerSegments.tsx` — compliant
- `[✅]` `crm/WalletTransactions.tsx` — compliant
- `[✅]` `inventory/Stock.tsx` — compliant
- `[✅]` `inventory/Suppliers.tsx` — compliant
- `[✅]` `menus/MenuCategories.tsx` — compliant
- `[✅]` `menus/MenuItems.tsx` — compliant
- `[✅]` `menus/MenuModifiers.tsx` — compliant
- `[✅]` `platform/GlobalBilling.tsx` — compliant
- `[✅]` `platform/PlatformRoles.tsx` — compliant
- `[✅]` `platform/PlatformSettings.tsx` — compliant
- `[✅]` `platform/PlatformStaff.tsx` — compliant
- `[✅]` `platform/PlatformTimesheets.tsx` — compliant
- `[✅]` `platform/SupportTickets.tsx` — compliant
- `[✅]` `platform/TenantSettings.tsx` — compliant
- `[✅]` `platform/TenantUsage.tsx` — compliant
- `[✅]` `promotions/Discounts.tsx` — compliant
- `[✅]` `settings/BranchProfile.tsx` — compliant
- `[✅]` `settings/BrandingSettings.tsx` — compliant
- `[✅]` `settings/LoyaltyConfig.tsx` — compliant
- `[✅]` `settings/UserProfile.tsx` — compliant
- `[✅]` `staff/PublicHolidays.tsx` — compliant
- `[✅]` `staff/StaffDirectory.tsx` — compliant
- `[✅]` `staff/StaffRoles.tsx` — compliant
- `[✅]` `staff/StaffTimesheets.tsx` — compliant
