import { LayoutDashboard, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDailySales, useTopItems } from "@/hooks/api/useDashboard";
import { useBranchStore } from "@/store/useBranch";
import { Can } from "@/components/shared/Can";
import { Skeleton } from "@/components/ui/skeleton";

const REVENUE_DATA = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 1800 },
  { name: 'Wed', total: 1400 },
  { name: 'Thu', total: 2200 },
  { name: 'Fri', total: 3100 },
  { name: 'Sat', total: 4200 },
  { name: 'Mon', total: 1200 }, // Fallbacks
];

const CATEGORY_DATA = [
  { name: 'Mains', value: 45 },
  { name: 'Sides', value: 25 },
  { name: 'Drinks', value: 20 },
  { name: 'Desserts', value: 10 },
];

const COLORS = ['var(--brand-primary)', '#10b981', '#f59e0b', '#ef4444'];

export default function TenantDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';

  const { data: sales, isLoading: isLoadingSales } = useDailySales(branchId, today);
  const { data: topItems } = useTopItems(branchId);

  const pieData = topItems && topItems.length > 0 
    ? topItems.map(item => ({ name: item.name, value: item.quantitySold }))
    : CATEGORY_DATA;

  // Render pure operational dashboard metrics
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Operational Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Real-time branch metrics, daily sales reports, and top category distribution.
          </p>
        </div>
      </div>

      <div className="space-y-8 w-full">
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Can perform="analytics:read" fallback={
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                <DollarSign className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
                <h3 className="text-sm font-bold text-slate-400 italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Today's Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSales ? <Skeleton className="h-8 w-24" /> : `₹${sales?.totalSales.toFixed(2)}`}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="orders:read" fallback={
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Orders</p>
                <h3 className="text-sm font-bold text-slate-400 italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Orders</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSales ? <Skeleton className="h-8 w-16" /> : sales?.totalOrders}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="analytics:read" fallback={
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                <TrendingUp className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Avg. Order Value</p>
                <h3 className="text-sm font-bold text-slate-400 italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSales ? <Skeleton className="h-8 w-20" /> : `₹${sales?.averageOrderValue.toFixed(2)}`}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="staff:read" fallback={
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                <Users className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Staff</p>
                <h3 className="text-sm font-bold text-slate-400 italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Active Staff</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">6</h3>
              </div>
            </div>
          </Can>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Can perform="analytics:read" fallback={
            <div className="lg:col-span-3 bg-white dark:bg-zinc-900 p-12 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detailed Charts Restricted</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                You don't have the necessary permissions to view detailed revenue and category performance charts.
              </p>
            </div>
          }>
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue (Last 7 Days)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: '#f4f4f5', opacity: 0.1}} contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
                    <Bar dataKey="total" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Categories</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
}
