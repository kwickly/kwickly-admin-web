# Kwickly Admin Web — Progress Tracker

**Last Updated:** 2026-07-19  
**Mirror of:** kwickly-api `docs/progress-and-planning/2026-07-19-master-progress-tracker/progress-tracker.md`  

> Canonical progress lives in the API repo. This is a mirror for agent context.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Completed & deployed |
| 🟡 | In progress / partial |
| 🔴 | Planned — not started |

---

## Completed Phases

| Phase | Name | Key Deliverables |
|---|---|---|
| 0 | Foundation | Multi-repo, Neon DB, RBAC, Audit logs |
| 1 | Menu System | Items, categories, modifiers, live POS sync |
| 2 | Inventory | Stock levels, suppliers, recipe mapping |
| 3 | Staff & Payroll | PIN clock-in, timesheets, payroll generation |
| 4 | CRM & Wallet | Customer directory, loyalty, subscriptions |
| 5 | Subdomain Storefront | Wildcard routing, host-based tenant resolution |
| 6 | **KDS Kanban Redesign** | @dnd-kit drag-drop, text-dense tickets, urgency badges |
| 7 | **ETA & Prep Time** | `defaultPreparationTime`, SSE countdown on client |
| 8 | **Theme & Font System** | Plus Jakarta Sans / Inter, semantic Tailwind tokens |

---

## Phase 9 — Table Management & QR Codes 🔴

### Admin Web Tasks

- [ ] `FloorView.tsx` — visual table grid with live status
- [ ] `QRManager.tsx` — per-table QR download, bulk print sheet, regenerate
- [ ] Register routes: `/tables`, `/tables/qr`
- [ ] Add sidebar nav: Tables & Floor
- [ ] Update `Kds.tsx`: KOT round badge, table name from registry, and "To-Go" item badges
- [ ] Update `OperationalSettings.tsx`: table count vs plan limit, and `allowTakeawayOnDineIn` toggle

---

## Known Bugs / Tech Debt (This Repo)

| # | Severity | Description |
|---|---|---|
| 1 | 🟡 Medium | `CreateMenuItemSheet.tsx` Resolver type mismatch (pre-existing) |
| 2 | 🟡 Medium | `PlatformTenants.tsx` plan enum missing BASIC/CUSTOM |
