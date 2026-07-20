# KDS Kanban Redesign

**Date:** 2026-07-19  
**Status:** ✅ Completed  
**Repo:** kwickly-admin-web  

---

## Context

The original KDS was a static list of orders with heavy image cards — not practical for kitchen staff. The staff need fast, dense, text-only information and the ability to move tickets between statuses without a mouse-heavy workflow.

---

## Decision

### `Kds.tsx` — Full Redesign

Replaced with a professional Kanban board using `@dnd-kit/core`:

**Columns:** New Orders (amber) → In Kitchen (blue) → Ready (emerald)

**Ticket design:**
- No product images — text-dense, scannable in 1 second
- Header: Order ID · Table badge · Mode icon (dine-in/takeaway)
- Items: pill quantity badge + item name
- Wait-time badge: green < 10 min, amber 10–20 min, red pulsing > 20 min

**Interactions:**
- Drag ticket to target column (forward-only enforced — toast error if moving backwards)
- DragOverlay: rotated ghost card while dragging
- One-tap "Advance Stage" button as alternative to drag

**WebSocket:** Live push from `/kds` endpoint. Reconnects with exponential backoff.

---

## Upcoming (Phase 9)

- KOT round badge ("Rnd 1", "Rnd 2"…) per ticket
- Table name resolved from registered `restaurant_tables` record
