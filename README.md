# Kwickly Admin Web Dashboard

The central management portal for the Kwickly POS ecosystem. This application is designed to be highly responsive, performant, and secure, catering to both **Super Admins** (managing the overall platform) and **Tenant Admins** (managing individual restaurant operations).

## 🚀 Tech Stack

*   **Framework:** React 19 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 + Shadcn UI
*   **Server State (API):** TanStack Query (React Query)
*   **Client State:** Zustand
*   **Routing:** React Router v6
*   **Package Manager:** Bun

## ✨ Key Features

- **🔐 Secure Authentication:** JWT-based stateless authentication, automatic token refresh logic, and strict Role-Based Access Control (RBAC) route guarding.
- **🍽️ Core Restaurant Management:** Intuitive UI for managing Staff roles, comprehensive Menu catalogs (categories, items, modifier groups), and complex Meal Combos.
- **🔥 Live KDS (Kitchen Display System):** A zero-latency, native WebSocket-powered Kanban board providing real-time synchronization between the POS and kitchen staff.
- **📊 Advanced Operations:** Daily revenue analytics dashboard, dynamic routing, and global branch configuration settings.

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed.

### Installation

1. Clone the repository and navigate into the folder:
   ```bash
   cd kwickly-admin-web
   ```
2. Install the dependencies:
   ```bash
   bun install
   ```

### Running Locally

To start the Vite development server:
```bash
bun run dev
```
The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components
│   ├── ui/          # Shadcn primitives (buttons, inputs, dialogs)
│   └── shared/      # Custom composite components
├── features/        # Feature-sliced modules (auth, menus, staff)
├── hooks/           # Custom React hooks
├── layouts/         # Layout wrappers (e.g., AppShell with Sidebar)
├── lib/             # Utilities (API client, Shadcn tailwind merger)
├── pages/           # High-level route components
└── store/           # Zustand stores (useAuth, useTheme)
```

## 📖 Documentation

For full architectural context and an up-to-date roadmap/progress tracker, please refer to the primary documentation file:
- [`docs/project-context.md`](./docs/project-context.md)

## 🎨 Theme & Aesthetics

The dashboard utilizes a premium **Slate/Zinc** base with **Indigo/Blue** accents, optimized for high legibility in fast-paced restaurant environments. Both Light and Dark modes are fully supported out of the box via the `ThemeProvider`.
