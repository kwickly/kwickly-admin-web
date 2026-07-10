# Kwickly Admin Web — Theme System

> **Written from a Principal UI/UX Engineering perspective.**
> This document is the single source of truth for how color, typography, and visual identity works across the entire Kwickly admin platform.

---

## Table of Contents

1. [Why This Matters for a Restaurant POS](#1-why-this-matters-for-a-restaurant-pos)
2. [The Design Token Hierarchy](#2-the-design-token-hierarchy)
3. [The 60-30-10 Rule](#3-the-60-30-10-rule)
4. [Token Reference: What Every Variable Means](#4-token-reference-what-every-variable-means)
5. [Multi-Tenant Dynamic Theming](#5-multi-tenant-dynamic-theming)
6. [The Two Portal Contexts](#6-the-two-portal-contexts)
7. [Semantic Status Colors](#7-semantic-status-colors)
8. [The Golden Rules for Developers](#8-the-golden-rules-for-developers)
9. [Common Mistakes and How to Fix Them](#9-common-mistakes-and-how-to-fix-them)
10. [Audit Checklist](#10-audit-checklist)
11. [Migration Path: v1 → v2 Brand Tokens](#11-migration-path-v1--v2-brand-tokens)
12. [Accessibility Contract](#12-accessibility-contract)
13. [Component Token Contracts](#13-component-token-contracts)
14. [Theming Failure States & Fallbacks](#14-theming-failure-states--fallbacks)
15. [Governance & Ownership](#15-governance--ownership)
16. [Enforcement & Tooling](#16-enforcement--tooling)
17. [Figma Token Sync (Known Gap)](#17-figma-token-sync-known-gap)

---

## 1. Why This Matters for a Restaurant POS

A restaurant POS is an **operational interface**, not a marketing page. Its design decisions have real-world consequences:

| Environment | Challenge | Design Response |
|:---|:---|:---|
| Dimly lit dining room | Screen glare, eye strain | Rich dark mode, high contrast |
| Brightly lit kitchen (KDS) | Viewed from 6–10 feet away | Large touch targets, bold status colors |
| Busy service hours | Decisions made in seconds | Clear visual hierarchy, no ambiguous colors |
| Multiple restaurant brands | Each has its own identity | Dynamic white-label theming per tenant |
| Long staff shifts (8–12 hrs) | Eye fatigue | Muted backgrounds, not overly saturated |

**The goal:** The interface should feel like it belongs to the restaurant brand, without the brand colors overwhelming the operational clarity of the UI.

---

## 2. The Design Token Hierarchy

The industry-standard approach uses **3 tiers of design tokens**. Kwickly follows this pattern.

```
Tier 1: Primitives (Raw values)
  └── oklch(0.6626 0.1296 240) — a specific blue

Tier 2: Alias Tokens (Semantic meaning)
  └── --primary = oklch(0.6626 0.1296 240)
  └── --success = oklch(0.65 0.15 160)
  └── --destructive = oklch(0.5987 0.1978 21.7756)

Tier 3: Component Usage (Tailwind utility)
  └── bg-primary, text-primary, border-primary
  └── bg-success, text-success
  └── bg-destructive, text-destructive
```

**Why this matters:** When a merchant changes their brand color in Branding Settings, we only update `--primary` at the root level. Every button, badge, active state, and interactive element across the entire app instantly reflects the new color — without touching a single component's markup.

---

## 3. The 60-30-10 Rule

This is the fundamental composition rule for how brand color is distributed on screen.

```
60% — Dominant background (bg-background, bg-card, bg-sidebar)
       Neutral. Low saturation. This is the canvas.

30% — Structure and typography (text-foreground, border-border, bg-muted)
       Provides hierarchy and readability.

10% — Brand accent (bg-primary, text-primary, border-primary)
       Buttons, active nav items, focus rings, key actions.
       This is where the merchant's color lives.
```

### What this looks like in practice

**Correct** — A page where 90% is neutral, 10% is brand:
- White/dark card backgrounds (`bg-card`)
- Gray text and borders (`text-foreground`, `border-border`)
- Primary-colored "Save" button and active sidebar item only

**Wrong** — A page where brand color dominates:
- Card headers filled with `bg-primary` color
- Icons, tags, and decorators all in `text-primary`
- Multiple gradient overlays in the brand hue

The role builder page in the screenshot above was violating this rule by inheriting a blue brand background (`bg-blue-50`) across the entire page canvas.

---

## 4. Token Reference: What Every Variable Means

All tokens are defined in [`src/index.css`](../src/index.css) and aliased via `@theme inline` to Tailwind.

### Core Tokens

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--background` | `bg-background` | Page canvas, main layout wrapper |
| `--foreground` | `text-foreground` | All body text |
| `--card` | `bg-card` | Card surfaces, panels, modals |
| `--card-foreground` | `text-card-foreground` | Text inside cards |
| `--popover` | `bg-popover` | Dropdowns, tooltips, dialogs |
| `--muted` | `bg-muted` | Subtle backgrounds, table headers, tags |
| `--muted-foreground` | `text-muted-foreground` | Captions, hints, secondary labels |
| `--border` | `border-border` | All dividers and card outlines |
| `--input` | (input bg) | Input field backgrounds |
| `--ring` | `ring-ring` | Focus rings on interactive elements |

### Brand / Interactive Tokens (Dynamic)

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--primary` | `bg-primary` | Primary CTA buttons, active nav, switches |
| `--primary` | `text-primary` | Links, active labels, icon highlights |
| `--primary` | `border-primary` | Highlighted card borders |
| `--primary-foreground` | `text-primary-foreground` | Text on top of `bg-primary` surfaces |
| `--accent` | `bg-accent` | Hover states on secondary surfaces |
| `--accent-foreground` | `text-accent-foreground` | Text on `bg-accent` surfaces |

### Semantic Status Tokens

| CSS Variable | Tailwind Class | Meaning |
|:---|:---|:---|
| `--success` | `bg-success`, `text-success` | Approved, paid, online, ready |
| `--success-foreground` | `text-success-foreground` | Text on `bg-success` badges |
| `--warning` | `bg-warning`, `text-warning` | Pending, in-progress, attention needed |
| `--warning-foreground` | `text-warning-foreground` | Text on `bg-warning` banners |
| `--info` | `bg-info`, `text-info` | Informational, neutral highlights |
| `--info-foreground` | `text-info-foreground` | Text on `bg-info` surfaces |
| `--destructive` | `bg-destructive`, `text-destructive` | Errors, delete actions, danger states |
| `--destructive-foreground` | `text-destructive-foreground` | Text on `bg-destructive` surfaces |

### Sidebar Tokens (Isolated)

The sidebar has its own token set so it can be styled independently (e.g., dark sidebar with light content area).

| CSS Variable | Tailwind Class |
|:---|:---|
| `--sidebar` | `bg-sidebar` |
| `--sidebar-foreground` | `text-sidebar-foreground` |
| `--sidebar-primary` | `bg-sidebar-primary` |
| `--sidebar-accent` | `bg-sidebar-accent` |
| `--sidebar-border` | `border-sidebar-border` |

### Chart Tokens

For all Recharts/data visualization. Never use raw palette colors in charts.

| Token | Usage |
|:---|:---|
| `--chart-1` | Primary data series |
| `--chart-2` | Secondary data series |
| `--chart-3` | Tertiary data series |
| `--chart-4` | Quaternary data series |
| `--chart-5` | Quinary data series |

---

## 5. Multi-Tenant Dynamic Theming

This is the core feature that makes Kwickly a white-label platform. Each restaurant tenant can have its own brand color and logo.

### How It Works

Defined in [`src/layouts/AppShell.tsx`](../src/layouts/AppShell.tsx):

```typescript
// When a tenant's brand color is loaded from the API:
useEffect(() => {
  const root = document.documentElement;
  if (activeBrandColor) {
    const foreground = getContrastColor(activeBrandColor); // black or white
    const hover      = adjustColorBrightness(activeBrandColor, -12);
    const tint       = getHexOpacity(activeBrandColor, 10);
    const tintHover  = getHexOpacity(activeBrandColor, 20);

    root.style.setProperty('--brand-primary',       activeBrandColor);
    root.style.setProperty('--brand-primary-hover', hover);
    root.style.setProperty('--brand-foreground',    foreground);
    root.style.setProperty('--brand-tint',          tint);
    root.style.setProperty('--brand-tint-hover',    tintHover);
  }
}, [activeBrandColor]);
```

### Current Architecture vs. Ideal Architecture

**Current (v1):** Merchant branding injects `--brand-primary` as a separate CSS variable. Components that need to respond to merchant branding use `var(--brand-primary)` explicitly.

**Ideal (v2 — recommended next step):** Map `--brand-primary` directly onto `--primary` so that all standard Tailwind utility classes (`bg-primary`, `text-primary`) automatically respond to merchant branding without special handling:

```typescript
// Replace this:
root.style.setProperty('--brand-primary', activeBrandColor);

// With this (maps brand directly to the Tailwind primary token):
root.style.setProperty('--primary', activeBrandColor);
root.style.setProperty('--primary-foreground', getContrastColor(activeBrandColor));
root.style.setProperty('--ring', activeBrandColor);
// Also update sidebar tokens:
root.style.setProperty('--sidebar-primary', activeBrandColor);
root.style.setProperty('--sidebar-primary-foreground', getContrastColor(activeBrandColor));
```

**Why this matters:** With v2, you write `bg-primary` and get merchant branding everywhere, automatically. With v1, you have to remember to use `var(--brand-primary)` in some places and `bg-primary` in others — a constant source of inconsistency.

### Contrast Safety

The `getContrastColor()` utility in [`src/lib/colors.ts`](../src/lib/colors.ts) computes luminance to determine whether black or white text is more readable on any given background. This is non-negotiable for accessibility (WCAG AA requires 4.5:1 contrast ratio for normal text).

```typescript
// If the merchant picks a bright yellow brand color:
// getContrastColor('#FFD700') → '#000000' (black text on yellow button)

// If the merchant picks a deep navy brand color:
// getContrastColor('#1e3a5f') → '#FFFFFF' (white text on navy button)
```

---

## 6. The Two Portal Contexts

The Kwickly admin app serves two fundamentally different user groups. Their experiences should be designed and themed separately.

### Platform Portal (`/platform/*`)

| Property | Value |
|:---|:---|
| **User** | Platform Owner, Super Admin |
| **Purpose** | Managing the Kwickly software platform itself |
| **Branding** | System/Platform brand (Kwickly's own colors) |
| **Pages** | `/platform/settings`, `/platform/staff/roles`, `/platform/tenants` |
| **Theme** | Static — always uses default `--primary` from `index.css` |
| **Tone** | Professional, administrative, neutral |

### Merchant Portal (all other routes)

| Property | Value |
|:---|:---|
| **User** | Tenant Owner, Branch Manager, Cashier, Kitchen Staff |
| **Purpose** | Operating the restaurant business day-to-day |
| **Branding** | Dynamically reflects the active merchant's brand color |
| **Pages** | `/dashboard`, `/orders`, `/menus/*`, `/staff/*`, `/settings/*` |
| **Theme** | Dynamic — `--primary` resolves to the merchant's `brandColor` |
| **Tone** | Warm, operational, on-brand |

> **Design principle:** Platform owners see Kwickly's identity. Merchants see their own identity.

---

## 7. Semantic Status Colors

Never use raw Tailwind palette classes (`emerald-500`, `amber-600`, `rose-500`) for operational states. Always use the semantic token system.

### Correct Mapping

| State | Wrong ❌ | Correct ✅ |
|:---|:---|:---|
| Success / Approved / Online | `text-emerald-600 bg-emerald-500/10` | `text-success bg-success/10` |
| Warning / Pending / In Progress | `text-amber-600 bg-amber-500/10` | `text-warning bg-warning/10` |
| Info / Informational | `text-blue-600 bg-blue-500/10` | `text-info bg-info/10` |
| Error / Rejected / Danger | `text-rose-600 bg-rose-500/10` | `text-destructive bg-destructive/10` |
| Neutral / Disabled | `text-slate-500 bg-slate-100` | `text-muted-foreground bg-muted` |

### Why Semantic Over Raw?

When a user switches to dark mode, raw palette classes often become unreadable. Semantic tokens have separate dark-mode values defined in `index.css` that are automatically applied:

```css
/* Light mode */
--success: oklch(0.65 0.15 160);   /* clearly visible green */

/* Dark mode — slightly adjusted for dark backgrounds */
.dark {
  --success: oklch(0.60 0.15 160); /* slightly brighter for dark bg */
  --success-subtle: oklch(0.22 0.05 160); /* very dark tint, not pure black */
}
```

---

## 8. The Golden Rules for Developers

Follow these rules on every PR that touches UI:

### Rule 1: Never hardcode a color

```tsx
// ❌ NEVER do this
<div className="bg-slate-50 text-slate-900 border-slate-200" />
<div className="text-indigo-600 bg-indigo-100" />
<div className="text-emerald-600 bg-emerald-500/10" />

// ✅ ALWAYS do this
<div className="bg-muted text-foreground border-border" />
<div className="text-primary bg-primary/10" />
<div className="text-success bg-success/10" />
```

### Rule 2: Never use both dark: variant AND tokens together

```tsx
// ❌ Broken — mixing paradigms
<div className="bg-white dark:bg-zinc-900" />

// ✅ Correct — tokens handle dark mode automatically
<div className="bg-card" />
```

### Rule 3: Respect the 60-30-10 distribution

```tsx
// ❌ Over-branded — primary color used too much
<div className="bg-primary/20 border-primary rounded-xl">
  <h2 className="text-primary font-bold">Section Title</h2>
  <p className="text-primary/70">...</p>
  <Button className="bg-primary">Save</Button>
</div>

// ✅ Correct — primary used only for the CTA
<div className="bg-card border-border rounded-xl">
  <h2 className="text-foreground font-bold">Section Title</h2>
  <p className="text-muted-foreground">...</p>
  <Button className="bg-primary">Save</Button>
</div>
```

### Rule 4: Use `bg-primary/10` not `bg-primary/5` for tints

The `/10` opacity is the established standard for tinted backgrounds. `/5` is too subtle. `/20` is the hover state of a tint. Stick to this scale.

```tsx
// Active badge
<span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-xs">
  Active
</span>

// Hover state on a tinted element
<button className="bg-primary/10 hover:bg-primary/20 text-primary">
  Click me
</button>
```

### Rule 5: Muted is not gray — it's adaptive

`bg-muted` and `text-muted-foreground` automatically adapt between light and dark mode. Use them liberally for secondary content. Do not reach for `text-gray-400` or `text-slate-500`.

### Rule 6: No gradients, no glow blurs on operational pages

Decorative gradients and background blur circles (`blur-xl`, `blur-2xl`) belong on marketing landing pages. They are visually noisy on operational interfaces used during a restaurant service shift. Keep the UI **flat, clean, and purposeful**.

---

## 9. Common Mistakes and How to Fix Them

### Mistake: Page background looks wrong on theme change

**Cause:** Using `bg-white` or `bg-slate-50` instead of `bg-background` or `bg-card`.

**Fix:** Replace `bg-white` → `bg-card`, replace `bg-slate-50` → `bg-muted/50` or `bg-background`.

---

### Mistake: Icon is blue/indigo in light mode, wrong in dark mode

**Cause:** Using `text-indigo-600` or `text-blue-500`.

**Fix:** Replace with `text-primary` for brand-aligned icons, or `text-muted-foreground` for decorative/secondary icons.

---

### Mistake: Status badge looks great in light mode, terrible in dark mode

**Cause:** Using `bg-emerald-500/10 text-emerald-600` (raw palette).

**Fix:** Replace with `bg-success/10 text-success`.

---

### Mistake: Button text unreadable over merchant's custom brand color

**Cause:** Hardcoding `text-white` on a primary button when the brand might be a light/yellow color.

**Fix:** The button component uses `text-primary-foreground` which is computed dynamically by `getContrastColor()` at runtime. Never override it with `text-white`.

---

### Mistake: The merchant's brand color appears on the Platform portal pages

**Cause:** Platform pages (`/platform/*`) are rendered inside `AppShell`, which injects `--brand-primary` when an impersonation session is active.

**Fix:** Platform system pages should use static `--primary` from `index.css`, not `var(--brand-primary)`. The visual separation between "system mode" and "tenant mode" must be preserved.

---

## 10. Audit Checklist

Use this checklist when reviewing any PR that touches UI:

```
[ ] No hardcoded hex colors (#fff, #000, #3b82f6, etc.)
[ ] No raw Tailwind palette classes (emerald, amber, rose, indigo, slate, zinc)
[ ] No dark: variant used alongside semantic tokens (pick one paradigm)
[ ] Status colors use success/warning/info/destructive tokens
[ ] Text on primary backgrounds uses text-primary-foreground (not text-white)
[ ] No decorative gradients, radial glows, or blur-xl circles
[ ] Brand color occupies ≤ 10% of visible surface area
[ ] Chart data uses chart-1 through chart-5 tokens only
[ ] Sidebar items use sidebar-* token family, not primary directly
[ ] Dark mode manually tested by toggling class="dark" on <html>
```

---

## 11. Migration Path: v1 → v2 Brand Tokens

The current system (v1) uses a separate `--brand-primary` variable. The recommended v2 maps the merchant brand color directly onto `--primary`, so all standard Tailwind utilities respond to merchant branding automatically.

### Why Migrate?

In v1, a developer writing a new component has to actively remember to use `var(--brand-primary)` instead of `bg-primary`. This is a constant source of drift. In v2, `bg-primary` **is** the merchant brand everywhere — no special handling needed.

### Files Using `var(--brand-primary)` Directly (Must Update in v2)

Audit these files and replace any direct `var(--brand-primary)` reference with `bg-primary` / `text-primary` once the v2 injection is in place:

```
[ ] src/layouts/AppShell.tsx          — injection point (update to write --primary)
[ ] src/components/AppSidebar.tsx     — check for any direct var(--brand-primary)
[ ] src/pages/settings/BrandingSettings.tsx — preview uses brand vars
[ ] src/features/*/                   — grep for var(--brand-primary) across features
```

### v2 Migration Steps

1. **Update `AppShell.tsx`** — change `setProperty('--brand-primary', ...)` to `setProperty('--primary', ...)`
2. **Also set foreground and ring:**
   ```typescript
   root.style.setProperty('--primary',             activeBrandColor);
   root.style.setProperty('--primary-foreground',  getContrastColor(activeBrandColor));
   root.style.setProperty('--ring',                activeBrandColor);
   root.style.setProperty('--sidebar-primary',     activeBrandColor);
   root.style.setProperty('--sidebar-primary-foreground', getContrastColor(activeBrandColor));
   ```
3. **Remove `--brand-*` variable references** across all components (run `grep -r 'brand-primary' src/`)
4. **Remove `--brand-*` custom property definitions** from `index.css`
5. **Restore defaults on logout** — when `activeBrandColor` is null, reset `--primary` to the Kwickly system value from `index.css`

### Deprecation Timeline

| Phase | Action | Target |
|:---|:---|:---|
| Now (v1) | `--brand-primary` is the merchant color variable | Current |
| Next sprint | Migrate `AppShell.tsx` injection + audit all feature pages | v2 start |
| +2 weeks | Remove all `var(--brand-primary)` references from components | v2 complete |
| +4 weeks | Remove `--brand-*` variables entirely from codebase | Cleanup |

---

## 12. Accessibility Contract

Theme compliance is not only about visual consistency — it is a legal and ethical requirement under WCAG 2.1 AA.

### Text Contrast Requirements

| Use Case | Minimum Ratio | How Enforced |
|:---|:---|:---|
| Normal text (< 18px) | 4.5:1 | `getContrastColor()` at runtime |
| Large text (≥ 18px bold) | 3:1 | Manually verified per component |
| UI components & icons | 3:1 | Semantic tokens provide sufficient contrast by design |

### Merchant Brand Color Validation

Brand colors must be validated **at ingestion** (when the merchant saves their brand color in Branding Settings), not only corrected at render time.

```typescript
// In BrandingSettings.tsx — validate before saving
const MIN_CONTRAST_RATIO = 3.0; // against --card background

if (getContrastRatio(brandColor, cardBackground) < MIN_CONTRAST_RATIO) {
  toast.error('Brand color has insufficient contrast. Please choose a darker or more saturated color.');
  return; // Block the save
}
```

This is currently **not implemented** and is a known gap.

### Touch Target Sizes

Critical for KDS screens operated by kitchen staff with gloves on touchscreens.

| Element | Minimum Size | Status |
|:---|:---|:---|
| Buttons (primary actions) | 44 × 44px | ✅ Enforced via `h-10` / `h-11` on Button variants |
| Navigation items (sidebar) | 44px height | ✅ Sidebar items use `py-2` with sufficient line height |
| Icon-only buttons | 44 × 44px | ⚠️ Some icon buttons use `h-8 w-8` — needs audit |
| KDS action buttons | ≥ 56 × 56px | ⚠️ KDS page not yet built — enforce when built |

### Focus-Visible States

All interactive elements must have a visible focus ring for keyboard navigation.

```css
/* Already set globally in index.css */
* {
  @apply border-border outline-ring/50;
}
```

The `--ring` variable should always be updated alongside `--primary` in the v2 migration so focus rings match the merchant brand.

### Reduced Motion

Users with vestibular disorders can enable `prefers-reduced-motion`. Animations like `animate-spin`, `animate-pulse`, and `slide-in-from-*` should be suppressed:

```css
/* Add to index.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is currently **not implemented** and is a known gap.

---

## 13. Component Token Contracts

Each component has an implicit contract about which tokens it is allowed to use. The following table makes this explicit to prevent violations during new development.

| Component | Allowed Tokens | Forbidden Tokens | Notes |
|:---|:---|:---|:---|
| `Button` (primary) | `--primary`, `--primary-foreground`, `--ring` | Any raw palette | Foreground must use `getContrastColor()` |
| `Button` (destructive) | `--destructive`, `--destructive-foreground` | `rose-*`, `red-*` | |
| `Badge` (status) | `--success`, `--warning`, `--info`, `--destructive` | `emerald-*`, `amber-*`, `blue-*` | |
| `Toast` / Sonner | `--popover`, `--border`, `--destructive` (for errors) | Brand tokens | Toasts are system-level, never merchant-branded |
| `Sidebar` nav items | `--sidebar-*` family only | `--primary` directly | Sidebar has its own isolated token family |
| Charts / Recharts | `--chart-1` through `--chart-5` | Any raw palette | |
| Card surface | `--card`, `--card-foreground`, `--border` | `bg-white`, `bg-zinc-*` | |
| Input fields | `--input`, `--ring`, `--border`, `--destructive` | Any raw palette | |
| Dialog / Modal | `--popover`, `--border`, `--muted` | Brand tokens | Dialogs are UI chrome, not content |
| Active nav indicator | `--primary/10`, `--primary`, `--primary/20` | Hardcoded hues | Must respond to merchant theme |
| Status dots (online/offline) | `--success`, `--destructive`, `--muted-foreground` | `emerald-*`, `red-*` | |

---

## 14. Theming Failure States & Fallbacks

Robust systems define what happens at every failure boundary, not only the happy path.

### Failure Scenarios

| Scenario | Current Behavior | Required Behavior |
|:---|:---|:---|
| `brandColor` is `null` or `undefined` | CSS variables are removed via `removeProperty()` | Fallback to Kwickly system `--primary` from `index.css` |
| `brandColor` is a malformed string (e.g. `"#GGGGGG"`) | `getContrastColor()` may throw or return wrong value | Validate with a hex regex before calling color utilities |
| `brandColor` fails contrast check (< 3:1 against card) | Accepted and rendered with potentially unreadable UI | Block save in BrandingSettings; show correction UI |
| `brandColor` is `#ffffff` (pure white) | White-on-white buttons — invisible | Reject in validation: white/near-white brand colors not allowed |
| API returns brand color after a 3s delay | Default theme renders first, then flashes to brand | Pre-load brand color in auth store before rendering `AppShell` |

### Fallback Implementation

```typescript
// AppShell.tsx — safe color injection
const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

if (activeBrandColor && isValidHex(activeBrandColor)) {
  // ... inject brand tokens
} else {
  // Explicitly reset to system defaults — do not leave stale values
  root.style.removeProperty('--primary');
  root.style.removeProperty('--primary-foreground');
  root.style.removeProperty('--ring');
}
```

---

## 15. Governance & Ownership

### Token Ownership

| Token Family | Owner | Review Required By |
|:---|:---|:---|
| Core tokens (`--background`, `--foreground`, `--card`, etc.) | Platform UI lead | Full team sign-off |
| Semantic status tokens (`--success`, `--warning`, `--info`) | Platform UI lead | Platform UI lead |
| Sidebar tokens (`--sidebar-*`) | Platform UI lead | Platform UI lead |
| Chart tokens (`--chart-*`) | Feature team | Platform UI lead review |
| Brand tokens (injected at runtime) | Merchant (self-serve) | Validated by system constraints |

### Adding a New Token

New semantic tokens require a lightweight RFC (Request for Comment) before implementation:

1. **Open a GitHub Discussion** titled `[Token RFC] --token-name`
2. **State the problem** — what existing token is insufficient and why
3. **Propose the name** — follow the `--{category}-{variant}` naming convention
4. **Propose the value** — in OKLCH with light and dark mode variants
5. **Identify consumers** — which components will use this token
6. **Platform UI lead approves** — merged into `index.css` and `@theme inline` block

### What Is NOT a New Token

- A one-off color for a single component → use an existing token with opacity
- A hardcoded value that "just needs to be slightly different" → align with the nearest semantic token
- A raw Tailwind palette class → find the semantic equivalent or propose an RFC

---

## 16. Enforcement & Tooling

The audit checklist in Section 10 is the human review layer. The following tooling provides automated enforcement that catches violations before code review.

### ESLint Rule: No Raw Palette Classes

Create `.eslintrc-theme.cjs` or add to your existing ESLint config:

```javascript
// Flags any use of raw Tailwind palette colors in className strings
// e.g. bg-emerald-500, text-indigo-600, border-slate-200
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]',
        message:
          '[Theme] Raw Tailwind palette class detected. Use semantic tokens (bg-primary, text-success, bg-muted) instead. See docs/theme-system.md.',
      },
    ],
  },
};
```

This produces a `warn` (not `error`) so existing violations are visible without blocking CI. Once all violations are fixed (see `theme_implementation_tracker.md`), upgrade to `error` to prevent regressions.

### Recommended Lint Workflow

```bash
# Run manually to see all current violations
npx eslint src/ --rule 'no-restricted-syntax: warn' --ext .tsx,.ts

# Add to CI pipeline (GitHub Actions)
# Fails PR if new raw palette classes are introduced
bun run lint -- --max-warnings=0
```

### Stylelint Rule: No Raw CSS Color Values in .css Files

If any CSS is written directly (not via Tailwind), use stylelint:

```json
// .stylelintrc.json
{
  "rules": {
    "color-no-hex": [true, { "severity": "warning" }]
  }
}
```

This prevents hardcoded hex values in `.css` files — all colors should route through CSS custom properties.

---

## 17. Figma Token Sync (Known Gap)

Mature design systems (Shopify Polaris, Atlassian) maintain a two-way sync between Figma design tokens and code CSS variables so design and engineering never drift out of sync.

### Current State

**This pipeline does not exist yet.** Token values in `index.css` were hand-crafted and are not connected to any Figma library.

### What the Ideal Pipeline Looks Like

```
Figma Tokens Plugin
  → tokens.json  (exported from Figma)
  → Style Dictionary (transforms JSON → CSS variables)
  → index.css     (auto-generated, not hand-edited)
  → PR created    (token changes are reviewed before merge)
```

### When to Implement This

The Figma sync pipeline becomes necessary when:

- A dedicated designer is producing Figma frames as a handoff artifact
- Token values are changing frequently due to brand evolution
- The team grows beyond 3–4 engineers and drift becomes a real risk

### Interim Approach (Now)

Until a Figma sync pipeline exists, maintain a manual `tokens.json` file alongside `index.css` to document the intended values. This makes a future automated pipeline migration straightforward.

```jsonc
// docs/tokens.json (manual, for reference)
{
  "primary": { "value": "oklch(0.6626 0.1296 240.2393)", "description": "Kwickly brand blue. Overridden at runtime by merchant brand color." },
  "success": { "value": "oklch(0.65 0.15 160)",          "description": "Approved, paid, online states." },
  "warning": { "value": "oklch(0.75 0.17 75)",           "description": "Pending, in-progress, attention states." },
  "destructive": { "value": "oklch(0.5987 0.1978 21.7756)", "description": "Errors, delete actions, danger states." }
}
```

---

## Related Documents

- [`theme_implementation_tracker.md`](./theme_implementation_tracker.md) — Full audit trail of all pages and violations fixed
- [`project-context.md`](./project-context.md) — Overall project architecture and structure
- [`src/index.css`](../src/index.css) — All CSS custom property definitions (single source of truth)
- [`src/layouts/AppShell.tsx`](../src/layouts/AppShell.tsx) — Dynamic brand color injection logic
- [`src/lib/colors.ts`](../src/lib/colors.ts) — Color utility functions (contrast, brightness, opacity)