import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMenuItems, useDeleteMenuItem, type MenuItem } from "@/hooks/api/useMenus";
import { useBranchStore } from "@/store/useBranch";
import EditMenuItemSheet from "./EditMenuItemSheet";
import { toast } from "sonner";

export default function MenuGrid() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';

  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useMenuItems(branchId, page, 20);
  const deleteItemMutation = useDeleteMenuItem();

  const items = response?.items || [];
  const meta = response?.meta;

  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingItemId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItemId) return;
    deleteItemMutation.mutate(
      { id: deletingItemId, branchId },
      {
        onSuccess: () => {
          toast.success("Menu item deleted successfully!");
          setDeleteOpen(false);
        },
        onError: () => {
          toast.error("Failed to delete menu item.");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading menu items...</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
        No menu items found. Create one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-6xl select-none">
            {item.isVeg ? '🥗' : '🥩'}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 truncate pr-2" title={item.name}>
                {item.name}
              </h3>
              <p className="font-medium text-indigo-650 dark:text-indigo-400 shrink-0">
                ₹{Number(item.price).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[120px]">
                {item.categoryName || 'Uncategorized'}
              </span>
              <Badge variant={item.isActive ? 'outline' : 'destructive'} className="text-[10px] font-bold">
                {item.isActive ? 'Active' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-[2px] rounded-xl duration-200">
            <Button
              size="sm"
              onClick={() => handleEditClick(item)}
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-md transition-all scale-90 group-hover:scale-100 h-8"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteClick(item.id)}
              className="bg-red-600 hover:bg-red-750 text-white font-semibold shadow-md transition-all scale-90 group-hover:scale-100 h-8"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}

      {/* Edit Sheet */}
      <EditMenuItemSheet open={editOpen} onOpenChange={setEditOpen} item={selectedItem} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Delete Menu Item</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Are you sure you want to delete this menu item? This action will permanently remove it from the menu lists.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-850"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteItemMutation.isPending}
              className="bg-red-650 hover:bg-red-700 text-white"
            >
              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {meta && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-2">
          <PaginationControls 
            page={meta.page} 
            totalPages={meta.totalPages} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </div>
  );
}
