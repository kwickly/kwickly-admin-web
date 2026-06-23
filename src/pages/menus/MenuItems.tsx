import { MenuSquare } from "lucide-react";
import MenuGrid from "@/features/menus/components/MenuGrid";
import CreateMenuItemSheet from "@/features/menus/components/CreateMenuItemSheet";
import CreateCategoryDialog from "@/features/menus/components/CreateCategoryDialog";
import CreateModifierDialog from "@/features/menus/components/CreateModifierDialog";
import { Can } from "@/components/shared/Can";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

export default function MenuItems() {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MenuSquare className="h-6 w-6 text-primary" />
            Menu Items
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build and organize your restaurant's menu items.
          </p>
        </div>
        <Can perform="menu:write">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Search items..." 
              className="w-56"
            />
            <CreateCategoryDialog />
            <CreateModifierDialog />
            <CreateMenuItemSheet />
          </div>
        </Can>
      </div>

      <MenuGrid search={search} />
    </div>
  );
}
