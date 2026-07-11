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
        <Button className="h-11">Create Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Menu Category</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new category to group your menu items (e.g. Starters, Main Course).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beverages"
                className="h-11 bg-transparent border-border text-foreground"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sort" className="text-foreground">Sort Order</Label>
              <Input
                id="sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
                className="h-11 bg-transparent border-border text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="h-11 w-full sm:w-auto">
              {isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
