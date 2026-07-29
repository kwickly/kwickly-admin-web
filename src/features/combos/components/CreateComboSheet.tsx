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
import ImageDropzone from "@/components/ui/image-dropzone"

export default function CreateComboSheet() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageMetadata, setImageMetadata] = useState<any>(null)
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
      { 
        name, 
        description, 
        price, 
        items: selectedItems,
        imageUrl: imageUrl || undefined,
        imageMetadata: imageMetadata || undefined
      },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setDescription('')
          setPrice('')
          setImageUrl('')
          setImageMetadata(null)
          setSelectedItems([])
        }
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <SheetTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Combo</Button>
      </SheetTrigger>
      <SheetContent className="bg-popover border-l border-border sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-foreground">Create Combo Meal</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Combine multiple items into a single meal package.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-foreground/80">Combo Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Burger Meal"
                className="mt-1.5 bg-transparent border-border  text-foreground"
                required
              />
            </div>
            
            <div>
              <Label className="text-foreground/80">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="mt-1.5 bg-transparent border-border  text-foreground"
              />
            </div>

            <div>
              <ImageDropzone
                value={imageUrl}
                onChange={(url, meta) => {
                  setImageUrl(url);
                  setImageMetadata(meta);
                }}
                label="Combo Photo"
                aspect="video"
              />
            </div>

            <div>
              <Label className="text-foreground/80">Combo Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 299"
                className="mt-1.5 bg-transparent border-border  text-foreground"
                required
              />
            </div>
            
            <div>
              <Label className="text-foreground/80 mb-2 block">Select Items</Label>
              <div className="space-y-2 border border-border rounded-lg p-2 max-h-48 overflow-y-auto">
                {menuItems?.items?.map((item: any) => {
                  const isSelected = selectedItems.some(s => s.menuItemId === item.id)
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center transition-colors ${
                        isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-accent'
                      }`}
                    >
                      <span className="text-sm text-foreground">{item.name}</span>
                      {isSelected && <span className="text-xs text-primary font-medium">Selected</span>}
                    </div>
                  )
                })}
                {(!menuItems?.items || menuItems.items.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No menu items found.</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending || selectedItems.length === 0} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? 'Saving...' : 'Save Combo'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
