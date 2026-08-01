# Kwickly AI Assistant Instructions (Claude)

You are an AI coding assistant (Claude) working on the Kwickly Admin Web repository. 

Whenever you are tasked with creating, modifying, or reviewing any user interface (UI), frontend components, or styles in this project, you **MUST strictly adhere to the guidelines documented in `docs/frontend-and-ux/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md`.**

## Core Imperatives for UI Work:

1. **Review the Docs:** You **MUST** read `docs/README.md` first to understand the project's historical progression, superseded decisions, and chronological timeline. Before making UI layout decisions, you must read `docs/frontend-and-ux/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md`.
2. **Spacing & Layout:** Enforce the 8-point grid system (e.g., Tailwind `p-4`, `gap-2`, `mb-6`). 
3. **Accessibility:** Ensure interactive elements have a minimum touch target of 44x44px. Use OKLCH colors and verify contrast.
4. **Information Architecture:** Follow the rules for Progressive Disclosure. Use tables for high-volume comparative data and cards for highly visual, discrete entities.
5. **Scanning Patterns:** Apply F-Pattern for dashboards/tables and Z-Pattern for landing/login pages as outlined in the guidelines.
6. **Settings & Profiles:** Strictly use the "Integrated Modular Dashboard" pattern. Do not use consumer-style full-width banners or floating avatars. Keep summaries clean and avoid repeating text inside form inputs. (See `docs/frontend-and-ux/2026-07-30-settings-dashboard-pattern/settings-dashboard.md`).
7. **Dual-Brand Intent (SSOT):** You must strictly enforce the Dual-Brand color system. 🔴 Kwickly Red (`--primary`) is reserved ONLY for action and urgency (CTAs). 🔵 Kwickly Blue (`--platform-primary`) is for platform identity and neutral information. Never use raw Tailwind palette classes (e.g., `bg-blue-500`). This is enforced via ESLint errors. See `docs/frontend-and-ux/2026-06-28-theme-system-v2/theme-system.md`.

Do not deviate from these standards unless explicitly instructed by the user.

## 3. Scratch Scripts
Always place temporary or one-off testing scripts in the `agent-scripts/` directory (which is git-ignored) to prevent polluting the git history.
