import { Badge } from "@/components/ui/badge"

const MOCK_ITEMS = [
  { id: "1", name: "Classic Burger", price: 12.99, category: "Mains", status: "Active", image: "🍔" },
  { id: "2", name: "French Fries", price: 4.99, category: "Sides", status: "Active", image: "🍟" },
  { id: "3", name: "Coca Cola", price: 2.99, category: "Drinks", status: "Active", image: "🥤" },
  { id: "4", name: "Seasonal Salad", price: 8.99, category: "Sides", status: "Inactive", image: "🥗" },
]

export default function MenuGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {MOCK_ITEMS.map((item) => (
        <div 
          key={item.id}
          className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-6xl">
            {item.image}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100">{item.name}</h3>
              <p className="font-medium text-indigo-600 dark:text-indigo-400">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-500 dark:text-zinc-400">{item.category}</span>
              <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                {item.status}
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
