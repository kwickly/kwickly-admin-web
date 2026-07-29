import { Icons } from '@/components/shared/icons';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePlatformMetrics } from "@/hooks/api/usePlatform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardKPISkeleton, ChartSkeleton } from "@/components/ui/loaders";
import { PageHeader } from "@/components/ui/page-header";

export default function PlatformDashboard() {
  const { data: metrics, isLoading } = usePlatformMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <PageHeader 
          title="Platform Overview" 
          description="Monitor global SaaS subscriptions, platform orders, and system-wide performance."
          icon={Icons.LayoutDashboard}
        />
        <DashboardKPISkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ChartSkeleton /></div>
        </div>
      </div>
    );
  }

  const planData = metrics
    ? [
        { name: "Free", value: metrics.planBreakdown.FREE, fill: "var(--chart-3)" },
        { name: "Starter", value: metrics.planBreakdown.STARTER, fill: "var(--warning)" },
        { name: "Growth", value: metrics.planBreakdown.GROWTH, fill: "var(--chart-1)" },
        { name: "Enterprise", value: metrics.planBreakdown.ENTERPRISE, fill: "var(--chart-5)" },
      ].filter(d => d.value > 0)
    : [];

  const trendData = [
    { name: "Jan", tenants: 2 },
    { name: "Feb", tenants: 3 },
    { name: "Mar", tenants: 4 },
    { name: "Apr", tenants: 5 },
    { name: "May", tenants: metrics?.totalTenants || 6 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader 
        title="Platform Overview" 
        description="Monitor global SaaS subscriptions, platform orders, and system-wide performance."
        icon={Icons.LayoutDashboard}
      />

      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border shadow-sm hover:shadow-sm transition-shadow relative overflow-hidden group">
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">Total Tenants</CardTitle>
            <div className="p-2">
              <Icons.Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums font-mono truncate">{metrics?.totalTenants}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 truncate">
              <span className="text-success font-medium">+12% MoM</span>
              <span className="text-muted-foreground/50 mx-2">•</span>
              <span className="text-muted-foreground flex items-center truncate"><Icons.TrendingUp className="h-3 w-3 mr-0.5 shrink-0"/> {metrics?.activeTenants} active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-sm transition-shadow relative overflow-hidden group">
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">Platform Users</CardTitle>
            <div className="p-2">
              <Icons.Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums font-mono truncate">{metrics?.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 truncate">
              <span className="text-success font-medium">+8% MoM</span>
              <span className="text-muted-foreground/50 mx-2">•</span>
              <span className="truncate">Staff & customers</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-sm transition-shadow relative overflow-hidden group">
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">Total Orders</CardTitle>
            <div className="p-2">
              <Icons.Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums font-mono truncate">{metrics?.totalOrdersProcessed}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 truncate">
              <span className="text-success font-medium">+24% MoM</span>
              <span className="text-muted-foreground/50 mx-2">•</span>
              <span className="truncate">Across all branches</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-sm transition-shadow relative overflow-hidden group">
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground truncate">Platform GMV</CardTitle>
            <div className="p-2">
              <Icons.DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums font-mono truncate">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(metrics?.platformGMV || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2 truncate">
              <span className="text-success font-medium">+18.5% MoM</span>
              <span className="text-muted-foreground/50 mx-2">•</span>
              <span className="truncate">Total transaction volume</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border shadow-sm relative overflow-hidden">

          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Icons.TrendingUp className="h-5 w-5 text-muted-foreground" />
              Tenant Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--popover-foreground)' }}
                  itemStyle={{color: 'var(--popover-foreground)'}}
                />
                <Area type="monotone" dataKey="tenants" stroke="var(--chart-1)" strokeWidth={3} fillOpacity={1} fill="url(#colorTenants)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--chart-1)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Icons.Building className="h-5 w-5 text-muted-foreground" />
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative">
            {planData.length === 0 ? (
              <div className="text-muted-foreground text-sm">No plan data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'}} 
                    itemStyle={{color: 'var(--popover-foreground)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center Label inside Pie */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums font-mono">{metrics?.totalTenants}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </CardContent>
          <div className="flex justify-center gap-x-6 gap-y-4 pb-6 flex-wrap px-4">
            {planData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-full border border-border">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-xs font-medium text-foreground">{entry.name} <span className="text-muted-foreground ml-2">({entry.value})</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
