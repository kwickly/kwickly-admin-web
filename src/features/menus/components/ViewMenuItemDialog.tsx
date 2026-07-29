import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { type MenuItem } from "@/hooks/api/useMenus"

interface ViewMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export default function ViewMenuItemDialog({ open, onOpenChange, item }: ViewMenuItemDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border border-border sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-foreground font-bold text-xl">Menu Item Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-[4/3] bg-muted flex items-center justify-center text-8xl rounded-xl select-none">
            {item.isVeg ? '🥗' : '🥩'}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Item Name</p>
              <p className="font-semibold text-foreground">{item.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="font-semibold text-foreground">₹{Number(item.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-semibold text-foreground truncate pr-2" title={item.categoryName || 'Uncategorized'}>
                {item.categoryName || 'Uncategorized'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge variant={item.status ? 'outline' : 'destructive'} className="text-xs font-bold">
                {item.status ? 'Available' : 'Out of Stock'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dietary</p>
              <Badge className={item.isVeg ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)} className="w-full bg-muted hover:bg-muted/80 text-foreground">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
