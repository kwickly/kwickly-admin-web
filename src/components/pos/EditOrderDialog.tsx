import { Icons } from '@/components/shared/icons';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Order } from '@/hooks/api/useOrders';
import { useMenuItems } from '@/hooks/api/useMenus';
import { useUpdateOrderItems } from '@/hooks/api/useOrders';
import { formatCurrency } from '@/lib/currency';

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
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="m-0 px-6 py-5 border-b bg-card">
          <DialogTitle className="text-xl">
            Edit Order #{order.id.slice(-6)} 
            {order.tableNumber && <span className="text-muted-foreground ml-2 font-normal text-base">| Table {order.tableNumber}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x divide-border">
          {/* Left Side: Menu Search */}
          <div className="flex flex-col h-[55vh] bg-background">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  className="pl-10 h-11 text-base bg-muted/30 border-transparent hover:bg-muted/50 focus:border-primary focus:bg-background transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {isMenusLoading ? (
                <div className="flex justify-center p-8"><Icons.Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group" 
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="flex flex-col overflow-hidden mr-4">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                      <span className="text-sm text-muted-foreground mt-1">{formatCurrency(Number(item.price))}</span>
                    </div>
                    <Button variant="secondary" size="icon" className="h-11 w-11 shrink-0 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground pointer-events-none">
                      <Icons.Plus className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8 flex flex-col items-center">
                  <Icons.Search className="h-10 w-10 mb-3 opacity-20" />
                  <p>No items found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Current Cart */}
          <div className="flex flex-col h-[55vh] bg-muted/10">
            <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
              <span className="font-semibold text-foreground">Current Items</span>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex flex-col flex-1 overflow-hidden mr-4">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground mt-1">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-md hover:bg-background hover:shadow-sm text-muted-foreground hover:text-foreground" 
                        onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                      >
                        <Icons.Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-base font-semibold w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-md hover:bg-background hover:shadow-sm text-muted-foreground hover:text-foreground" 
                        onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                      >
                        <Icons.Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
                  <Icons.ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                  <p>Cart is empty</p>
                  <p className="text-sm mt-1">Add items from the menu to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="m-0 px-6 py-5 border-t border-border bg-card">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col text-left">
              <span className="text-sm text-muted-foreground">New Total</span>
              <span className="text-2xl font-bold text-foreground">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="px-6 font-semibold" onClick={onClose}>
                Cancel
              </Button>
              <Button size="lg" className="px-8 font-semibold" onClick={handleSave} disabled={isPending || cartItems.length === 0}>
                {isPending ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
