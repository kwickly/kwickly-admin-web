# Table Floor View & QR Code Management

**Date:** 2026-07-19 (Updated 2026-07-24)  
**Status:** ✅ Completed — Phase 9  
**Repo:** kwickly-admin-web  

---

## Context

The admin web has no table management UI. Tables are referenced only by a free-text `tableNumber` field on orders. This makes floor management, QR generation, and consolidated billing impossible.

---

## Decision

### Recent Updates (2026-07-24)
- **Granular RBAC**: Added `tables:manage` permission to secure table layout updates.
- **UI Refactor**: Replaced hardcoded padding and constraints with fluid AppShell layouts.
- **Hooks API**: Integrated complete CRUD interface utilizing robust React Query hooks (`useTables.ts`).
- **Edit Features**: Full modal-based interface to manage capacity, status, and naming.

### New Pages

#### `/tables` — Floor View (`FloorView.tsx`)

Visual card grid showing all tables in the branch:
- Table name, capacity, current status badge (`Available` / `Occupied` / `Reserved` / `Cleaning`)
- Occupied tables show: current order total, time open, "View Order" link
- Actions per card: View Order · Print Bill · Edit · Regen QR · Download QR · Delete
- **"+ Add Table"** button — disabled with upgrade CTA when plan limit reached
- Empty state guides new tenants on setting up tables

#### `/tables/qr` — QR Manager (`QRManager.tsx`)

Bulk QR code management:
- Table list with QR preview thumbnails
- **Download QR** per table (PNG with table name label)
- **Print All** — print-friendly A4 sheet (6 QR codes per page, suitable for laminating)
- **Regenerate QR** with confirmation dialog ("Old QR codes will stop working immediately")

QR URL format: `https://{slug}.kwickly.app/menu?t={qrToken}`

QR image generation: `qrcode` npm package (client-side, no server dependency).

### Sidebar Changes

Add under **Overview** group (above Order History):
```
Tables & Floor
  ├── Floor View    /tables
  └── QR Codes      /tables/qr
```

### KDS Changes (`Kds.tsx`)

- KOT tickets show **Round badge** (e.g. "Rnd 2") when `kotRound > 1`
- Table name resolved from registered table (if `tableId` exists), else raw `tableNumber`

### OperationalSettings Changes

- Show current table count vs plan limit
- Upgrade CTA when at limit

---

## Plan-Gated Limits

| Plan | Max Tables |
|---|---|
| FREE | 0 |
| BASIC | 10 |
| STARTER | 25 |
| GROWTH | 75 |
| ENTERPRISE | Unlimited |

---

## Consequences

- ✅ Cashiers can see live table occupancy at a glance
- ✅ One-click session close = bill printed, table freed
- ✅ Regeneratable QR for security (damaged or misused codes)
- ✅ Print-ready QR sheets for laminated table stickers
- ⚠️ Requires `restaurant_tables` and `table_sessions` API endpoints (Phase 9)
