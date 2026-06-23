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
  { name: 'Sun', total: 1200 },
];

const CATEGORY_DATA = [
  { name: 'Mains', value: 45 },
  { name: 'Sides', value: 25 },
  { name: 'Drinks', value: 20 },
  { name: 'Desserts', value: 10 },
];

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

export default function TenantDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';

  const { data: sales, isLoading: isLoadingSales } = useDailySales(branchId, today);
  const { data: topItems } = useTopItems(branchId);

  const pieData = topItems && topItems.length > 0 
    ? topItems.map(item => ({ name: item.name, value: item.quantitySold }))
    : CATEGORY_DATA;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Operational Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time branch metrics, daily sales reports, and top category distribution.
          </p>
        </div>
      </div>

      <div className="space-y-8 w-full">
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Can perform="analytics:read" fallback={
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-muted rounded-lg">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <h3 className="text-sm font-bold text-muted-foreground italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {isLoadingSales ? <Skeleton className="h-8 w-24" /> : `₹${sales?.totalSales.toFixed(2)}`}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="orders:read" fallback={
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-muted rounded-lg">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-sm font-bold text-muted-foreground italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {isLoadingSales ? <Skeleton className="h-8 w-16" /> : sales?.totalOrders}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="analytics:read" fallback={
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <h3 className="text-sm font-bold text-muted-foreground italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {isLoadingSales ? <Skeleton className="h-8 w-20" /> : `₹${sales?.averageOrderValue.toFixed(2)}`}
                </h3>
              </div>
            </div>
          </Can>

          <Can perform="staff:read" fallback={
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 opacity-50 grayscale">
              <div className="p-3 bg-muted rounded-lg">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
                <h3 className="text-sm font-bold text-muted-foreground italic">Restricted Access</h3>
              </div>
            </div>
          }>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
                <h3 className="text-2xl font-bold text-foreground">6</h3>
              </div>
            </div>
          </Can>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Can perform="analytics:read" fallback={
            <div className="lg:col-span-3 bg-card p-12 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Detailed Charts Restricted</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">
                You don't have the necessary permissions to view detailed revenue and category performance charts.
              </p>
            </div>
          }>
            <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Revenue (Last 7 Days)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)'}} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: 'var(--muted)', opacity: 0.1}} contentStyle={{borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)'}} />
                    <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Top Categories</h3>
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
                    <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
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
