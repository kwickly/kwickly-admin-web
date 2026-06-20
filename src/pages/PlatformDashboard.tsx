import { LayoutDashboard, Building, Users, Activity, DollarSign, TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePlatformMetrics } from "@/hooks/api/usePlatform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e'];

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Platform Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Monitor global SaaS subscriptions, platform orders, and system-wide performance.
          </p>
        </div>
      </div>

      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Tenants</CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{metrics?.totalTenants}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2 flex items-center gap-1">
              <span className="text-emerald-500 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/> {metrics?.activeTenants} active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Platform Users</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{metrics?.totalUsers}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2">
              Staff and registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{metrics?.totalOrdersProcessed}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2">
              Processed across all branches
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-rose-500/10 blur-xl group-hover:bg-rose-500/20 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-zinc-400">Platform GMV</CardTitle>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10">
              <DollarSign className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{metrics?.platformGMV.toFixed(2)}</div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2">
              Total transaction volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-400"></div>
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Tenant Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8b8d97', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'}} 
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="tenants" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTenants)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-emerald-500" />
              Plan Distribution
            </CardTitle>
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
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {planData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'}} 
                    itemStyle={{color: '#fff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center Label inside Pie */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{metrics?.totalTenants}</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Total</span>
            </div>
          </CardContent>
          <div className="flex justify-center gap-x-6 gap-y-3 pb-6 flex-wrap px-4">
            {planData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-800">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{entry.name} <span className="text-slate-400 dark:text-zinc-500 ml-1">({entry.value})</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
