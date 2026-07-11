# Kwickly UX/UI Design Architecture & Guidelines

As a Restaurant POS (Point of Sale) and SaaS Admin Platform, Kwickly strictly follows these industry best practices for all UI/UX design and frontend implementations.

## 1. Design Styles

A Restaurant POS is an **operational interface**, not a marketing website. The design style must prioritize speed, legibility, and reduced cognitive load.

- **Flat, Clean, and Purposeful:** Avoid heavy gradients, excessive glassmorphism, or deep shadows on operational pages. Use flat colors with subtle borders (`border-border`) to separate content.
- **Data-Dense but Breathable:** The interface must handle complex data (tables, orders, menus) without feeling cluttered. We achieve this using a strict card-based architecture.
- **The 60-30-10 Rule:** 
  - **60%** Neutral Canvas (`bg-background`, `bg-card`)
  - **30%** Structural Elements (`border-border`, `bg-muted`, typography)
  - **10%** Brand Accents (`bg-primary`). Do not over-brand operational UI; reserve brand colors for primary Call-to-Actions (CTAs) and active states.

## 2. Light and Dark Modes

**Light and Dark modes are absolutely mandatory for a Restaurant POS.**

Different restaurant environments require entirely different visual contrasts:
- **Light Mode:** Essential for brightly lit Kitchens (KDS systems) and daylight outdoor environments where screen glare is high. Contrast must be stark (near black on pure white).
- **Dark Mode:** Essential for waitstaff operating in dimly lit dining rooms. A bright screen causes eye strain and ruins the restaurant ambiance (halation effect). 
- **The Theme Type:** We must use **OKLCH Color Spaces** to ensure perceptual uniformity, meaning a 50% lightness blue has the exact same visual weight as a 50% lightness green.

## 3. Strict UI Requirements

1. **Automated Contrast Validation:** When merchants select their custom brand colors, the system must enforce WCAG AA 4.5:1 contrast ratios.
2. **Touch Target Sizing:** POS interfaces are often used on tablets (iPads). All interactive elements (buttons, nav items) must have a **minimum touch target of 44x44px** (Apple HIG standard). The Kitchen Display System (KDS) should use **56x56px**.
3. **Reduced Motion Accessibility:** Animations must be globally disabled via `prefers-reduced-motion` queries to support users with vestibular disorders.

## 4. Layout & Spacing

### Spacing System
Industry standard dictates an **8-point grid system**. All margins, paddings, and heights must be multiples of 8 (e.g., 8px, 16px, 24px, 32px, 48px). In Tailwind, this maps to `gap-2`, `p-4`, `mb-6`, `h-12`.

### Page Anatomy
- **Global Sidebar (Left):** Consistent navigation. Expandable on desktop, hidden in a drawer on mobile.
- **Top App Bar:** Contextual actions (Tenant switcher, User Profile, Notifications).
- **Page Header:** Clearly states the current page title and primary page-level actions (e.g., "Export", "Add Item").
- **Content Area:** Always wrapped in a max-width container (`max-w-7xl`) for readability on ultrawide monitors, preventing eye travel fatigue.

## 5. Scanning Patterns (F, Z, T)

Different pages require different visual hierarchies based on how the human eye naturally scans screens.

### 1. The F-Pattern (Dashboards, Tables, Menus)
- **Use Case:** Text-heavy pages, data tables, and analytics dashboards.
- **How it works:** Users scan horizontally across the top (reading the Page Title and primary CTA), then scan down the left edge, branching out horizontally when they find the row they want.
- **Application:** Keep primary navigation and row labels on the left. Align numerical data to the right.

### 2. The Z-Pattern (Login, Landing, Settings Forms)
- **Use Case:** Simple, focused action pages like the Login Screen or a specific Settings Configuration.
- **How it works:** The eye goes top-left (Logo) → top-right (Secondary link) → diagonal down to bottom-left (Form Input) → bottom-right (Submit CTA).
- **Application:** Place the final "Save" or "Submit" button in the bottom-right corner of cards and modals.

### 3. The T-Pattern / Modular Pattern (Kitchen Display System)
- **Use Case:** KDS (Kitchen Display System) and POS Order Taking.
- **How it works:** Top-level information (Order #, Time Elapsed) forms the horizontal bar of the T, while the specific items cascade straight down vertically. 
- **Application:** Use masonry or strict grid column layouts where vertical scanning speed is the sole priority.

## 6. Information Architecture: Cards vs. Tables

Choosing between cards and tables is critical for a high-density SaaS platform.

### When to use Tables
- **Use Case:** High-volume data where comparison, sorting, and bulk actions are required.
- **Examples:** Staff Directory, Customer List, Transaction Logs, Inventory Stock.
- **Best Practices:**
  - Limit columns to 5-7 maximum to avoid horizontal scrolling.
  - Use sticky headers so context is never lost.
  - Align text left, numbers right, and actions (edit/delete) to the far right.
  - Provide a robust filtering/search bar above the table rather than showing everything at once.

### When to use Cards
- **Use Case:** Highly visual data, discrete entities that don't need direct column comparison, or dashboard summaries (KPIs).
- **Examples:** Menu Items (where photos are important), Active Orders in KDS, Dashboard Metric Widgets.
- **Best Practices:**
  - Group related information logically inside the card.
  - Use consistent heights (e.g., standardizing card height in a grid).
  - Include quick actions directly on the card for efficiency.

## 7. Data Density: Landing Pages vs. Detail Views

Industry best practices dictate a strategy of **Progressive Disclosure**—only showing the user what they need at that exact moment to prevent cognitive overload.

### Initial Landing Pages (The "List" or "Index" View)
- **Goal:** Quick scanning, finding a specific record, and seeing high-level status.
- **Data Amount:** Minimal. Only show the most critical identifying fields (e.g., Name, Status Badge, ID, Date, Total Amount).
- **Decision Matrix:** Ask, "Can the user identify the record they want with just this data?" If yes, stop adding columns.
- **Best Practice:** Keep the UI breathable. Rely on filters, search, and pagination (default to 20-50 items per page).

### Detail Views & CRUD Settings (The "View/Edit" Screen)
- **Goal:** Deep dive, editing, and comprehensive understanding of a single entity.
- **Data Amount:** Comprehensive. This is where all related metadata, history logs, and granular settings live.
- **How to Display:** 
  - Do not dump 50 fields on one screen. 
  - **Tabs (In-Page Context Switching):** Use ONLY for read-heavy context switching on the same data entity (e.g., viewing an Order Summary vs Order Timeline). 
  - **Dedicated Pages (Sub-Routing) [INDUSTRY STANDARD]:** For complex settings and distinct CRUD operations (e.g., Branding vs White Labeling, Profile vs Security), you MUST use a Nested Layout with a Sub-Sidebar (Dedicated Routes). This allows for deep linking, isolated validation states, and scalable CRUD forms without nesting modals inside tabs.
  - Use **Accordions** for secondary or advanced settings within a dedicated page.
  - Use a **Side Panel (Sheet)** for quick edits that shouldn't pull the user away from their context.
