import { Link, Outlet, useLocation } from "react-router-dom";
import { MenuSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MenusLayout() {
  const location = useLocation();

  const tabs = [
    { name: "Menu Items", path: "/menus/items" },
    { name: "Categories", path: "/menus/categories" },
    { name: "Modifiers", path: "/menus/modifiers" },
    { name: "Combos", path: "/menus/combos" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MenuSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Menu Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Build and organize your restaurant's menu items, categories, and pricing.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[9px]",
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
