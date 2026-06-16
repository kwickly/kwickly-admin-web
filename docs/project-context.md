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

### Phase 3: Core Restaurant Management (📅 PLANNED)
- [ ] **Staff & Roles:** UI for adding staff, assigning roles, and viewing pins.
- [ ] **Menu Management:** CRUD interface for Categories, Items, and Modifier Groups.
- [ ] **Combos:** UI for assembling complex Meal Combos.
- [ ] **Subscriptions:** Dashboard for tenants to view and upgrade their SaaS billing plans.

### Phase 4: Advanced Operations (📅 PLANNED)
- [ ] **Live KDS / Orders:** Real-time order tracking interface using WebSockets.
- [ ] **Promotions & CRM:** UI for creating discount codes and viewing customer data.
- [ ] **Analytics:** Charts and revenue graphs for daily operations.
