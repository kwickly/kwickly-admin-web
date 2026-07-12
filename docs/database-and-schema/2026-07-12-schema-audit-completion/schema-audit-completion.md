# Schema Audit & Reset Completion

Following the comprehensive audit requested by the platform engineering team to adhere to strict SaaS industry standards, the `kwickly-api` database schema underwent a massive refactoring on July 12, 2026.

## Major Achievements

### 1. Zero Hard-Deletes Standard
The concept of a `SQL DELETE` has been eradicated for all operational data (e.g. Menu Items, Staff, Orders, etc.).
Every single operational table in `kwickly-api/src/db/schema/*` was audited and updated to include a `deletedAt` timestamp. All APIs will now logically filter using this column.

### 2. Tenant Lifecycle (Status Enums)
The outdated `isActive: boolean` on the `tenants` table was migrated to `tenantStatusEnum` (`ACTIVE`, `SUSPENDED`, `TERMINATED`). 
We also introduced `suspendedAt` and `terminatedAt` columns, paving the way for Platform Owners to enforce Terms of Service or billing restrictions correctly, rather than relying on an ambiguous boolean flag.

### 3. Multi-Tenant Indexing (`idxTenant`)
To support scaling to hundreds of restaurant branches on a single PostgreSQL cluster, an `idxTenant` B-tree index was automatically mapped onto the `tenantId` column of all associated tables. This ensures rapid row retrieval and isolates tenant data from accidental full table scans.

### 4. Seed and Migration Reset
Because the transition from boolean flags to enums inherently involves data-loss or complex manual SQL `USING` casts, the decision was made to wipe the development database (`drizzle` migration folder & `public` postgres schema) entirely. A fresh initialization and data seeding process was successfully completed without breaking the ORM bindings.
