import { Icons } from '@/components/shared/icons';
import { useState } from 'react';
import { useBranchStore } from '@/store/useBranch';
import { useOrders, useUpdatePaymentStatus } from '@/hooks/api/useOrders';
import type { Order } from '@/hooks/api/useOrders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from 'sonner';
import { EditOrderDialog } from '@/components/pos/EditOrderDialog';

export default function Pos() {
  const { selectedBranchId } = useBranchStore();
  
  // Only fetch pending orders for the POS
  const { data: pendingOrders, isLoading } = useOrders(selectedBranchId!, 'pending');
  const { mutateAsync: updatePayment, isPending: isUpdating } = useUpdatePaymentStatus();

  const [settleOrder, setSettleOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'razorpay' | 'upi' | 'wallet'>('cash');

  const handleSettle = async () => {
    if (!settleOrder) return;
    try {
      await updatePayment({
        orderId: settleOrder.id,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
      });
      toast.success(`Order ${settleOrder.id.slice(-6)} settled successfully`);
      setSettleOrder(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to settle bill');
    }
  };

  const getModeIcon = (mode?: string) => {
    if (mode === 'dine_in') return <Icons.Utensils className="h-4 w-4" />;
    if (mode === 'takeaway') return <Icons.ShoppingBag className="h-4 w-4" />;
    return <Icons.CreditCard className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader 
        title="Point of Sale (POS)"
        description="Process active orders and settle bills."
        icon={Icons.Store}
      >
        <Badge variant="outline" className="text-sm bg-background border-border">
          {pendingOrders?.length || 0} Pending Settlements
        </Badge>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : pendingOrders && pendingOrders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingOrders.map((order) => (
            <Card key={order.id} className="flex flex-col rounded-xl overflow-hidden">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground" 
                        onClick={() => setEditOrder(order)} 
                        title="Edit Order"
                      >
                        <Icons.Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {getModeIcon(order.mode)}
                      <span className="capitalize">{order.mode?.replace('_', ' ') || 'Unknown'}</span>
                      {order.tableNumber && (
                        <Badge variant="secondary" className="ml-1 bg-platform-primary/10 text-platform-primary hover:bg-platform-primary/20 rounded-full border-none px-2 py-0.5 text-xs">
                          Table {order.tableNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(Number(order.total))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="truncate pr-4 flex-1">
                        <span className="text-muted-foreground mr-2">{item.quantity}x</span> 
                        {item.name}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">{formatCurrency(Number(item.total))}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-xs text-muted-foreground pt-1">
                      + {order.items.length - 3} more items...
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <Button 
                    className="w-full font-semibold h-12 text-base" 
                    onClick={() => setSettleOrder(order)}
                  >
                    Settle Bill
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground space-y-4">
          <Icons.CreditCard className="h-16 w-16 opacity-20" />
          <h3 className="text-xl font-semibold">No Pending Bills</h3>
          <p>All active orders have been paid or settled.</p>
        </div>
      )}

      {/* Settle Bill Dialog */}
      <Dialog open={!!settleOrder} onOpenChange={(open) => !open && setSettleOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settle Bill #{settleOrder?.id.slice(-6)}</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex justify-between items-center mb-6 p-4 bg-muted/50 rounded-lg border">
              <span className="font-semibold text-muted-foreground">Total Due</span>
              <span className="text-3xl font-bold text-primary">
                {settleOrder && formatCurrency(Number(settleOrder.total))}
              </span>
            </div>

            <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)} className="grid grid-cols-2 gap-4">
              <Label
                htmlFor="cash"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cash' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="cash" id="cash" className="sr-only" />
                <Icons.Banknote className={`h-8 w-8 mb-2 ${paymentMethod === 'cash' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className="font-medium">Cash</span>
              </Label>
              
              <Label
                htmlFor="upi"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="upi" id="upi" className="sr-only" />
                <Icons.Smartphone className={`h-8 w-8 mb-2 ${paymentMethod === 'upi' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className="font-medium">UPI / QR</span>
              </Label>
              
              <Label
                htmlFor="razorpay"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="razorpay" id="razorpay" className="sr-only" />
                <Icons.CreditCard className={`h-8 w-8 mb-2 ${paymentMethod === 'razorpay' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className="font-medium">Card (Razorpay)</span>
              </Label>
              
              <Label
                htmlFor="wallet"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'wallet' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="wallet" id="wallet" className="sr-only" />
                <Icons.Wallet className={`h-8 w-8 mb-2 ${paymentMethod === 'wallet' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className="font-medium">Store Wallet</span>
              </Label>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleOrder(null)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSettle} disabled={isUpdating} className="min-w-[120px]">
              {isUpdating ? 'Settling...' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <EditOrderDialog 
        order={editOrder} 
        branchId={selectedBranchId!} 
        onClose={() => setEditOrder(null)} 
      />
    </div>
  );
}
