

function PatternAnnotation({ label, direction }: { label: string; direction?: string }) {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-2 bg-secondary/90 text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
      {label}
      {direction && <span className="opacity-70">{direction}</span>}
    </div>
  );
}

export function PagePatterns() {
  return (
    <div className="space-y-10">

      {/* F-Pattern — Table / Dashboard pages */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">F-Pattern — Tables & Dashboards</h3>
        <p className="text-xs text-muted-foreground">
          Users scan: <strong>1. Top horizontal row</strong> → <strong>2. Second horizontal scan</strong> → <strong>3. Vertical scan down the left</strong>.
          Headers and key data must be left-aligned.
        </p>
        <div className="relative bg-muted/30 rounded-xl border border-border p-4 space-y-2 overflow-hidden">
          <PatternAnnotation label="F-Pattern" direction="→ ↓" />

          {/* Page header row — horizontal scan 1 */}
          <div className="flex items-center justify-between bg-card rounded-xl border border-border px-4 py-4 ring-2 ring-secondary/30">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-secondary/40 rounded" />
              <div className="h-3 w-40 bg-foreground/30 rounded-sm" />
            </div>
            <div className="h-8 w-24 bg-secondary/20 rounded-md border border-secondary/20" />
          </div>

          {/* Table header row — horizontal scan 2 */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-5 gap-0 bg-muted/50 px-4 py-2 border-b border-border ring-1 ring-info/20">
              {['Name', 'Role', 'Branch', 'Status', 'Actions'].map(h => (
                <div key={h} className="h-3 w-12 bg-muted-foreground/40 rounded-sm" />
              ))}
            </div>
            {/* Data rows — left-edge vertical scan */}
            {[1, 2, 3].map(i => (
              <div key={i} className={`grid grid-cols-5 gap-0 px-4 py-2.5 border-b border-border/50 ${i === 1 ? 'ring-1 ring-info/10' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-secondary/10 rounded-full shrink-0" />
                  <div className="h-2.5 w-16 bg-foreground/20 rounded-sm" />
                </div>
                <div className="h-2.5 w-14 bg-foreground/15 rounded-sm self-center" />
                <div className="h-2.5 w-16 bg-foreground/15 rounded-sm self-center" />
                <div className="h-5 w-16 bg-success/10 rounded-full self-center" />
                <div className="flex gap-2 self-center">
                  <div className="h-6 w-6 bg-muted rounded" />
                  <div className="h-6 w-6 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* F-arrows overlay */}
          <div className="flex gap-2 mt-2">
            <div className="h-0.5 flex-1 bg-secondary/40 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-0.5 w-2/3 bg-secondary/30 rounded" />
          </div>
          <div className="flex">
            <div className="w-0.5 h-6 bg-secondary/20 rounded" />
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Used in: StaffDirectory · FloorView · MenuManagement · OrdersPage</p>
      </div>

      {/* Z-Pattern — Login page */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Z-Pattern — Login & Landing Pages</h3>
        <p className="text-xs text-muted-foreground">
          Eyes travel: <strong>Logo (TL)</strong> → <strong>Tagline (TR)</strong> → <strong>diagonal ↘</strong> → <strong>CTA (BL)</strong> → <strong>Sign in (BR)</strong>.
          Brand on left, form on right.
        </p>
        <div className="relative bg-muted/30 rounded-xl border border-border overflow-hidden">
          <PatternAnnotation label="Z-Pattern" direction="↗↙" />
          {/* Mimics Login.tsx layout exactly */}
          <div className="flex min-h-[280px]">
            {/* Left: bg-primary hero */}
            <div className="flex-1 bg-secondary p-6 relative overflow-hidden flex flex-col">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center gap-2">
                <div className="h-7 w-7 bg-secondary-foreground/20 rounded-md flex items-center justify-center">
                  <span className="text-secondary-foreground text-xs font-bold">K</span>
                </div>
                <span className="text-secondary-foreground text-sm font-bold">Kwickly</span>
              </div>
              <div className="relative z-10 mt-auto mb-4">
                <div className="h-3 w-48 bg-secondary-foreground/60 rounded-sm mb-2" />
                <div className="h-2 w-40 bg-secondary-foreground/40 rounded-sm" />
              </div>
            </div>
            {/* Right: auth form card */}
            <div className="flex-1 flex items-center justify-center p-6 bg-background">
              <div className="w-full max-w-[260px] bg-card rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border/50 p-6">
                <div className="text-center mb-4">
                  <div className="h-3 w-16 bg-foreground/30 rounded-sm mx-auto mb-2" />
                  <div className="h-2 w-28 bg-muted-foreground/30 rounded-sm mx-auto" />
                </div>
                <div className="space-y-4">
                  <div className="h-9 bg-muted/60 rounded-md border border-border/50" />
                  <div className="h-9 bg-muted/60 rounded-md border border-border/50" />
                  <div className="h-9 bg-secondary/20 rounded-md border border-secondary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Used in: Login.tsx · ForgotPassword.tsx · ResetPassword.tsx</p>
      </div>

      {/* T-Pattern — KDS Kanban */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">T-Pattern — KDS Kanban Board</h3>
        <p className="text-xs text-muted-foreground">
          Users scan the <strong>top bar</strong> for status columns, then dive <strong>vertically</strong> into individual columns.
          Column headers must be fixed. Ticket cards stack vertically.
        </p>
        <div className="relative bg-muted/30 rounded-xl border border-border p-4 overflow-hidden">
          <PatternAnnotation label="T-Pattern" direction="→ ↓" />

          {/* KDS Column Header Bar */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'New Orders', color: 'bg-warning/10 border-warning/30 text-warning', count: '3' },
              { label: 'In Kitchen', color: 'bg-info/10 border-info/30 text-info', count: '5' },
              { label: 'Ready', color: 'bg-success/10 border-success/30 text-success', count: '2' },
            ].map(({ label, color, count }) => (
              <div key={label} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${color}`}>
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-xs font-bold font-mono">{count}</span>
              </div>
            ))}
          </div>

          {/* KDS Ticket Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              {[{ table: 'T-4', items: 2, time: '3 min' }, { table: 'T-7', items: 4, time: '8 min' }].map(({ table, items, time }) => (
                <div key={table} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-foreground font-mono">{table}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">{time}</span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: items }).map((_, i) => (
                      <div key={i} className="h-2 bg-muted rounded-sm" />
                    ))}
                  </div>
                  <button className="w-full mt-2 py-2.5 bg-warning/10 text-warning text-[10px] font-semibold rounded-md">
                    Start Cooking
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[{ table: 'T-1', items: 3, time: '12 min' }, { table: 'T-2', items: 2, time: '15 min' }, { table: 'T-9', items: 1, time: '18 min' }].map(({ table, items, time }) => (
                <div key={table} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-foreground font-mono">{table}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${parseInt(time) > 14 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-warning/10 text-warning'}`}>{time}</span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: items }).map((_, i) => (
                      <div key={i} className="h-2 bg-muted rounded-sm" />
                    ))}
                  </div>
                  <button className="w-full mt-2 py-2.5 bg-info/10 text-info text-[10px] font-semibold rounded-md">
                    Mark Ready
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[{ table: 'T-3', items: 2, time: '19 min' }, { table: 'T-6', items: 3, time: '22 min' }].map(({ table, items, time }) => (
                <div key={table} className="bg-card rounded-xl border border-success/20 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-foreground font-mono">{table}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">{time}</span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: items }).map((_, i) => (
                      <div key={i} className="h-2 bg-success/10 rounded-sm" />
                    ))}
                  </div>
                  <button className="w-full mt-2 py-2.5 bg-success/10 text-success text-[10px] font-semibold rounded-md">
                    Serve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Used in: Kds.tsx (Kitchen Display System)</p>
      </div>

    </div>
  );
}
