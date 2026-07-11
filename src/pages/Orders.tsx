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
    { title: "New Orders", status: "pending", icon: Package, color: "text-[var(--chart-1)]", bg: "bg-[var(--chart-1)]/10" },
    { title: "Preparing", status: "preparing", icon: ChefHat, color: "text-[var(--chart-3)]", bg: "bg-[var(--chart-3)]/10" },
    { title: "Ready for Pickup", status: "ready", icon: CheckCircle, color: "text-[var(--chart-2)]", bg: "bg-[var(--chart-2)]/10" },
    { title: "Completed", status: "completed", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            Live Kitchen Display System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time order tracking and fulfillment board.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 ${
              wsStatus === 'Connected' ? 'bg-success/10 text-success border-success/20' :
              wsStatus === 'Reconnecting' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-muted/50 text-muted-foreground border-border'
            }`}
          >
            {wsStatus === 'Connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {wsStatus}
          </Badge>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {columns.map((col) => (
          <div key={col.status} className={`flex flex-col rounded-xl border border-border bg-card/50 overflow-hidden`}>
            {/* Column Header */}
            <div className={`p-4 border-b border-border ${col.bg} flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <col.icon className={`h-5 w-5 ${col.color}`} />
                <h3 className="font-semibold text-foreground">{col.title}</h3>
              </div>
              <Badge variant="secondary" className="bg-background">
                {orders.filter(o => o.status === col.status).length}
              </Badge>
            </div>
            
            {/* Column Body / Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {orders.filter(o => o.status === col.status).map((order) => (
                <div key={order.id} className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg text-foreground">#{order.id.slice(0, 6)}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.type}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="text-sm font-medium text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                  {col.status !== 'completed' && (
                    <button className="w-full min-h-[44px] bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-sm font-semibold transition-colors">
                      Advance Stage
                    </button>
                  )}
                </div>
              ))}
              
              {orders.filter(o => o.status === col.status).length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
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
