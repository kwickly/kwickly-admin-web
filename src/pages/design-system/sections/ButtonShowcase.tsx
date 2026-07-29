import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

export function ButtonShowcase() {
  return (
    <div className="space-y-8">

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variants</h3>
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          {[
            { variant: 'default' as const, label: 'default', usage: 'Primary CTAs — Add Item, Save Changes, Submit' },
            { variant: 'outline' as const, label: 'outline', usage: 'Secondary actions — Export, Filter, Cancel' },
            { variant: 'secondary' as const, label: 'secondary', usage: 'Tertiary actions — View Details, Less important' },
            { variant: 'ghost' as const, label: 'ghost', usage: 'Nav items, icon actions in table rows' },
            { variant: 'destructive' as const, label: 'destructive', usage: 'Delete, Cancel Order, Remove (always confirm first)' },
            { variant: 'link' as const, label: 'link', usage: 'In-text links, breadcrumbs, see all' },
          ].map(({ variant, label, usage }) => (
            <div key={variant} className="flex items-center gap-6">
              <div className="w-32 shrink-0">
                <Button variant={variant}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Button>
              </div>
              <div>
                <span className="text-xs font-mono text-muted-foreground">variant="{label}"</span>
                <p className="text-xs text-muted-foreground mt-0.5">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sizes</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-end gap-4 flex-wrap">
            {[
              { size: 'sm' as const, label: 'sm / h-8', icon: false },
              { size: 'default' as const, label: 'default / h-9', icon: false },
              { size: 'lg' as const, label: 'lg / h-11 (44px ✓)', icon: false },
              { size: 'icon-xs' as const, label: 'icon-xs / 32px', icon: true },
              { size: 'icon-sm' as const, label: 'icon-sm / 36px', icon: true },
              { size: 'icon' as const, label: 'icon / 36px', icon: true },
              { size: 'icon-lg' as const, label: 'icon-lg / 44px ✓', icon: true },
            ].map(({ size, label, icon }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Button size={size}>
                  {icon ? <Icons.Settings className="h-4 w-4" /> : 'Action'}
                </Button>
                <span className="text-[10px] text-muted-foreground text-center font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* States */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">States</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <Button>Normal</Button>
              <span className="text-[10px] text-muted-foreground font-mono">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button disabled>Disabled</Button>
              <span className="text-[10px] text-muted-foreground font-mono">disabled</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button>
                <Icons.Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </Button>
              <span className="text-[10px] text-muted-foreground font-mono">Loading</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button>
                <Icons.Plus className="h-4 w-4" />
                With Icon
              </Button>
              <span className="text-[10px] text-muted-foreground font-mono">Icon + label</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline">
                <Icons.Download className="h-4 w-4" />
                Export
              </Button>
              <span className="text-[10px] text-muted-foreground font-mono">Outline + icon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw button pattern from FloorView.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Raw Button Pattern <span className="normal-case font-normal text-muted-foreground/70">(used in FloorView, Tables — not Shadcn)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-all active:scale-95 shadow-sm font-medium text-sm cursor-pointer">
              <Icons.Plus size={18} />
              <span>Add Table</span>
            </button>
            <button className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer">
              <Icons.QrCode size={16} />
            </button>
            <button className="p-2 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors cursor-pointer">
              <Icons.Edit2 size={16} />
            </button>
            <button className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer">
              <Icons.Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            {'bg-primary hover:bg-primary/90 · bg-info/10 text-info · bg-destructive/10 text-destructive'}
          </p>
        </div>
      </div>

    </div>
  );
}
