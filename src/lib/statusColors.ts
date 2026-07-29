/**
 * statusColors.ts — Kwickly Design System v3
 *
 * Central status → Tailwind token class mapping.
 * ALL status badge, state indicator, and lifecycle color logic MUST
 * live here. No component should define its own ternary color logic
 * for semantic states.
 *
 * Token cheat-sheet:
 *   bg-success-subtle text-success border-success/20    → positive/done/active
 *   bg-warning-subtle text-warning border-warning/20    → in-progress/attention
 *   bg-destructive-subtle text-destructive               → error/danger/revoked
 *   bg-info-subtle text-info                             → neutral/new/unknown
 *   bg-kds-* text-kds-*                                  → KDS lifecycle states
 *
 * See: docs/frontend-and-ux/2026-06-28-theme-system-v2/theme-system.md §20-21
 */

// ─────────────────────────────────────────────────────────────────────────────
// Order Status (Orders.tsx, POS order listing)
// ─────────────────────────────────────────────────────────────────────────────
export const orderStatusClass: Record<string, string> = {
  completed:   'bg-success-subtle text-success border-success/20',
  delivered:   'bg-success-subtle text-success border-success/20',
  ready:       'bg-success-subtle text-success border-success/20',
  pending:     'bg-warning-subtle text-warning border-warning/20',
  in_progress: 'bg-warning-subtle text-warning border-warning/20',
  preparing:   'bg-warning-subtle text-warning border-warning/20',
  cancelled:   'bg-destructive-subtle text-destructive border-destructive/20',
  refunded:    'bg-destructive-subtle text-destructive border-destructive/20',
  new:         'bg-info-subtle text-info border-info/20',
  placed:      'bg-info-subtle text-info border-info/20',
};

export const getOrderStatusClass = (status: string): string =>
  orderStatusClass[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';

// ─────────────────────────────────────────────────────────────────────────────
// Support Ticket Status & Priority (SupportTickets.tsx, TicketThreadModal.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const ticketStatusClass: Record<string, string> = {
  OPEN:        'bg-info-subtle text-info border-info/20',
  IN_PROGRESS: 'bg-warning-subtle text-warning border-warning/20',
  RESOLVED:    'bg-success-subtle text-success border-success/20',
  CLOSED:      'bg-muted text-muted-foreground border-border',
};

export const getTicketStatusClass = (status: string): string =>
  ticketStatusClass[status] ?? 'bg-muted text-muted-foreground border-border';

export const ticketPriorityClass: Record<string, string> = {
  LOW:    'bg-muted text-muted-foreground border-border',
  MEDIUM: 'bg-warning-subtle text-warning border-warning/20',
  HIGH:   'bg-destructive-subtle text-destructive border-destructive/20',
  URGENT: 'bg-destructive text-destructive-foreground border-destructive',
};

export const getTicketPriorityClass = (priority: string): string =>
  ticketPriorityClass[priority] ?? 'bg-muted text-muted-foreground';

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Status Codes (PlatformAuditLogs.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const getHttpStatusClass = (status: number): string => {
  if (status >= 200 && status < 300) return 'bg-success-subtle text-success border-success/20';
  if (status >= 300 && status < 400) return 'bg-info-subtle text-info border-info/20';
  if (status >= 400 && status < 500) return 'bg-warning-subtle text-warning border-warning/20';
  if (status >= 500) return 'bg-destructive-subtle text-destructive border-destructive/20';
  return 'bg-muted text-muted-foreground border-border';
};

// ─────────────────────────────────────────────────────────────────────────────
// Device Status (DeviceManagement.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const deviceStatusClass: Record<string, string> = {
  ACTIVE:   'bg-success-subtle text-success border-success/20',
  INACTIVE: 'bg-muted text-muted-foreground border-border',
  REVOKED:  'bg-destructive-subtle text-destructive border-destructive/20',
};

export const getDeviceStatusClass = (status: string): string =>
  deviceStatusClass[status] ?? 'bg-muted text-muted-foreground border-border';

// ─────────────────────────────────────────────────────────────────────────────
// Wallet / Financial Transactions (WalletTransactions.tsx, CustomerDetails.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const transactionTypeClass: Record<string, { badge: string; amount: string }> = {
  CREDIT: {
    badge:  'bg-success-subtle text-success border-success/20',
    amount: 'text-success',
  },
  DEBIT: {
    badge:  'bg-destructive-subtle text-destructive border-destructive/20',
    amount: 'text-destructive',
  },
};

export const getTransactionTypeClass = (type: string) =>
  transactionTypeClass[type] ?? {
    badge:  'bg-muted text-muted-foreground border-border',
    amount: 'text-muted-foreground',
  };

// ─────────────────────────────────────────────────────────────────────────────
// KDS Order Card States (Kds.tsx)
// Named by operational urgency — NOT generic semantic color.
// See theme-system.md §21 for naming philosophy.
// ─────────────────────────────────────────────────────────────────────────────
export const kdsStatusClass: Record<string, string> = {
  new:     'bg-kds-new/10 text-kds-new border-kds-new/20',
  cooking: 'bg-kds-cooking/10 text-kds-cooking border-kds-cooking/20',
  late:    'bg-kds-late/10 text-kds-late border-kds-late/20 animate-pulse',
  done:    'bg-kds-done/10 text-kds-done border-kds-done/20',
};

export const getKdsStatusClass = (status: string): string =>
  kdsStatusClass[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';

// ─────────────────────────────────────────────────────────────────────────────
// Generic Active/Inactive (Ads.tsx, CampaignLogs.tsx, Discounts.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const activeStatusClass: Record<string, string> = {
  ACTIVE:   'bg-success-subtle text-success border-success/20',
  INACTIVE: 'bg-muted text-muted-foreground border-border',
  SENT:     'bg-success-subtle text-success border-success/20',
  DRAFT:    'bg-muted text-muted-foreground border-border',
  PAUSED:   'bg-warning-subtle text-warning border-warning/20',
  EXPIRED:  'bg-muted text-muted-foreground border-border',
};

export const getActiveStatusClass = (status: string): string =>
  activeStatusClass[status] ?? 'bg-muted text-muted-foreground border-border';

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Stock Level (InventoryAnalytics.tsx, Stock.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const getStockLevelClass = (
  quantity: number,
  lowThreshold: number,
  criticalThreshold: number
): { text: string; bg: string; border: string } => {
  if (quantity <= criticalThreshold) {
    return { text: 'text-destructive', bg: 'bg-destructive-subtle', border: 'border-destructive/20' };
  }
  if (quantity <= lowThreshold) {
    return { text: 'text-warning', bg: 'bg-warning-subtle', border: 'border-warning/20' };
  }
  return { text: 'text-success', bg: 'bg-success-subtle', border: 'border-success/20' };
};

// ─────────────────────────────────────────────────────────────────────────────
// Revenue / Trend Direction (RevenueAnalytics.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const trendClass = {
  positive: 'bg-success-subtle text-success border-success/20',
  negative: 'bg-destructive-subtle text-destructive border-destructive/20',
  neutral:  'bg-warning-subtle text-warning border-warning/20',
};

export const getTrendTextClass = (isPositive: boolean): string =>
  isPositive ? 'text-success' : 'text-destructive';
