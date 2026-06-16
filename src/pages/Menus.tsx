import { MenuSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuGrid from "@/features/menus/components/MenuGrid";
import CreateMenuItemSheet from "@/features/menus/components/CreateMenuItemSheet";

export default function Menus() {
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
        <CreateMenuItemSheet />
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
          <div className="p-8 text-center text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
            Categories management interface coming soon.
          </div>
        </TabsContent>
        <TabsContent value="modifiers" className="mt-0 outline-none">
          <div className="p-8 text-center text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
            Modifiers management interface coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
