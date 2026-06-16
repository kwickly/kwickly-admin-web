import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateCategory } from "@/hooks/api/useMenus"

export default function CreateCategoryDialog() {
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [open, setOpen] = useState(false)

  const { mutate: createCategory, isPending } = useCreateCategory()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    createCategory(
      { name, sortOrder: parseInt(sortOrder) || 0 },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setSortOrder('0')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-zinc-100">Create Menu Category</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-zinc-400">
            Add a new category to group your menu items (e.g. Starters, Main Course).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beverages"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sort" className="text-slate-700 dark:text-zinc-300">Sort Order</Label>
              <Input
                id="sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
              {isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
