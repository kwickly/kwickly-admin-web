# Kwickly Admin Web Dashboard - Context & Progress Tracker

This document serves as the primary source of truth for the `kwickly-admin-web` frontend. It contains the architecture context, technical decisions, and tracks the implementation progress for the React Single Page Application (SPA).

---

## 🏗️ Architecture & Tech Stack

The Admin Web Dashboard is designed to be highly responsive, performant, and secure, catering to both **Super Admins** (managing the platform) and **Tenant Admins** (managing individual restaurant operations).

| Layer | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React + Vite** | Blazing fast local development and optimized production builds. |
| **Language** | **TypeScript** | Strict typing to mirror the Kwickly API schemas safely. |
| **Styling** | **Tailwind CSS (v4)** | Rapid UI development with utility-first classes. |
| **UI Components** | **Shadcn UI** | Accessible, copy-paste components built on Radix UI. Provides ultimate control. |
| **Server State** | **TanStack Query** | Handles 90% of data fetching, caching, and mutations seamlessly. |
| **Client State** | **Zustand** | Handles the 10% lightweight UI state (Theme toggles, active user session). |
| **Routing** | **React Router v6** | Industry standard for client-side routing and protected routes. |

### Folder Structure
```text
kwickly-admin-web/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Shadcn primitives (buttons, inputs, dialogs)
│   │   └── shared/      # Custom composite components (data tables, layout headers)
│   ├── features/        # (Upcoming) Feature-sliced modules (auth, menus, staff)
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout wrappers (e.g., AppShell with Sidebar)
│   ├── lib/             # Utilities (API client, Shadcn tailwind merger)
│   ├── pages/           # High-level route components (Dashboard, Login)
│   └── store/           # Zustand stores (useAuth, useTheme)
```

---

## 🎨 Design Direction

- **Theme:** High-contrast **Slate/Zinc** base with **Indigo/Blue** accents.
- **Why:** This conveys a modern, professional, "fintech-grade" POS feel (similar to Stripe/Square) ensuring high legibility for restaurant staff during busy operations.
- **Mode:** Full support for both **Light** and **Dark** modes via the integrated `ThemeProvider`.

---

## 🚀 Implementation Progress

### Phase 1: Foundation & Infrastructure (✅ COMPLETED)
- [x] Initialize Vite React TS project
- [x] Install & configure Tailwind CSS v4
- [x] Configure Shadcn UI and resolve path aliases (`@/`)
- [x] Implement Light/Dark mode `ThemeProvider`
- [x] Setup Zustand auth persistence (`useAuth.ts`)
- [x] Create base layout `AppShell` (Sidebar & Header)
- [x] Setup React Router with protected routes structure
- [x] Scaffold initial UI (Login screen, Dashboard overview)

### Phase 2: Authentication & API Integration (✅ COMPLETED)
- [x] Configure Axios/Fetch interceptors for JWT injection
- [x] Connect `Login.tsx` to Elysia API (`POST /auth/login`)
- [x] Handle JWT storage and automatic token refresh
- [x] Role-Based Access Control (RBAC) route protection (Super Admin vs Tenant Admin)
- [x] Configure Docker containerization for Vite SPA deployments.
- [x] Configure Github actions and `Dockerfile`.

### Phase 3: Core Restaurant Management (✅ COMPLETED)
- [x] **Staff & Roles:** UI for adding staff, assigning roles, and viewing pins.
- [x] **Menu Management:** CRUD interface for Categories, Items, and Modifier Groups.
- [x] **Combos:** UI for assembling complex Meal Combos.
- [x] **Subscriptions:** Dashboard for tenants to view and upgrade their SaaS billing plans.

### Phase 4: Advanced Operations (✅ COMPLETED)
- [x] **Live KDS / Orders:** Real-time order tracking interface using WebSockets.
- [x] **Analytics:** Charts and revenue graphs for daily operations.
- [x] **Promotions & CRM:** UI for creating discount codes

### Phase 5: API Integration (✅ COMPLETED)
- [x] **Staff & Roles API:** Connect Staff Table and Creation Dialog to Elysia Backend.
- [x] **Menus API:** Wire up Menu Items, Categories, and Modifiers to database endpoints.
- [x] **Orders KDS API:** Replace mock Kanban data with live order queries.
- [x] **Analytics API:** Connect dashboard charts to the backend reporting service.

### Phase 6: Global Settings & Real-time WebSockets (✅ COMPLETED)
- [x] Implement global system configuration settings.
- [x] Stabilize WebSocket connection handling for low-latency updates.

### Phase 7: Operational Resilience & Quality (✅ COMPLETED)
- [x] **Global Branch Switching:** Interlinked all dashboard queries to a global Zustand branch state selector.
- [x] **JWT Resiliency:** Added seamless token auto-refresh interception via Axios to replay queued 401 requests.
- [x] **KDS Resiliency:** Implemented exponential backoff and status indicators for WebSocket kitchen display dropouts.

### Phase 8: Dynamic White-Labeling & AI Page Split (✅ COMPLETED)
- [x] **Dynamic Theme Engine:** Mapped styling variables and setup root CSS variables injection hook.
- [x] **Accessibility Contrast Calculator:** Built relative luminance checker adjusting text color between white and zinc to satisfy WCAG AA/AAA guidelines.
- [x] **Live Interactive Mockup Preview:** Implemented Branding customization settings page with reactive mockup preview of buttons, badges, and lists.
- [x] **Predictive Analytics Partition:** Separated Prophet forecasting charts and churn risk tables into a dedicated page (`/analytics`).
- [x] **Action-Oriented Confirmation Dialogs:** Created Adopt Combo forms and WhatsApp promotion dispatch drawers with templates preview.
- [x] **Settings Profile Adaptations:** Shifted branch profile and loyalty settings pages to follow the dynamic theme.
- [x] **Backend settings API:** Added `/v1/tenant/settings` endpoints and integrated with JWT user sessions.

### Phase 9: UI Modernization & Premium Aesthetic Polish (✅ COMPLETED)
- [x] **Settings Layout Re-architecture:** Removed redundant `SettingsLayout.tsx` headers, enabling individual settings pages to anchor to the F-Pattern view top for a cleaner layout.
- [x] **Card Grid Transformation:** Completely overhauled the `PlatformTenants.tsx` directory from a boring table to a premium Card Grid with glassmorphism interactions.
- [x] **3-Dots Interaction Menu:** Integrated lightweight DropdownMenu overlays on Tenant cards for Inspect, Edit, and Delete actions.
- [x] **Type-to-Delete Protection:** Implemented forced-typing confirmation modals for high-risk actions to prevent accidental data loss.
- [x] **Premium Analytics Dashboards:** Replaced basic bar charts with gradient `AreaChart`s and polished `PieChart` visualizations with inner-radius centered labels.
- [x] **Skeleton Loader Refactoring:** Eradicated all basic "Loading..." text from 15+ pages. Developed a centralized `loaders.tsx` library and deployed beautiful, pulsating `Skeleton` grids across the entire admin portal for ultra-premium perceived performance.
