import { Badge } from '@/components/ui/badge';

export function BadgeShowcase() {
  return (
    <div className="space-y-8">

      {/* Shadcn Badge Variants */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge Variants (Shadcn CVA)</h3>
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          {[
            { variant: 'default' as const, label: 'default', usage: 'Primary highlight — Active plan, primary action' },
            { variant: 'secondary' as const, label: 'secondary', usage: 'Neutral info — Role label, category tag' },
            { variant: 'destructive' as const, label: 'destructive', usage: 'Error / cancelled states' },
            { variant: 'outline' as const, label: 'outline', usage: 'Bordered — ID reference, code snippet' },
            { variant: 'ghost' as const, label: 'ghost', usage: 'Subtle — hover states, secondary tags' },
          ].map(({ variant, label, usage }) => (
            <div key={variant} className="flex items-center gap-6">
              <div className="w-24 shrink-0">
                <Badge variant={variant}>{label.charAt(0).toUpperCase() + label.slice(1)}</Badge>
              </div>
              <div>
                <span className="text-xs font-mono text-muted-foreground">variant="{label}"</span>
                <p className="text-xs text-muted-foreground mt-0.5">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table / Floor Status Badges — from FloorView.tsx exact pattern */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Table Status Badges <span className="normal-case font-normal text-muted-foreground/70">(from FloorView.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-success/10 text-success dark:text-success/80">
              available
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-warning/10 text-warning dark:text-warning/80">
              occupied
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-info/10 text-info dark:text-info/80">
              cleaning
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              reserved
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {'px-2.5 py-1 rounded-full text-xs font-semibold bg-{status}/10 text-{status}'}
          </p>
        </div>
      </div>

      {/* Order Status Badges */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Status Badges (KDS)</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-warning/10 text-warning">
              New Order
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-info/10 text-info">
              In Kitchen
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-success/10 text-success">
              Ready
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              Completed
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
              Cancelled
            </span>
          </div>
        </div>
      </div>

      {/* Wait time urgency badges from Kds.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          KDS Wait-Time Urgency Badges <span className="normal-case font-normal text-muted-foreground/70">(from Kds.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-success/10 text-success">
              5 min
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-warning/10 text-warning">
              14 min
            </span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-destructive/10 text-destructive animate-pulse">
              24 min ⚠
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Green &lt;10 min · Amber 10–20 min · Red pulsing <span className="font-mono">animate-pulse</span> &gt;20 min
          </p>
        </div>
      </div>

      {/* Subscription Plan Badges */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan / Tier Badges</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline">FREE</Badge>
            <Badge variant="secondary">BASIC</Badge>
            <Badge variant="secondary">STARTER</Badge>
            <Badge>GROWTH</Badge>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-warning/10 text-warning">ENTERPRISE</span>
            <span className="px-2.5 py-2 rounded-full text-xs font-semibold bg-primary/10 text-primary">CUSTOM</span>
          </div>
        </div>
      </div>

    </div>
  );
}
