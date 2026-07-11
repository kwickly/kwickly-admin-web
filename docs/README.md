# Documentation Master Index & Audit Log

Welcome to the Kwickly docs folder. We maintain a strict chronological Architecture Decision Record (ADR) format.

## How to Maintain This Folder

1. **New Topics:** Any new research, tracker, or architectural decision MUST be placed in a new folder.
2. **Naming Convention:** Use the ISO 8601 date standard in kebab-case format. Example: `2026-07-11-ux-ui-guidelines`. This guarantees perfect chronological sorting.
3. **Supersession Rule:** When a document is ruled out or replaced, you MUST edit the old document to include a `> [!WARNING] SUPERSEDED` block at the top, pointing to the new document. You must also record this change in the **Audit Log** below.

## Project Timeline & Master Index

- **[2026-06-17-initial-testing](./2026-06-17-initial-testing)**: Legacy testing progress checklist.
- **[2026-06-23-core-architecture](./2026-06-23-core-architecture)**: Deployment architecture, PWA setup, and high-level project context.
- **[2026-06-28-theme-system-v2](./2026-06-28-theme-system-v2)**: The definitive documentation for the V2 design token system (`theme-system.md`, `tokens.json`).
- **[2026-07-11-ux-ui-guidelines](./2026-07-11-ux-ui-guidelines)**: Core design styles, data density strategies, and F/Z scanning patterns for the POS/Admin interfaces.
- **[2026-07-11-rbac-platform-architecture](./2026-07-11-rbac-platform-architecture)**: Database schema audit covering RBAC, tenant vs platform roles, hardware authentication, and a phase-wise roadmap.
- **[2026-07-11-white-labeling-and-ui-refactor](./2026-07-11-white-labeling-and-ui-refactor)**: Plan to separate tenant branding from core schema, implement Enterprise White Labeling, and rigorously enforce UI guidelines globally.

## Audit Log of Changed Decisions

- **28th Jun, 26**: The original `theme_implementation_tracker.md` (from 24th Jun) was superseded by `theme-v2-implementation-tracker.md` to reflect the updated styling strategy.
