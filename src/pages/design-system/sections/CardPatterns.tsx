import { Icons } from '@/components/shared/icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const REVENUE_DATA_SAMPLE = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 1800 },
  { name: 'Wed', total: 1400 },
  { name: 'Thu', total: 2200 },
  { name: 'Fri', total: 3100 },
  { name: 'Sat', total: 4200 },
  { name: 'Sun', total: 1200 },
];
const maxVal = Math.max(...REVENUE_DATA_SAMPLE.map(d => d.total));

export function CardPatterns() {
  return (
    <div className="space-y-10">

      {/* KPI Card — exact pattern from TenantDashboard.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          KPI Metric Cards <span className="normal-case font-normal text-muted-foreground/70">(from TenantDashboard.tsx)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Icons.DollarSign className="h-6 w-6 text-muted-foreground" />, label: "Today's Revenue", value: '₹12,450.00', trend: '+8.4%' },
            { icon: <Icons.ShoppingCart className="h-6 w-6 text-muted-foreground" />, label: 'Total Orders', value: '84', trend: '+12 today' },
            { icon: <Icons.TrendingUp className="h-6 w-6 text-muted-foreground" />, label: 'Avg. Order Value', value: '₹148.21', trend: '-2.1%' },
            { icon: <Icons.Users className="h-6 w-6 text-muted-foreground" />, label: 'Active Staff', value: '6', trend: 'On shift' },
          ].map(({ icon, label, value, trend }) => (
            <div key={label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="p-4 bg-secondary/10 rounded-lg">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
                <h3 className="text-2xl font-bold text-foreground tabular-nums font-mono truncate">{value}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{trend}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          bg-card p-6 rounded-lg border border-border shadow-sm flex items-center gap-4 · icon: p-4 bg-secondary/10 rounded-lg
        </p>
      </div>

      {/* Chart Card — from TenantDashboard.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Chart Card <span className="normal-case font-normal text-muted-foreground/70">(from TenantDashboard.tsx)</span>
        </h3>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue (Last 7 Days)</h3>
          <div className="flex items-end gap-4 h-[160px]">
            {REVENUE_DATA_SAMPLE.map(({ name, total }) => (
              <div key={name} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(total / maxVal) * 130}px`,
                    background: 'var(--chart-1)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-4">fill="var(--chart-1)" · stroke="var(--border)"</p>
        </div>
      </div>

      {/* Shadcn Card Component */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shadcn Card Component (TenantBranding preview)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-border/50 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground tracking-tight">$45,231.89</div>
              <p className="text-xs mt-2 text-primary flex items-center font-semibold">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Interactive Elements</CardTitle>
              <CardDescription>Hover and click to test theme responses.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card content with description subtext using CardDescription component.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floor / Table Card — exact from FloorView.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Floor View Card <span className="normal-case font-normal text-muted-foreground/70">(from FloorView.tsx)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'Table 1', capacity: 4, status: 'available' },
            { name: 'Table 2', capacity: 6, status: 'occupied' },
            { name: 'Patio A', capacity: 2, status: 'cleaning' },
            { name: 'VIP Room', capacity: 12, status: 'reserved' },
          ].map((table) => (
            <div
              key={table.name}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-sm transition-all group flex flex-col justify-between h-48"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-jakarta text-foreground">{table.name}</h3>
                  <p className="text-sm text-muted-foreground">Capacity: {table.capacity}</p>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer" title="View QR">
                    <Icons.QrCode size={16} />
                  </button>
                  <button className="p-2 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors cursor-pointer" title="Edit">
                    <Icons.Edit2 size={16} />
                  </button>
                  <button className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer" title="Delete">
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  table.status === 'occupied' ? 'bg-warning/10 text-warning dark:text-warning/80' :
                  table.status === 'cleaning' ? 'bg-info/10 text-info dark:text-info/80' :
                  table.status === 'reserved' ? 'bg-muted text-muted-foreground' :
                  'bg-success/10 text-success dark:text-success/80'
                }`}>
                  {table.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          bg-card rounded-lg p-6 border border-border shadow-sm group h-48 · hover:opacity-100 action buttons
        </p>
      </div>

      {/* Empty State Card — from FloorView.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Empty State <span className="normal-case font-normal text-muted-foreground/70">(from FloorView.tsx)</span>
        </h3>
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-border shadow-sm">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <Icons.QrCode className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-bold font-jakarta text-foreground mb-2">No Tables Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">You haven't set up any tables for this branch yet. Add a table to generate QR codes.</p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-transform active:scale-95 shadow-sm cursor-pointer">
            Create First Table
          </button>
        </div>
      </div>

    </div>
  );
}
