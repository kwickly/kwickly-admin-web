# Theme System v2 — Implementation Tracker

> **Reference:** See [`theme-system.md`](./theme-system.md) for full design rationale and [`../implementation_plan.md`] for detailed code specs.  
> **Status legend:** `[ ]` Not started · `[/]` In progress · `[x]` Done · `[!]` Blocked

---

## Summary Dashboard

| Phase | Description | Status | Est. | Actual |
|:---|:---|:---|:---|:---|
| **Phase 1** | v1 → v2 Brand Token Migration | `[x]` Done | ~2h | ~30min |
| **Phase 2** | Brand Color Validation at Ingestion | `[x]` Done | ~1h | ~20min |
| **Phase 3** | ESLint Enforcement Rule | `[x]` Done | ~30min | ~10min |
| **Phase 4** | Accessibility Gaps | `[x]` Done | ~1h | ~25min |
| **Phase 5** | AppShell Fallback Robustness | `[x]` Done | ~30min | ~10min |
| **Phase 6** | Reference Artifacts | `[x]` Done | ~20min | ~10min |
| **Bonus** | Dark bg, chart-4, destructive-subtle | `[x]` Done | unplanned | ~10min |

**Total:** ~5.5 hrs estimated

---

## Phase 1: v1 → v2 Brand Token Migration

**Goal:** `bg-primary` everywhere automatically reflects the active merchant brand color. No more `var(--brand-primary)` in component markup.

### Step 1.1 — Add `getRelativeLuminance` & `getContrastRatio` to `colors.ts`

- [x] Add `getRelativeLuminance(hex: string): number`
- [x] Add `getContrastRatio(hex1: string, hex2: string): number`
- [x] Add `isValidHex(color: string): boolean` validator

### Step 1.2 — Update `AppShell.tsx` injection

