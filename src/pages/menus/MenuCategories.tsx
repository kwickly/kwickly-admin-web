import { useState } from "react";
import { LayoutGrid, Edit, Trash } from "lucide-react";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import { useMenuCategories, useUpdateCategory, useDeleteCategory, type MenuCategory } from "@/hooks/api/useMenus";
import { useBranchStore } from "@/store/useBranch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  
  const { data: categories, isLoading: isCategoriesLoading } = useMenuCategories(branchId);
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Menu Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Organize your menu items into logical categories.
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      {isCategoriesLoading ? (
        <div className="p-8 text-center text-slate-500">Loading categories...</div>
      ) : !categories || categories.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No Categories</h3>
          <p className="mt-2">Use the "Create Category" button to add new categories.</p>
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <TableCell className="font-semibold text-slate-900 dark:text-zinc-100">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 font-mono">
                    {category.sortOrder}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? 'outline' : 'destructive'} className="text-[10px] font-bold">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleEditClick(category)}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(category.id)}
                        className="text-red-650 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Edit Category</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Update category details or ordering priority.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="editName" className="text-slate-700 dark:text-zinc-300 font-medium">Category Name</Label>
                <Input
                  id="editName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editSortOrder" className="text-slate-700 dark:text-zinc-300 font-medium">Sort Order</Label>
                <Input
                  id="editSortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-850"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Delete Category</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Are you sure you want to delete this category? All items currently inside this category will be moved to "Uncategorized".
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
              disabled={deleteCategoryMutation.isPending}
              className="bg-red-650 hover:bg-red-700 text-white"
            >
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
