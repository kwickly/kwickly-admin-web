import { useState } from 'react';
import { Icons } from '@/components/shared/icons';
import { useBranchStore } from "@/store/useBranch";
import { useOrders, useCancelOrder, useTransferTable } from "@/hooks/api/useOrders";
import { useTables } from "@/hooks/api/useTables";
import { Move } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

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

import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Orders() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  const { data: orders = [] } = useOrders(branchId);
  const cancelOrderMutation = useCancelOrder();
  const transferTableMutation = useTransferTable();
  const { data: tables = [] } = useTables(branchId);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [destinationTableId, setDestinationTableId] = useState('');

  const availableTables = tables.filter((t: any) => t.status === 'available');
  
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

  const handleTransferTable = () => {
    if (!selectedOrder || !destinationTableId) return;
    transferTableMutation.mutate({
      branchId,
      orderId: selectedOrder.id,
      toTableId: destinationTableId
    }, {
      onSuccess: () => {
        toast.success("Order moved successfully");
        setIsTransferOpen(false);
        setSelectedOrder(null);
        setDestinationTableId('');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || "Failed to move order");
      }
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Icons.Receipt className="h-6 w-6 text-primary" />
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
                        {order.paymentStatus === 'paid' ? <Icons.CheckCircle className="w-3 h-3" /> : <Icons.Clock className="w-3 h-3" />}
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="View Icons.Receipt"
                          onClick={() => {
                            // TODO: Implement receipt modal
                            toast.info("Icons.Receipt view coming soon");
                          }}
                        >
                          <Icons.Receipt className="h-4 w-4" />
                          <span className="sr-only">View Icons.Receipt</span>
                        </Button>

                        {order.mode === 'dine_in' && order.status !== 'completed' && order.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            title="Move Table"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsTransferOpen(true);
                            }}
                          >
                            <Move className="h-4 w-4" />
                            <span className="sr-only">Move Table</span>
                          </Button>
                        )}

                        {!isCancelled && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Cancel Order"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <Icons.Ban className="h-4 w-4" />
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

      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move Order to Open Table</DialogTitle>
            <DialogDescription>
              Select a vacant table to transfer Order #{selectedOrder?.id.slice(0, 6).toUpperCase()} (currently Table {selectedOrder?.tableNumber}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="destinationTable" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Destination Table
              </label>
              {availableTables.length === 0 ? (
                <p className="text-sm text-destructive font-medium">No vacant tables available at this branch.</p>
              ) : (
                <select
                  id="destinationTable"
                  value={destinationTableId}
                  onChange={(e) => setDestinationTableId(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-100"
                >
                  <option value="">Select a table...</option>
                  {availableTables.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Capacity: {t.capacity || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTransferTable}
              disabled={!destinationTableId || transferTableMutation.isPending}
            >
              {transferTableMutation.isPending ? "Moving..." : "Confirm Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
