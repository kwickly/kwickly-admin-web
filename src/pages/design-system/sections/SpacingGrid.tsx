function SpacingBlock({ label, px }: { label: string; px: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 shrink-0 text-xs font-mono text-muted-foreground">{label}</div>
      <div className="bg-secondary/20 rounded" style={{ width: px, height: '20px', minWidth: '2px' }} />
      <div className="text-xs text-muted-foreground">{px}</div>
    </div>
  );
}

function RadiusBlock({ label, cls, px }: { label: string; cls: string; px: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 bg-secondary/20 border-2 border-secondary/40 ${cls}`} />
      <div className="text-center">
        <p className="text-xs font-mono text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{px}</p>
      </div>
    </div>
  );
}

export function SpacingGrid() {
  return (
    <div className="space-y-10">

      {/* 8pt Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">8-Point Grid System</h3>
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            All margins, paddings, and heights must be multiples of 8px. In Tailwind v4 with default spacing scale (1 unit = 4px), every spacing value must be a multiple of 2.
          </p>
          <SpacingBlock label="gap-2 / p-2" px="8px" />
          <SpacingBlock label="gap-4 / p-4" px="16px" />
          <SpacingBlock label="gap-6 / p-6 / mb-6" px="24px" />
          <SpacingBlock label="gap-8 / mb-8" px="32px" />
          <SpacingBlock label="gap-12 / py-12" px="48px" />
          <SpacingBlock label="gap-16 / py-16" px="64px" />
        </div>
      </div>

      {/* Touch Targets */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Touch Target Sizes (Apple HIG + KDS)</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-6">
            POS interfaces are used on tablets. All interactive elements must meet minimum touch targets.
          </p>
          <div className="flex items-end gap-8 flex-wrap">
            {/* 36px - icon-xs button */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-muted border border-border/50 rounded-md flex items-center justify-center text-[10px] font-mono text-muted-foreground"
                style={{ width: 36, height: 36 }}>
                36px
              </div>
              <p className="text-xs text-muted-foreground text-center">icon-xs<br />h-8 / w-8</p>
            </div>
            {/* 44px - standard minimum */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-secondary/10 border-2 border-secondary/20 rounded-md flex items-center justify-center text-xs font-bold font-mono text-secondary"
                style={{ width: 44, height: 44 }}>
                44px
              </div>
              <p className="text-xs font-semibold text-primary text-center">Min. Standard<br />h-11 / min-h-[44px]</p>
            </div>
            {/* 56px - KDS */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-info/10 border-2 border-info/30 rounded-md flex items-center justify-center text-xs font-bold font-mono text-info"
                style={{ width: 56, height: 56 }}>
                56px
              </div>
              <p className="text-xs font-semibold text-info text-center">KDS Minimum<br />h-14 / min-h-[56px]</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-mono font-semibold">h-9 (36px)</span> — icon-xs, small actions
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-mono font-semibold">h-11 (44px)</span> — default buttons, nav items, form inputs
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="text-info font-mono font-semibold">min-h-[56px] (56px)</span> — KDS kanban actions, critical POS buttons
            </p>
          </div>
        </div>
      </div>

      {/* Border Radius Scale */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Border Radius Scale (--radius: 0.5rem)</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-end gap-8 flex-wrap">
            <RadiusBlock label="rounded-sm" cls="rounded-sm" px="calc(0.5rem - 4px)" />
            <RadiusBlock label="rounded-md" cls="rounded-md" px="calc(0.5rem - 2px)" />
            <RadiusBlock label="rounded-lg" cls="rounded-lg" px="0.5rem" />
            <RadiusBlock label="rounded-xl ★" cls="rounded-xl" px="calc(0.5rem + 4px)" />
            <RadiusBlock label="rounded-2xl" cls="rounded-2xl" px="1rem" />
            <RadiusBlock label="rounded-full" cls="rounded-full" px="9999px" />
          </div>
          <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
            <span className="text-primary font-semibold">★ rounded-xl</span> is the canonical card border radius. Do not use{' '}
            <span className="font-mono">rounded-lg</span> or <span className="font-mono">rounded-2xl</span> on cards.
          </p>
        </div>
      </div>

      {/* Content Max Width */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Width Constraint</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="relative">
            <div className="bg-muted rounded border border-border/50 h-8 w-full" />
            <div className="bg-secondary/10 border-2 border-secondary/20 rounded h-8 absolute top-0 left-0 flex items-center justify-center"
              style={{ maxWidth: '100%', width: 'min(100%, 896px)' }}>
              <span className="text-xs font-mono text-primary font-semibold">max-w-7xl (1280px) — Page Content Container</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            All page content areas use <span className="font-mono text-primary"></span> to prevent eye-travel fatigue on ultrawide monitors.
          </p>
        </div>
      </div>

    </div>
  );
}
