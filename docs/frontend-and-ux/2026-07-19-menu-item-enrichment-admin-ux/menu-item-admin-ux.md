# Menu Item Management — Admin UX Design
**Date:** 2026-07-19  
**Repo:** `kwickly-admin-web`  
**Domain:** Frontend & UX  
**Status:** Planned (next sprint)

---

## Context

The menu item form in the admin panel needs to expose the new enrichment fields added to the `menu_items` schema (tags, nutrition, enhanced availability). This document defines the UX grouping and form structure.

See schema ADR: `kwickly-api/docs/database-and-schema/2026-07-19-menu-item-enrichment/menu-item-enrichment.md`

---

## Form Layout — Menu Item Editor

The item editor is organised into collapsible sections to avoid overwhelming restaurant operators.

### Section 1: Basics (always expanded)
- Name *(required)*
- Description
- Price *(required)*
- Category *(required)*
- Image upload / URL
- Status: `AVAILABLE | OUT_OF_STOCK | HIDDEN`

### Section 2: Dietary & Tags
- `isVeg` toggle (default: ON for veg restaurants)
- `isJain`, `isGlutenFree` checkboxes
- Spice Level: 0–3 slider (None / Mild / Medium / Hot)
- **Badge Flags** (checkbox group):
  - ★ Mark as Bestseller
  - 👨‍🍳 Chef's Special
  - 🏠 House Special
  - 🆕 New Item
  - 🔥 Popular
  - ⏰ Limited Edition
  - 💚 Healthy Choice

> **UX rule:** Show a warning if more than 3 badges are selected simultaneously — too many badges devalue all of them.

### Section 3: Availability
- Availability Mode: `Always | Time Window | Specific Days`
- **If Time Window:** From time — Until time picker
- **If Specific Days:** Day-of-week multi-select (Mon/Tue/Wed/Thu/Fri/Sat/Sun)
- Available Until Date *(optional, for seasonal items)*
  - When set, displays: "This item will be hidden after [date]"

### Section 4: Nutrition & Ingredients *(collapsible, optional)*
- Calories (kcal) — numeric input
- Serving size — text input (`"1 plate (350g)"`)
- Ingredients — tag input (comma-separated, stored as array)
- Allergens — multi-select chips:
  `Dairy | Gluten | Nuts | Soy | Sesame | Eggs | Fish | Shellfish`
- Macros (optional):
  - Protein (g)
  - Carbs (g)
  - Fat (g)

---

## Admin Badge Priority Warning

If `isBestseller` + `isChefSpecial` + `isRestaurantSpecial` + `isNew` + `isPopular` are all true simultaneously, show inline warning:

```
⚠️ Too many badges selected. The storefront shows max 2 per item. 
   Consider which 1–2 best represent this dish.
```

---

## Future: Auto-Computed Tags

In a future sprint, `isBestseller` and `isPopular` will be auto-computed nightly from `order_items` aggregates:
- **Bestseller:** Top 20% most-ordered items in the last 30 days, per tenant
- **Popular:** Items with order velocity increasing >15% week-over-week

The admin will see a read-only "Auto-detected" pill next to the flag, with the option to override manually.
