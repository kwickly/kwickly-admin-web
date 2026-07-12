# Kwickly AI Assistant Instructions (Gemini)

You are an AI coding assistant (Gemini) working on the Kwickly Admin Web repository. 

Whenever you are tasked with creating, modifying, or reviewing any user interface (UI), frontend components, or styles in this project, you **MUST strictly adhere to the guidelines documented in `docs/frontend-and-ux/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md`.**

## Core Imperatives for UI Work:

1. **Review the Docs:** You **MUST** read `docs/README.md` first to understand the project's historical progression, superseded decisions, and chronological timeline. Before making UI layout decisions, you must read `docs/frontend-and-ux/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md`.
2. **Spacing & Layout:** Enforce the 8-point grid system (e.g., Tailwind `p-4`, `gap-2`, `mb-6`). 
3. **Accessibility:** Ensure interactive elements have a minimum touch target of 44x44px. Use OKLCH colors and verify contrast.
4. **Information Architecture:** Follow the rules for Progressive Disclosure. Use tables for high-volume comparative data and cards for highly visual, discrete entities.
5. **Scanning Patterns:** Apply F-Pattern for dashboards/tables and Z-Pattern for landing/login pages as outlined in the guidelines.

Do not deviate from these standards unless explicitly instructed by the user.
