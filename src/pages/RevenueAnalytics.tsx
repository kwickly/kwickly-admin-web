import { useState, useMemo } from "react";
import {
  TrendingUp, ShoppingCart, DollarSign, BarChart2,
  CalendarDays, Clock, Award, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useDailySales, useTopItems, useRevenueTrend, useHourlySales } from "@/hooks/api/useDashboard";
import { useBranchStore } from "@/store/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// ─── Period Selector ────────────────────────────────────────────────────────
const PERIODS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  loading,
  accent = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
  accent?: "primary" | "emerald" | "amber" | "violet";
}) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colors[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.positive ? "text-emerald-600" : "text-destructive"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-28 mt-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.name}: <strong>{typeof p.value === "number" && p.name?.toLowerCase().includes("revenue") ? `₹${p.value.toFixed(0)}` : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Hourly Heatmap ──────────────────────────────────────────────────────────
function HourlyHeatmap({ data }: { data: { hour: number; label: string; revenue: number; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="grid grid-cols-8 gap-1.5">
      {data.map((slot) => {
        const intensity = slot.revenue / max;
        const opacity = intensity < 0.05 ? 0.05 : intensity;
        return (
          <div
            key={slot.hour}
            className="group relative flex flex-col items-center gap-1"
            title={`${slot.label}: ₹${slot.revenue.toFixed(0)} (${slot.orders} orders)`}
          >
            <div
              className="w-full h-10 rounded-md transition-all cursor-default"
              style={{
                backgroundColor: `oklch(0.51 0.2 260 / ${opacity})`,
                border: `1px solid oklch(0.51 0.2 260 / ${Math.min(opacity + 0.15, 1)})`,
              }}
            />
            <span className="text-[9px] text-muted-foreground font-mono">
              {slot.hour}h
            </span>
            {/* Hover Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-popover border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-lg">
              <strong>{slot.label}</strong><br />₹{slot.revenue.toFixed(0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RevenueAnalytics() {
  const today = new Date().toISOString().split("T")[0];
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || "default";

  const [trendDays, setTrendDays] = useState(30);

  // Data fetching
  const { data: todaySales, isLoading: loadingToday } = useDailySales(branchId, today);
  const { data: trendData, isLoading: loadingTrend } = useRevenueTrend(branchId, trendDays);
  const { data: topItems, isLoading: loadingItems } = useTopItems(branchId);
  const { data: hourlyData, isLoading: loadingHourly } = useHourlySales(branchId, 7);

  // Derived metrics from trend data
  const totalPeriodRevenue = useMemo(
    () => trendData?.reduce((sum, d) => sum + d.revenue, 0) ?? 0,
    [trendData]
  );
  const totalPeriodOrders = useMemo(
    () => trendData?.reduce((sum, d) => sum + d.orders, 0) ?? 0,
    [trendData]
  );

  // Peak hour from hourly data
  const peakHour = useMemo(() => {
    if (!hourlyData?.length) return null;
    return hourlyData.reduce((max, d) => (d.revenue > max.revenue ? d : max), hourlyData[0]);
  }, [hourlyData]);

  // Bar chart colours for top items
  const COLORS = [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
    "var(--chart-4)", "var(--chart-5)",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            Revenue Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daily sales trends, top performers, and peak-hour traffic analysis.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              id={`period-${p.days}`}
              onClick={() => setTrendDays(p.days)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                trendDays === p.days
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Today's Revenue"
          value={`₹${(todaySales?.totalSales ?? 0).toFixed(2)}`}
          sub="Delivered orders only"
          accent="primary"
          loading={loadingToday}
        />
        <StatCard
          icon={ShoppingCart}
          label="Today's Orders"
          value={`${todaySales?.totalOrders ?? 0}`}
          sub={`Avg ₹${(todaySales?.averageOrderValue ?? 0).toFixed(0)} / order`}
          accent="emerald"
          loading={loadingToday}
        />
        <StatCard
          icon={TrendingUp}
          label={`Revenue (${trendDays}d)`}
          value={`₹${totalPeriodRevenue.toFixed(0)}`}
          sub={`${totalPeriodOrders} total orders`}
          accent="violet"
          loading={loadingTrend}
        />
        <StatCard
          icon={Clock}
          label="Peak Hour"
          value={peakHour ? peakHour.label : "—"}
          sub={peakHour ? `₹${peakHour.revenue.toFixed(0)} in revenue` : "No data"}
          accent="amber"
          loading={loadingHourly}
        />
      </div>

      {/* ── Revenue Trend Chart ─────────────────────────────────────── */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Revenue Trend
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily delivered-order revenue for the last {trendDays} days
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
            LIVE DATA
          </Badge>
        </div>

        {loadingTrend ? (
          <div className="h-[280px] flex items-center justify-center">
            <Skeleton className="h-[240px] w-full rounded-xl" />
          </div>
        ) : !trendData || trendData.length === 0 ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground gap-3">
            <TrendingUp className="h-10 w-10 opacity-30" />
            <p className="text-sm">No revenue data for this period yet.</p>
            <p className="text-xs">Orders marked as "delivered" will appear here.</p>
          </div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v) => `₹${v}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Top Items + Hourly Heatmap ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground text-base">Top Selling Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">By quantity sold (all-time)</p>
            </div>
          </div>

          {loadingItems ? (
            <Skeleton className="h-[260px] w-full rounded-xl" />
          ) : !topItems || topItems.length === 0 ? (
            <div className="h-[260px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <BarChart2 className="h-10 w-10 opacity-30" />
              <p className="text-sm">No item sales data yet.</p>
            </div>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topItems}
                  layout="vertical"
                  margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  />
                  <Bar dataKey="quantitySold" name="Qty Sold" radius={[0, 4, 4, 0]}>
                    {topItems.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Hourly Traffic Heatmap */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground text-base">Peak Hour Heatmap</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Revenue by hour of day (last 7 days)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "oklch(0.51 0.2 260 / 0.1)" }} />
                Low
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "oklch(0.51 0.2 260 / 1)" }} />
                High
              </div>
            </div>
          </div>

          {loadingHourly ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : !hourlyData || hourlyData.every((d) => d.revenue === 0) ? (
            <div className="h-[220px] flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Clock className="h-10 w-10 opacity-30" />
              <p className="text-sm">No hourly data for the last 7 days.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <HourlyHeatmap data={hourlyData} />

              {/* Top 3 hours */}
              {peakHour && (
                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Busiest windows
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {[...hourlyData]
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map((slot) => (
                        <Badge
                          key={slot.hour}
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {slot.label} · ₹{slot.revenue.toFixed(0)}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
