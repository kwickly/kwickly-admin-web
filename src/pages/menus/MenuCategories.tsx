import { LayoutGrid } from "lucide-react";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import { useMenuCategories } from "@/hooks/api/useMenus";
import { useBranchStore } from "@/store/useBranch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MenuCategories() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  
  const { data: categories, isLoading: isCategoriesLoading } = useMenuCategories(branchId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 font-mono">
                    {category.sortOrder}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? 'outline' : 'destructive'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
