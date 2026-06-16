import { Badge } from "@/components/ui/badge"

import { useMenuItems } from "@/hooks/api/useMenus"

export default function MenuGrid() {
  const { data: items, isLoading } = useMenuItems('default'); // Use default branch for now

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading menu items...</div>;
  }

  if (!items || items.length === 0) {
    return <div className="text-center py-12 text-slate-500 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">No menu items found. Create one!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div 
          key={item.id}
          className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-6xl">
            {item.isVeg ? '🥗' : '🥩'}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{item.name}</h3>
              <p className="font-medium text-indigo-600 dark:text-indigo-400">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-500 dark:text-zinc-400">{item.categoryName || 'Uncategorized'}</span>
              <Badge variant={item.isActive ? 'default' : 'secondary'}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            <button className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:scale-105 transition-transform">
              Edit Item
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
