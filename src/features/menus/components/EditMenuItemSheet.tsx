import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useUpdateMenuItem, useMenuCategories, type MenuItem } from "@/hooks/api/useMenus"
import { useBranchStore } from "@/store/useBranch"

interface EditMenuItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export default function EditMenuItemSheet({ open, onOpenChange, item }: EditMenuItemSheetProps) {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data: categories } = useMenuCategories(branchId)
  const { mutate: updateItem, isPending } = useUpdateMenuItem()

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(item.price)
      setCategoryId(item.categoryId)
      setIsActive(item.isActive ?? true)
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !name || !price || !categoryId) return

    updateItem(
      {
        id: item.id,
        branchId,
        payload: { name, price, categoryId, isActive }
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-900 dark:text-zinc-100 font-bold">Edit Menu Item</SheetTitle>
          <SheetDescription className="text-slate-500 dark:text-zinc-400">
            Modify menu item pricing, categorization, or active status.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Item Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Double Cheeseburger" 
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100" 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-700 dark:text-zinc-300">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00" 
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700 dark:text-zinc-300">Category</Label>
                <Select value={categoryId} onValueChange={(val: any) => setCategoryId(val)} required>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="isActive" className="text-sm text-slate-600 dark:text-zinc-300 cursor-pointer font-normal">
                Available (In Stock)
              </Label>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800">
            <SheetFooter>
              {/* @ts-ignore */}
              <SheetClose asChild>
                <Button type="button" variant="outline" className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </SheetFooter>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
