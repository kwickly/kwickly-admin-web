import { Icons } from '@/components/shared/icons';
import { useState } from 'react';
import {
  TableSkeleton,
  GridCardSkeleton,
  DashboardKPISkeleton,
  ChartSkeleton,
  FormSkeleton,
} from '@/components/ui/loaders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function FeedbackOverlays() {
  const [showModal, setShowModal] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  return (
    <div className="space-y-10">

      {/* Skeleton Loaders */}
      <div className="space-y-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skeleton Loaders</h3>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">TableSkeleton</p>
          <div className="bg-card rounded-xl border border-border p-4 overflow-hidden">
            <TableSkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">FormSkeleton</p>
          <div className="bg-card rounded-xl border border-border p-6">
            <FormSkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">DashboardKPISkeleton</p>
          <div className="bg-card rounded-xl border border-border p-6">
            <DashboardKPISkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">ChartSkeleton</p>
          <div className="bg-card rounded-xl border border-border p-6">
            <ChartSkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">GridCardSkeleton</p>
          <div className="bg-card rounded-xl border border-border p-6">
            <GridCardSkeleton />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">Skeleton primitive (inline)</p>
          <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Toast — Sonner */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Toast (Sonner)</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => toast.success('Branch details saved successfully')}>
              <Icons.CheckCircle2 className="h-4 w-4 text-success" />
              toast.success
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.error('Failed to save branch details')}>
              <Icons.AlertCircle className="h-4 w-4 text-destructive" />
              toast.error
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info('Theme Published!', { description: 'Your theme has been saved and applied to the tenant.' })}>
              <Icons.Bell className="h-4 w-4" />
              toast (info)
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.loading('Saving changes...')}>
              <Icons.Loader2 className="h-4 w-4 animate-spin" />
              toast.loading
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            from 'sonner' · toast.success · toast.error · toast.loading · auto-dismiss
          </p>
        </div>
      </div>

      {/* Modal / Dialog — from FloorView.tsx exact pattern */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Modal Overlay <span className="normal-case font-normal text-muted-foreground/70">(from FloorView.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <Button onClick={() => setShowModal(true)}>
            <Icons.Plus className="h-4 w-4" />
            Open Modal
          </Button>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            fixed inset-0 z-50 · bg-background/80 backdrop-blur-sm overlay · animate-in zoom-in-95 content
          </p>
        </div>
      </div>

      {/* Loading Pulse animation — from FloorView skeleton */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Inline Pulse Skeleton <span className="normal-case font-normal text-muted-foreground/70">(from FloorView.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 rounded-lg bg-muted/50 animate-pulse border border-border/50" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono">h-40 rounded-lg bg-muted/50 animate-pulse border border-border/50</p>
        </div>
      </div>

      {/* Sheet — side panel from AppShell */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sheet (Side Panel)</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <Button variant="outline" onClick={() => setShowSheet(true)}>
            <Icons.PanelLeftIcon className="h-4 w-4" />
            Open Sheet
          </Button>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            fixed inset-y-0 right-0 z-50 · w-80 bg-card border-l border-border · animate-in slide-in-from-right
          </p>
        </div>
      </div>

      {/* Modal implementation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-xl shadow-sm w-full max-w-md p-6 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-jakarta text-foreground">New Table</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
                <Icons.X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Table Name</label>
                <input
                  type="text"
                  placeholder="e.g. Table 1, Patio 4"
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheet implementation */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowSheet(false)} />
          <div className="relative ml-auto w-80 bg-card border-l border-border shadow-xl h-full animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Side Panel</h3>
              <button onClick={() => setShowSheet(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground cursor-pointer">
                <Icons.X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">Side panels are used for filters, quick-edit forms, and command menus.</p>
              <div className="bg-muted rounded-lg p-4 text-xs font-mono text-muted-foreground">
                fixed inset-y-0 right-0 z-50<br />
                w-80 bg-card border-l border-border<br />
                animate-in slide-in-from-right
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
