import { LayoutDashboard, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const REVENUE_DATA = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 1800 },
  { name: 'Wed', total: 1400 },
  { name: 'Thu', total: 2200 },
  { name: 'Fri', total: 3100 },
  { name: 'Sat', total: 4200 },
  { name: 'Sun', total: 3800 },
];

const CATEGORY_DATA = [
  { name: 'Mains', value: 45 },
  { name: 'Sides', value: 25 },
  { name: 'Drinks', value: 20 },
  { name: 'Desserts', value: 10 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$3,240.50</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">142</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Avg. Order Value</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$22.82</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
            <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Active Staff</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">6</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{fill: '#f4f4f5', opacity: 0.1}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
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
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {CATEGORY_DATA.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-slate-500 dark:text-zinc-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
