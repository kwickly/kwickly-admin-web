import { ChefHat, Clock, CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_ORDERS = [
  { id: "#1042", time: "10:45 AM", customer: "John D.", status: "New", items: ["1x Classic Burger (No Onions)", "1x Large Fries", "1x Coke"] },
  { id: "#1043", time: "10:48 AM", customer: "Sarah M.", status: "Preparing", items: ["2x Vegan Wrap", "2x Iced Tea"] },
  { id: "#1040", time: "10:35 AM", customer: "Mike R.", status: "Ready", items: ["1x Chicken Sandwich"] },
];

export default function Orders() {
  const columns = [
    { title: "New Orders", status: "New", icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Preparing", status: "Preparing", icon: ChefHat, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "Ready for Pickup", status: "Ready", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Completed", status: "Completed", icon: Clock, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Live Kitchen Display System
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Real-time order tracking and fulfillment board.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {columns.map((col) => (
          <div key={col.status} className={`flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 overflow-hidden`}>
            {/* Column Header */}
            <div className={`p-4 border-b border-slate-200 dark:border-zinc-800 ${col.bg} flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <col.icon className={`h-5 w-5 ${col.color}`} />
                <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{col.title}</h3>
              </div>
              <Badge variant="secondary" className="bg-white dark:bg-zinc-900">
                {MOCK_ORDERS.filter(o => o.status === col.status).length}
              </Badge>
            </div>
            
            {/* Column Body / Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_ORDERS.filter(o => o.status === col.status).map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg text-slate-900 dark:text-zinc-100">{order.id}</span>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">{order.time} • {order.customer}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-start gap-2">
                        <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md text-sm font-semibold transition-colors">
                    Advance Stage
                  </button>
                </div>
              ))}
              
              {MOCK_ORDERS.filter(o => o.status === col.status).length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 text-sm">
                  No orders
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
