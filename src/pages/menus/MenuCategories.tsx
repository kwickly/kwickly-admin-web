import { useState } from "react";
import { LayoutGrid, Edit, Trash } from "lucide-react";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import { useMenuCategories, useUpdateCategory, useDeleteCategory, type MenuCategory } from "@/hooks/api/useMenus";
import { useBranchStore } from "@/store/useBranch";
import { TableSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function MenuCategories() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  
  const [page, setPage] = useState(1);
  const { data: response, isLoading: isCategoriesLoading } = useMenuCategories(branchId, page, 20);
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = response?.data || [];
  const meta = response?.meta;

  // Edit State
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Delete State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const handleEditClick = (cat: MenuCategory) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSortOrder(String(cat.sortOrder));
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !name) return;

    updateCategoryMutation.mutate(
      {
        id: selectedCategory.id,
        payload: { name, sortOrder: parseInt(sortOrder) || 0 },
      },
      {
        onSuccess: () => {
          toast.success("Category updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update category.");
        },
      }
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCatId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingCatId) return;

    deleteCategoryMutation.mutate(deletingCatId, {
      onSuccess: () => {
        toast.success("Category deleted successfully!");
        setDeleteOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete category.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            Menu Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your menu items into logical categories.
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      {isCategoriesLoading ? (
        <TableSkeleton />
      ) : !categories || categories.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
          <h3 className="text-lg font-medium text-foreground">No Categories</h3>
          <p className="mt-2">Use the "Create Category" button to add new categories.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-foreground truncate" title={category.name}>{category.name}</h3>
                    <Badge variant={category.status ? 'outline' : 'destructive'} className="text-[10px] font-bold shrink-0">
                      {category.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Sort Order: {category.sortOrder}
                  </p>
                </div>
                <div className="bg-muted/30 border-t border-border p-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditClick(category)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted min-h-[44px] min-w-[44px]"
                  >
                    <Edit className="size-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(category.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
                  >
                    <Trash className="size-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {meta && (
            <PaginationControls 
              page={meta.page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
            />
          )}
        </div>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border border-border">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Category</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update category details or ordering priority.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="editName" className="text-foreground font-medium">Category Name</Label>
                <Input
                  id="editName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-border text-foreground"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editSortOrder" className="text-foreground font-medium">Sort Order</Label>
                <Input
                  id="editSortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent border-border text-foreground"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="border-border text-muted-foreground bg-transparent hover:bg-muted"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Category</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this category? All items currently inside this category will be moved to "Uncategorized".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-border text-muted-foreground bg-transparent hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
