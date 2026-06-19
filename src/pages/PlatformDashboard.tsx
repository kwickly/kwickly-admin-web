import { LayoutDashboard, Building, Users, Activity, DollarSign } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePlatformMetrics } from "@/hooks/api/usePlatform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function PlatformDashboard() {
  const { data: metrics, isLoading } = usePlatformMetrics();

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading platform metrics...</div>;
  }

  const planData = metrics
    ? [
        { name: "Free", value: metrics.planBreakdown.FREE },
        { name: "Starter", value: metrics.planBreakdown.STARTER },
        { name: "Growth", value: metrics.planBreakdown.GROWTH },
        { name: "Enterprise", value: metrics.planBreakdown.ENTERPRISE },
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Platform Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Monitor global SaaS subscriptions, platform orders, and system-wide performance.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics?.totalTenants}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
              {metrics?.activeTenants} active restaurants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Platform Users</CardTitle>
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics?.totalUsers}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
              Staff and registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Orders</CardTitle>
            <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics?.totalOrdersProcessed}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
              Processed across all branches
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Platform GMV</CardTitle>
            <DollarSign className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{metrics?.platformGMV.toFixed(2)}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
              Total transaction volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-zinc-100">Tenant Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
                <Bar dataKey="tenants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-zinc-100">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative">
            {planData.length === 0 ? (
              <div className="text-slate-500 text-sm">No plan data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <div className="flex justify-center gap-4 pb-6 flex-wrap px-4">
            {planData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-500 dark:text-zinc-400">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
