import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { useState } from "react"
import { useCreateMenuItem, useMenuCategories } from "@/hooks/api/useMenus"

export default function CreateMenuItemSheet() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [open, setOpen] = useState(false)

  const { data: categories } = useMenuCategories('default')
  const { mutate: createItem, isPending } = useCreateMenuItem()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !categoryId) return

    createItem(
      { name, price, categoryId, isVeg: true },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setPrice('')
          setCategoryId('')
        }
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* @ts-ignore - Radix UI type bug with TS 5.7+ */}
      <SheetTrigger asChild>
        <Button className="h-11">Add Menu Item</Button>
      </SheetTrigger>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-foreground">Create Menu Item</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Add a new item to your menu. You can configure categories and modifiers here.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Item Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Double Cheeseburger" 
                className="h-11 bg-transparent border-border text-foreground" 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00" 
                  className="h-11 bg-transparent border-border text-foreground" 
                  required
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">Category</Label>
              <Select value={categoryId} onValueChange={(val: any) => setCategoryId(val)} required>
                <SelectTrigger className="h-11 bg-transparent border-border text-foreground">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories?.data?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                  {!categories?.data?.length && (
                    <SelectItem value="none" disabled>No categories found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modifiers" className="text-foreground">Modifier Groups</Label>
            <Select>
              <SelectTrigger className="h-11 bg-transparent border-border text-foreground">
                <SelectValue placeholder="Attach modifier group..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="cheese">Cheese Options (+ $0.50)</SelectItem>
                <SelectItem value="temps">Meat Temperatures</SelectItem>
                <SelectItem value="sauces">Extra Sauces</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <SheetFooter>
            {/* @ts-ignore - Radix UI type bug with TS 5.7+ */}
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isPending} className="h-11">
              {isPending ? 'Saving...' : 'Save Item'}
            </Button>
          </SheetFooter>
        </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
