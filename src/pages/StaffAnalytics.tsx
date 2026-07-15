import { Users, Award, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useStaffPerformance } from "@/hooks/api/useDashboard";
import { useBranchStore } from "@/store/useBranch";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffAnalytics() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || "default";

  const { data: staffData, isLoading } = useStaffPerformance(branchId, 30);

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-sm text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-xs">Revenue: <strong>₹{payload[0].payload.revenueGenerated.toFixed(0)}</strong></p>
        <p className="text-xs">Orders: <strong>{payload[0].payload.ordersProcessed}</strong></p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Staff Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze staff efficiency, orders processed, and revenue generated (Last 30 Days).
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground text-base">Top Performing Staff</h3>
            <p className="text-xs text-muted-foreground mt-0.5">By revenue generated</p>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : !staffData || staffData.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground gap-2">
            <BarChart2 className="h-10 w-10 opacity-30" />
            <p className="text-sm">No staff performance data yet.</p>
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffData}
                layout="vertical"
                margin={{ top: 0, right: 30, bottom: 0, left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  width={120}
                />
                <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.2 }} content={<CustomTooltip />} />
                <Bar dataKey="revenueGenerated" name="Revenue" radius={[0, 4, 4, 0]}>
                  {staffData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