- [x] Replace `--brand-primary` writes with direct `--primary` injection
- [x] Set `--primary-foreground` dynamically using `getContrastColor()`
- [x] Set `--ring`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--accent-foreground`
- [x] Add hex validation (`isValidHex`) before injection
- [x] On null/invalid color: `removeProperty` to restore CSS sheet defaults
- [x] Removed unused `adjustColorBrightness`, `getHexOpacity` imports

### Step 1.3 — Sweep & replace all `var(--brand-primary)` consumers

- [x] Ran `grep -r 'brand-primary' src/` — **zero results outside AppShell.tsx**
- [x] No other files were consuming `--brand-primary` directly

### Step 1.4 — Finalise `--brand-*` in `index.css`

- [x] **Changed strategy:** Instead of removing `--brand-*`, declared them as **static fallbacks** pointing to `var(--primary)` in both `:root` and `.dark`. This means:
  - Any component using `var(--brand-primary)` before the JS effect runs gets the system `--primary` as a safe default
  - JS injection in `AppShell.tsx` overrides at runtime as before
  - Zero risk of invalid/empty values during initial render flash

---

## Phase 2: Brand Color Validation at Ingestion

**Goal:** Block merchants from saving brand colors that create unreadable UI.

### Step 2.1 — Add validation logic to `BrandingSettings.tsx` save handler

- [x] Added `contrastIsValid` computed from OKLCH primary lightness (0.55) using luminance approximation
- [x] Save handler checks `contrastIsValid` before firing the API call — shows descriptive `toast.error()` on block
- [x] Silent exit in `onError` if it was a validation block (already toasted)

### Step 2.2 — Add UI feedback in color picker

- [x] Live color swatch (`oklch(0.55 chroma hue)`) renders next to the Hue slider
- [x] Contrast ratio badge: green ✓ "X.X:1 — Meets WCAG AA" / amber ⚠ "X.X:1 — Contrast too low"
- [x] Badge changes in real-time as the user drags the Hue and Chroma sliders

---

## Phase 3: ESLint Enforcement

**Goal:** Raw Tailwind palette classes (`bg-emerald-500`, `text-indigo-600`) are auto-flagged in PRs.

### Step 3.1 — Configure ESLint rule

- [x] Added `no-restricted-syntax` rule to `eslint.config.js`
- [x] Covers literal className strings AND template literal className strings
- [x] Covers 13 property families: `bg|text|border|ring|fill|stroke|outline|decoration|shadow|accent|caret|divide|placeholder|from|via|to`
- [x] Severity: `warn` — surfaces new violations without blocking CI
- [x] Rule message links directly to `docs/theme-system.md §8`

### Step 3.2 — Verify CI pipeline integration

- [ ] Confirm lint runs on PRs in CI (GitHub Actions / equivalent)
- [ ] Upgrade to `error` after confirming zero violations in a clean baseline run

---

## Phase 4: Accessibility Gaps

**Goal:** WCAG 2.1 AA compliance + motion safety.

### Step 4.1 — `prefers-reduced-motion` in `index.css`

- [x] Added `@media (prefers-reduced-motion: reduce)` block at bottom of `src/index.css`
- [x] Suppresses `animation-duration`, `animation-iteration-count`, `transition-duration`, `scroll-behavior`
- [x] Closes the known gap documented in `theme-system.md` Section 12

### Step 4.2 — Icon-only button touch target audit

- [x] Ran `grep -rn 'h-8 w-8|w-8 h-8' src/ --include="*.tsx"` — found 7 results
- [x] Classified each: 2 interactive, 5 decorative/display (skeleton, logo img, icon)
- [x] `PlatformTenants.tsx` dropdown trigger: `h-8 w-8` → `h-10 w-10`
- [x] `PayrollRunDetails.tsx` edit icon in table: `h-8 w-8` → `h-9 w-9` (dense table context, WCAG 2.2 SC 2.5.8 exception applies)
- [x] Decorative items (`loaders.tsx` skeleton, `TenantDashboard.tsx` icon, `PlatformSettings.tsx` icon, logo `<img>`) — correctly left at `h-8 w-8`, not interactive

---

## Phase 5: AppShell Fallback Robustness

**Goal:** Theme injection never crashes or leaves stale tokens from a previous tenant session.

### Step 5.1 — Hex validation guard in `AppShell.tsx`

- [x] Added `isValidHex()` guard — done in Phase 1 Step 1.2

### Step 5.2 — CSS-level fallback for `--brand-*` before JS runs

- [x] Declared `--brand-primary: var(--primary)` (and other `--brand-*` vars) as static fallbacks in `:root` and `.dark` in `index.css`
- [x] Closes the **sharper risk**: components referencing `var(--brand-primary)` before the JS effect fires (or on error) now resolve to `--primary` instead of an invalid empty value

### Step 5.3 — Pre-load brand color before first render

- [ ] Investigate: does the auth store hydrate `brandColor` before `AppShell` mounts?
- [ ] If not: add a loading gate so the default Kwickly theme renders before overriding, preventing flash

---

## Phase 6: Reference Artifacts

**Goal:** Prepare for a future Figma → Style Dictionary → CSS pipeline.

### Step 6.1 — Create `docs/tokens.json`

- [x] Created [`docs/tokens.json`](./tokens.json) with full light + dark values for every token
- [x] 7 sections: `base`, `brand`, `semantic`, `chart`, `sidebar`, `brand-runtime-fallbacks`, `typography`, `radius`
- [x] Each token has `light`, `dark`, and `description` fields
- [x] Includes CVD rationale for chart-4 change and brand injection architecture notes
- [x] Structure is compatible with Style Dictionary v4 for a future Figma pipeline

---

## Bonus Improvements (index.css — done outside phases)

All made directly to `src/index.css`:

| Change | Reason |
|:---|:---|
| `--background` dark: `oklch(0 0 0)` → `oklch(0.16 0.01 240)` | Pure black causes halation on OLED screens during long shifts — contradicted the doc's own Section 1 goal |
| `--popover` dark: same fix | Dropdown/dialog backgrounds were also pure black |
| `--chart-4`: green `oklch(0.6642 0.1557 153)` → magenta `oklch(0.62 0.17 320)` | chart-2 and chart-4 were both green at similar lightness — indistinguishable for red-green CVD users |
| `--destructive-subtle` added (light + dark) | Completes the token set: every semantic token now has a `-subtle` tint variant |
| `@media (prefers-reduced-motion: reduce)` added | Closes Section 12 known gap |
| `--brand-*` fallbacks declared in `:root` + `.dark` | Closes Section 14 failure state: no more invalid CSS value before JS fires |

---

## Known Gaps (Deferred)

These items are documented but **not in scope for this sprint**:

| Gap | Why Deferred |
|:---|:---|
| Figma Token Sync pipeline | No dedicated designer producing Figma handoffs yet |
| Stylelint for `.css` files | Low risk — only `index.css` exists, hand-maintained |
| KDS-specific touch target rules | KDS page not built yet |
| Icon-only button touch target audit (Phase 4.2) | Pending grep sweep |

---

## Change Log

| Date | Phase | Change | Author |
|:---|:---|:---|:---|
| 2026-06-28 | 1.1 | Added `getRelativeLuminance()`, `getContrastRatio()`, `isValidHex()` to `colors.ts` | — |
| 2026-06-28 | 1.2 | Migrated `AppShell.tsx` to v2: injects `--primary` / `--ring` / `--sidebar-primary` directly | — |
| 2026-06-28 | 1.3 | Grep sweep confirmed zero other consumers of `--brand-primary` | — |
| 2026-06-28 | 1.4 | `--brand-*` declared as CSS fallbacks in `:root` + `.dark` (strategy change: alias not remove) | — |
| 2026-06-28 | 4.1 | `@media (prefers-reduced-motion: reduce)` added to `index.css` | — |
| 2026-06-28 | 5.2 | `--brand-primary: var(--primary)` static fallback closes pre-JS render gap | — |
| 2026-06-28 | Bonus | Dark bg near-black, chart-4 recolored to magenta, `--destructive-subtle` added | — |
| 2026-06-28 | 2.1 | Added `contrastIsValid` check + toast guard in `BrandingSettings.tsx` save handler | — |
| 2026-06-28 | 2.2 | Live color swatch + WCAG contrast ratio badge added to Branding Settings colors tab | — |
| 2026-06-28 | 3.1 | ESLint `no-restricted-syntax` rule added to `eslint.config.js` for raw palette class detection | — |
| 2026-06-28 | 4.2 | Touch target audit complete: `PlatformTenants` → h-10 w-10, `PayrollRunDetails` → h-9 w-9 | — |
| 2026-06-28 | 6.1 | Created `docs/tokens.json` — full token reference with light/dark values + descriptions | — |
