import { MenuSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuGrid from "@/features/menus/components/MenuGrid";
import CreateMenuItemSheet from "@/features/menus/components/CreateMenuItemSheet";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import CreateModifierDialog from "@/features/menus/components/CreateModifierDialog";
import { useMenuCategories, useAddons } from "@/hooks/api/useMenus";
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

export default function Menus() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  
  const { data: categories, isLoading: isCategoriesLoading } = useMenuCategories(branchId);
  const { data: addons, isLoading: isAddonsLoading } = useAddons();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MenuSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Menu Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Build and organize your restaurant's menu items, categories, and modifiers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateCategoryDialog />
          <CreateModifierDialog />
          <CreateMenuItemSheet />
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-900/50 p-1 border border-slate-200 dark:border-zinc-800 rounded-lg mb-6">
          <TabsTrigger value="items" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Menu Items
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Categories
          </TabsTrigger>
          <TabsTrigger value="modifiers" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Modifiers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-0 outline-none">
          <MenuGrid />
        </TabsContent>
        <TabsContent value="categories" className="mt-0 outline-none">
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
        </TabsContent>
        <TabsContent value="modifiers" className="mt-0 outline-none">
          {isAddonsLoading ? (
            <div className="p-8 text-center text-slate-500">Loading modifiers...</div>
          ) : !addons || addons.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No Modifiers</h3>
              <p className="mt-2">Use the "Create Modifier" button to add new global add-ons.</p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
                  <TableRow>
                    <TableHead>Modifier Name</TableHead>
                    <TableHead>Additional Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                        {addon.name}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-zinc-400 font-mono">
                        ₹{addon.price}
                      </TableCell>
                      <TableCell>
                        <Badge variant={addon.isActive ? 'outline' : 'destructive'}>
                          {addon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
