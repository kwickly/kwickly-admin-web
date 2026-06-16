import { ChefHat, Clock, CheckCircle, Package, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuth";
import { useBranchStore } from "@/store/useBranch";
import { useEffect, useState, useRef } from "react";

import { useOrders } from "@/hooks/api/useOrders";

export default function Orders() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  const { data: orders = [] } = useOrders(branchId);
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [wsStatus, setWsStatus] = useState<'Connected' | 'Reconnecting' | 'Disconnected'>('Disconnected');
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!token) return;
    let ws: WebSocket | null = null;
    let isComponentMounted = true;
    let reconnectDelay = 1000;

    const connect = () => {
      ws = new WebSocket(`ws://localhost:3000/kds?token=${token}&branchId=${branchId}`);

      ws.onopen = () => {
        if (!isComponentMounted) return;
        setWsStatus('Connected');
        reconnectDelay = 1000; // Reset backoff
      };

      ws.onmessage = (event) => {
        if (!isComponentMounted) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_KOT' || data.type === 'KOT_UPDATED') {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.onclose = () => {
        if (!isComponentMounted) return;
        setWsStatus('Reconnecting');
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectDelay = Math.min(reconnectDelay * 2, 30000);
          connect();
        }, reconnectDelay);
      };
      
      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws) {
        ws.onclose = null; // prevent reconnect on unmount
        ws.close();
      }
    };
  }, [token, branchId, queryClient]);

  const columns = [
    { title: "New Orders", status: "pending", icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Preparing", status: "preparing", icon: ChefHat, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "Ready for Pickup", status: "ready", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Completed", status: "completed", icon: Clock, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Live Kitchen Display System
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Real-time order tracking and fulfillment board.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 ${
              wsStatus === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
              wsStatus === 'Reconnecting' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
              'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
            }`}
          >
            {wsStatus === 'Connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {wsStatus}
          </Badge>
        </div>
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
                {orders.filter(o => o.status === col.status).length}
              </Badge>
            </div>
            
            {/* Column Body / Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {orders.filter(o => o.status === col.status).map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg text-slate-900 dark:text-zinc-100">#{order.id.slice(0, 6)}</span>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.type}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-start gap-2">
                        <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                  {col.status !== 'completed' && (
                    <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md text-sm font-semibold transition-colors">
                      Advance Stage
                    </button>
                  )}
                </div>
              ))}
              
              {orders.filter(o => o.status === col.status).length === 0 && (
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
