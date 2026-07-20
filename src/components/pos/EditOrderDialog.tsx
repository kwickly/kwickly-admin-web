import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Order } from '@/hooks/api/useOrders';
import { useMenuItems } from '@/hooks/api/useMenus';
import { useUpdateOrderItems } from '@/hooks/api/useOrders';
import { formatCurrency } from '@/lib/currency';
import { Plus, Minus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EditOrderDialogProps {
  order: Order | null;
  branchId: string;
  onClose: () => void;
}

export function EditOrderDialog({ order, branchId, onClose }: EditOrderDialogProps) {
  const { data: menuData, isLoading: isMenusLoading } = useMenuItems(branchId, 1, 100);
  const { mutateAsync: updateOrderItems, isPending } = useUpdateOrderItems();

  const [cartItems, setCartItems] = useState<{ menuItemId: string; name: string; price: number; quantity: number }[]>([]);
  const [search, setSearch] = useState('');

  // Sync initial order items
  useEffect(() => {
    if (order) {
      setCartItems(
        order.items.map((i: any) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: parseFloat(i.unitPrice || '0'),
          quantity: i.quantity,
        }))
      );
    }
  }, [order]);

  if (!order) return null;

  const handleUpdateQuantity = (menuItemId: string, delta: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItemId);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter((item) => item.menuItemId !== menuItemId);
        }
        return prev.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity: newQuantity } : item
        );
      }
      return prev;
    });
  };

  const handleAddItem = (menuItem: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItemId: menuItem.id, name: menuItem.name, price: parseFloat(menuItem.price), quantity: 1 }];
    });
  };

  const handleSave = async () => {
    if (cartItems.length === 0) {
      toast.error('Order must have at least one item');
      return;
    }

    try {
      await updateOrderItems({
        orderId: order.id,
        items: cartItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      });
      toast.success('Order items updated successfully!');
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to update order');
    }
  };

  const filteredMenu = (menuData?.items || []).filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Order #{order.id.slice(-6)} - {order.tableNumber || 'No Table'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden grid grid-cols-2">
          {/* Left Side: Menu */}
          <div className="border-r bg-muted/20 flex flex-col h-[50vh]">
            <div className="p-3 border-b bg-background">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="p-3 overflow-y-auto flex-1 space-y-2">
              {isMenusLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted bg-background border transition-colors cursor-pointer" onClick={() => handleAddItem(item)}>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-sm truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{formatCurrency(Number(item.price))}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">No items found</div>
              )}
            </div>
          </div>

          {/* Right Side: Cart */}
          <div className="flex flex-col h-[50vh]">
            <div className="p-3 bg-muted/40 font-semibold border-b text-sm">
              Current Items
            </div>
            <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-background">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-medium text-sm truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.menuItemId, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.menuItemId, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">Cart is empty</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">New Total: {formatCurrency(cartTotal)}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
