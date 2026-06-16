import { LayoutDashboard, DollarSign, ShoppingCart, TrendingUp, Users, BrainCircuit, Sparkles, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useDailySales, useTopItems } from "@/hooks/api/useDashboard";
import { useAIForecast, useAICombos, useChurnList } from "@/hooks/api/useAI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
  const today = new Date().toISOString().split('T')[0];
  const { data: sales, isLoading: isLoadingSales } = useDailySales('default', today);
  const { data: topItems } = useTopItems('default');

  // AI Hooks
  const { data: forecastData, isLoading: isForecastLoading } = useAIForecast();
  const { data: suggestedCombos, isLoading: isCombosLoading } = useAICombos();
  const { data: churnList, isLoading: isChurnLoading } = useChurnList();

  const pieData = topItems && topItems.length > 0 
    ? topItems.map(item => ({ name: item.name, value: item.quantitySold }))
    : CATEGORY_DATA;

  const handleSendPromo = (customerName: string) => {
    toast.success(`Discount coupon dispatched to ${customerName} via WhatsApp!`);
  };

  const handleCreateSuggestedCombo = (comboName: string) => {
    toast.success(`Combo "${comboName}" has been successfully added to menu items!`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Track your restaurant performance metrics and review machine learning forecasts.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-900/50 p-1 border border-slate-200 dark:border-zinc-800 rounded-lg mb-6">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Analytics Overview
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            AI Insights & Forecasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Today's Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{isLoadingSales ? '...' : sales?.totalSales.toFixed(2)}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Orders</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSales ? '...' : sales?.totalOrders}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{isLoadingSales ? '...' : sales?.averageOrderValue.toFixed(2)}
                </h3>
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
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: '#f4f4f5', opacity: 0.1}} contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
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
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-0 outline-none space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Demand Forecast */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Meal Demand Forecasting (Facebook Prophet)</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Predicting portion requirements for tomorrow based on historic scan frequencies, weather, and calendar trends.
              </p>

              {isForecastLoading ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500">Loading forecast...</div>
              ) : (
                <div className="h-[300px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b8d97'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#18181b', color: '#fff'}} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" name="Actual Scans" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#4f46e5" strokeDasharray="5 5" strokeWidth={2.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right Col: Combo Suggestions */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Combo Pricing</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Recommended meal packages based on checkout item affinity scores.
              </p>

              {isCombosLoading ? (
                <div className="text-center py-6 text-slate-500">Loading combos...</div>
              ) : (
                <div className="space-y-4">
                  {suggestedCombos?.map((combo) => (
                    <Card key={combo.id} className="border-slate-200 dark:border-zinc-800 bg-transparent flex flex-col justify-between overflow-hidden shadow-none p-4 space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{combo.name}</h4>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                            {combo.lift}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {combo.items.map((it, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0">
                              {it}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <span className="text-xs text-slate-500">Rec. Price: <strong>₹{combo.recommendedPrice}</strong></span>
                        <Button
                          size="sm"
                          onClick={() => handleCreateSuggestedCombo(combo.name)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white h-7 text-xs"
                        >
                          Adopt Combo
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Churn prevention list */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Churn At-Risk Subscribers</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Subscribers identified as having a high likelihood of canceling their plan (defined by declining weekly visits).
            </p>

            {isChurnLoading ? (
              <div className="text-center py-6 text-slate-500">Loading risk list...</div>
            ) : (
              <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Last Scan</TableHead>
                      <TableHead>Total Visits</TableHead>
                      <TableHead>Churn Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {churnList?.map((cust) => (
                      <TableRow key={cust.id}>
                        <TableCell className="font-medium text-slate-900 dark:text-zinc-100">{cust.name}</TableCell>
                        <TableCell className="text-slate-500 dark:text-zinc-400 font-mono text-xs">{cust.phone}</TableCell>
                        <TableCell className="text-slate-500 dark:text-zinc-400 text-xs">
                          {new Date(cust.lastScanAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-900 dark:text-zinc-100 font-mono text-xs">{cust.totalVisits} scans</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            {cust.riskScore} RISK
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendPromo(cust.name)}
                            className="border-slate-300 dark:border-zinc-700 text-xs h-8"
                          >
                            Send Promo Offer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
