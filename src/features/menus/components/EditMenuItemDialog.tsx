import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export default function EditMenuItemDialog({ open, onOpenChange, item }: EditMenuItemDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-slate-900 dark:text-zinc-100 font-bold text-xl">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-zinc-400">
            Modify menu item pricing, categorization, or active status.
          </DialogDescription>
        </DialogHeader>
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
                  <SelectTrigger className="w-full bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <div className="truncate">
                      <SelectValue placeholder="Select...">
                        {categories?.data?.find((c: any) => c.id === categoryId)?.name || 'Select Category...'}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    {categories?.data?.map((cat: any) => (
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
          <div className="mt-8 pt-4">
            <DialogFooter className="flex space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
