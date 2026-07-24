# Centralized Icons Configuration

## Overview
On July 24, 2026, we refactored the entire `kwickly-admin-web` repository to use a centralized icon dictionary.

## Problem
Previously, individual components imported icons directly from `lucide-react`. This resulted in inconsistencies across the platform (e.g., using `ShoppingCart` in one place and `ShoppingBag` in another for the same concept). It also made it difficult to swap out an icon globally.

## Solution
1. **Central Dictionary**: Created `src/components/shared/icons.tsx`. This file exports 150+ Lucide icons under a unified `Icons` object.
2. **Global Refactor**: A transformation script was run to replace direct imports with `import { Icons } from '@/components/shared/icons'`.
3. **Usage Pattern**: Components now access icons dynamically (e.g. `<Icons.Dashboard />` or `<Icons.Users />`).

This ensures that any future changes to platform iconography only need to be updated in one single file.
