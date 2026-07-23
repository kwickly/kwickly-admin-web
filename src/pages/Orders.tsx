import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuth";
import { useBranchStore } from "@/store/useBranch";
import { useEffect, useState } from "react";
import { useOrders, useCancelOrder } from "@/hooks/api/useOrders";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Ban, 
  CheckCircle, 
  Clock, 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Orders() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  const { data: orders = [] } = useOrders(branchId);
  const cancelOrderMutation = useCancelOrder();
  
  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      cancelOrderMutation.mutate(orderId, {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || "Failed to cancel order");
        }
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all orders, monitor payment status, and manage cancellations.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const isCancelled = order.status === 'cancelled';
                return (
                  <TableRow key={order.id} className={cn(isCancelled && "opacity-60 bg-muted/20")}>
                    <TableCell className="font-medium">
                      #{order.id.slice(0, 6).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {order.mode?.replace('_', ' ') || 'Dine In'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.tableNumber ? (
                        <Badge variant="secondary" className="font-mono bg-primary/10 text-primary hover:bg-primary/20">
                          T{order.tableNumber}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums">
                      ₹{Number(order.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "capitalize border-transparent",
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      )}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "capitalize border-transparent flex w-fit items-center gap-1",
                        order.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning dark:bg-warning/20'
                      )}>
                        {order.paymentStatus === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="View Receipt"
                          onClick={() => {
                            // TODO: Implement receipt modal
                            toast.info("Receipt view coming soon");
                          }}
                        >
                          <Receipt className="h-4 w-4" />
                          <span className="sr-only">View Receipt</span>
                        </Button>

                        {!isCancelled && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Cancel Order"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <Ban className="h-4 w-4" />
                            <span className="sr-only">Cancel Order</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
