# Kwickly Admin Web Documentation

Welcome to the documentation for the Kwickly Admin Web repository. 
This folder contains Architecture Decision Records (ADRs), UX/UI guidelines, and implementation plans.

## 📂 Documentation Structure
To prevent documentation fatigue, we organize files by **Domain (Topic) -> Chronological Order**. 
Deprecated or superseded decisions are moved to the `archive/` folder.

### 🏛️ Architecture & Infrastructure
Decisions regarding the core systems, RBAC, state management, and overarching platform architecture.
- [2026-06-23: Core Architecture](architecture-and-infrastructure/2026-06-23-core-architecture/core-architecture.md)
- [2026-07-11: RBAC Platform Architecture](architecture-and-infrastructure/2026-07-11-rbac-platform-architecture/rbac-platform-architecture.md)
- [2026-07-16: API Client Integration](architecture-and-infrastructure/2026-07-16-api-client-integration/api-client-integration.md)

### 🎨 Frontend & UX
Guidelines for UI/UX, styling, theming, and white-labeling configurations.
- [2026-06-28: Theme System V2](frontend-and-ux/2026-06-28-theme-system-v2/theme-system-v2.md)
- [2026-07-11: UX/UI Guidelines](frontend-and-ux/2026-07-11-ux-ui-guidelines/ux-ui-guidelines.md)
- [2026-07-11: White Labeling and UI Refactor](frontend-and-ux/2026-07-11-white-labeling-and-ui-refactor/white-labeling-and-ui-refactor.md)

### 🗄️ Database & Schema
Documentation mirroring schema decisions from the API repository that impact the frontend (e.g. Enums, Statuses).
- [2026-07-12: Global Status Enums](database-and-schema/2026-07-12-global-status-enums/global-status-enums.md)
- [2026-07-12: Schema Audit Completion](database-and-schema/2026-07-12-schema-audit-completion/schema-audit-completion.md)

### 🧪 Testing & QA
- [2026-06-17: Initial Testing](testing-and-qa/2026-06-17-initial-testing/testing-progress.md)
- [2026-07-16: End-to-End Testing Strategy](testing-and-qa/2026-07-16-e2e-testing-strategy/e2e-testing-strategy.md)

### 📈 Progress & Planning
Documentation acting as a high-level roadmap and project status tracker for the AI assistant and developers.
- [2026-07-12: Project Roadmap & Epic Tracking](progress-and-planning/2026-07-12-epic-roadmap/epic-roadmap.md)

### 📦 Archive
*(Superseded or deprecated decisions live in `docs/archive/`)*

---

**Rule of Thumb for adding new Docs:**
1. Pick the correct domain folder (or create one if it doesn't fit).
2. Create a folder named `YYYY-MM-DD-short-topic-name`.
3. Add your markdown file inside.
4. Update this `README.md` to link to your new file!
