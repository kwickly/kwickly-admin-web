import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateCombo } from "@/hooks/api/useCombos"
import { useMenuItems } from "@/hooks/api/useMenus"

export default function CreateComboSheet() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [selectedItems, setSelectedItems] = useState<{menuItemId: string, quantity: number}[]>([])
  const [open, setOpen] = useState(false)

  const { data: menuItems } = useMenuItems('default')
  const { mutate: createCombo, isPending } = useCreateCombo()

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => {
      const exists = prev.find(p => p.menuItemId === itemId)
      if (exists) {
        return prev.filter(p => p.menuItemId !== itemId)
      }
      return [...prev, { menuItemId: itemId, quantity: 1 }]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || selectedItems.length === 0) return

    createCombo(
      { name, description, price, items: selectedItems },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setDescription('')
          setPrice('')
          setSelectedItems([])
        }
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <SheetTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Combo</Button>
      </SheetTrigger>
      <SheetContent className="bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-900 dark:text-zinc-100">Create Combo Meal</SheetTitle>
          <SheetDescription className="text-slate-500 dark:text-zinc-400">
            Combine multiple items into a single meal package.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-zinc-300">Combo Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Burger Meal"
                className="mt-1.5 bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            
            <div>
              <Label className="text-slate-700 dark:text-zinc-300">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="mt-1.5 bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-zinc-300">Combo Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 299"
                className="mt-1.5 bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            
            <div>
              <Label className="text-slate-700 dark:text-zinc-300 mb-2 block">Select Items</Label>
              <div className="space-y-2 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 max-h-48 overflow-y-auto">
                {menuItems?.items?.map((item: any) => {
                  const isSelected = selectedItems.some(s => s.menuItemId === item.id)
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center transition-colors ${
                        isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30' : 'hover:bg-slate-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-sm text-slate-900 dark:text-zinc-100">{item.name}</span>
                      {isSelected && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Selected</span>}
                    </div>
                  )
                })}
                {(!menuItems?.items || menuItems.items.length === 0) && (
                  <p className="text-sm text-slate-500 dark:text-zinc-400 text-center py-4">No menu items found.</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending || selectedItems.length === 0} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            {isPending ? 'Saving...' : 'Save Combo'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
