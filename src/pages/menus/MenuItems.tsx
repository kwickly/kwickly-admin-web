import { MenuSquare } from "lucide-react";
import MenuGrid from "@/features/menus/components/MenuGrid";
import CreateMenuItemSheet from "@/features/menus/components/CreateMenuItemSheet";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import CreateModifierDialog from "@/features/menus/components/CreateModifierDialog";
import { Can } from "@/components/shared/Can";

export default function MenuItems() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MenuSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Menu Items
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Build and organize your restaurant's menu items.
          </p>
        </div>
        <Can perform="menu:write">
          <div className="flex flex-wrap items-center gap-2">
            <CreateCategoryDialog />
            <CreateModifierDialog />
            <CreateMenuItemSheet />
          </div>
        </Can>
      </div>

      <MenuGrid />
    </div>
  );
}
