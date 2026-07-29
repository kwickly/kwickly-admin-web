export function Typography() {
  return (
    <div className="space-y-10">

      {/* Font Stacks */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Stacks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-xs text-muted-foreground mb-2 font-mono">--font-sans · Poppins</p>
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The quick brown fox
            </p>
            <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              UI, body copy, headings. Used across all admin pages.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-xs text-muted-foreground mb-2 font-mono">--font-serif · Source Serif 4</p>
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Source Serif 4', serif" }}>
              The quick brown fox
            </p>
            <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Source Serif 4', serif" }}>
              Editorial content, reports.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-xs text-muted-foreground mb-2 font-mono">--font-mono · JetBrains Mono</p>
            <p className="text-2xl font-bold text-foreground font-mono">
              var(--primary)
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Code snippets, token values, IDs.
            </p>
          </div>
        </div>
      </div>

      {/* Type Scale */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type Scale</h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {[
            { cls: 'text-4xl font-bold tracking-tight', label: 'text-4xl / 36px', sample: 'Dashboard Overview' },
            { cls: 'text-3xl font-bold tracking-tight', label: 'text-3xl / 30px', sample: 'Table Management' },
            { cls: 'text-2xl font-bold', label: 'text-2xl / 24px', sample: 'Employee Directory' },
            { cls: 'text-xl font-semibold', label: 'text-xl / 20px', sample: 'Revenue Last 7 Days' },
            { cls: 'text-lg font-semibold', label: 'text-lg / 18px', sample: 'Interactive Elements' },
            { cls: 'text-base font-medium', label: 'text-base / 16px', sample: 'Branch Name' },
            { cls: 'text-sm font-medium', label: 'text-sm / 14px', sample: 'Manage your employees and basic information.' },
            { cls: 'text-xs font-medium', label: 'text-xs / 12px', sample: 'STATUS · ACTIVE · PLAN: GROWTH' },
            { cls: 'text-[10px] font-mono', label: 'text-[10px] / 10px', sample: '--primary · oklch(0.551 0.203 26.6)' },
          ].map(({ cls, label, sample }) => (
            <div key={label} className="flex items-baseline gap-6 p-4">
              <span className="text-xs text-muted-foreground font-mono w-40 shrink-0">{label}</span>
              <span className={`text-foreground ${cls}`}>{sample}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font Weights (Poppins)</h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {[
            { weight: 'font-normal', label: 'font-normal / 400', sample: 'Regular body text and descriptions' },
            { weight: 'font-medium', label: 'font-medium / 500', sample: 'Label text, nav items, subtle emphasis' },
            { weight: 'font-semibold', label: 'font-semibold / 600', sample: 'Section headings, card titles' },
            { weight: 'font-bold', label: 'font-bold / 700', sample: 'Page titles, KPI values, primary CTAs' },
          ].map(({ weight, label, sample }) => (
            <div key={weight} className="flex items-center gap-6 p-4">
              <span className="text-xs text-muted-foreground font-mono w-40 shrink-0">{label}</span>
              <span className={`text-base text-foreground ${weight}`}>{sample}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Text Colors */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Semantic Text Colors</h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {[
            { cls: 'text-foreground font-medium', token: 'text-foreground', usage: 'Primary content — page titles, data cells, labels' },
            { cls: 'text-muted-foreground', token: 'text-muted-foreground', usage: 'Secondary text — descriptions, helper text, placeholders' },
            { cls: 'text-primary font-medium', token: 'text-primary', usage: 'Brand accent — links, active states, icon accents' },
            { cls: 'text-destructive font-medium', token: 'text-destructive', usage: 'Error / destructive actions' },
            { cls: 'text-success font-medium', token: 'text-success', usage: 'Success states, available status' },
            { cls: 'text-warning font-medium', token: 'text-warning', usage: 'Warning / occupied status' },
            { cls: 'text-info font-medium', token: 'text-info', usage: 'Info / in-progress status' },
          ].map(({ cls, token, usage }) => (
            <div key={token} className="flex items-center gap-6 p-4">
              <span className="text-xs text-muted-foreground font-mono w-40 shrink-0">{token}</span>
              <span className={`text-sm ${cls} flex-1`}>{usage}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
