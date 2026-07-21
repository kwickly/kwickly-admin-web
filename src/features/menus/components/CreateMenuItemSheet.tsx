import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateMenuItem, useMenuCategories } from "@/hooks/api/useMenus"

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  
  // Dietary
  isVeg: z.boolean(),
  isJain: z.boolean(),
  isGlutenFree: z.boolean(),
  spiceLevel: z.coerce.number().min(0).max(3),

  // Badges
  isBestseller: z.boolean(),
  isChefSpecial: z.boolean(),
  isNew: z.boolean(),
  isLimitedEdition: z.boolean(),
  isHealthyChoice: z.boolean(),

  // Nutrition
  calories: z.coerce.number().optional(),
  servingSize: z.string().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemSchema>

export default function CreateMenuItemSheet() {
  const [open, setOpen] = useState(false)
  const { data: categories } = useMenuCategories('default')
  const { mutate: createItem, isPending } = useCreateMenuItem()

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema) as any,
    defaultValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      isVeg: true,
      isJain: false,
      isGlutenFree: false,
      spiceLevel: 0,
      isBestseller: false,
      isChefSpecial: false,
      isNew: false,
      isLimitedEdition: false,
      isHealthyChoice: false,
    },
  })

  const onSubmit = (data: MenuItemFormValues) => {
    // Strip empty nutrition string fields if they are empty
    const payload = {
      ...data,
      calories: data.calories || undefined,
      protein: data.protein || undefined,
      carbs: data.carbs || undefined,
      fat: data.fat || undefined,
    }

    createItem(payload, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      }
    })
  }

  // Intercept sheet open/close to reset form
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* @ts-ignore */}
      <SheetTrigger asChild>
        <Button className="h-11">Add Menu Item</Button>
      </SheetTrigger>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-foreground">Create Menu Item</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Add a new item to your menu with rich details and macros.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="badges">Diet & Badges</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            
            {/* ── Basic Info Tab ── */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Item Name *</Label>
                <Input 
                  {...form.register("name")}
                  placeholder="e.g. Double Cheeseburger" 
                  className="h-11 bg-transparent border-border text-foreground" 
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Price (₹) *</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...form.register("price")}
                    placeholder="0.00" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Category *</Label>
                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 bg-transparent border-border text-foreground">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {categories?.data?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Textarea 
                  {...form.register("description")}
                  placeholder="A short description of the item..."
                  className="bg-transparent border-border text-foreground resize-none"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* ── Diet & Badges Tab ── */}
            <TabsContent value="badges" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Dietary Preferences</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="isVeg"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isVeg" />
                        <Label htmlFor="isVeg">Vegetarian</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isJain"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isJain" />
                        <Label htmlFor="isJain">Jain Friendly</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isGlutenFree"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isGlutenFree" />
                        <Label htmlFor="isGlutenFree">Gluten Free</Label>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label className="text-foreground">Spice Level (0-3)</Label>
                  <Input 
                    type="number" 
                    min="0" max="3"
                    {...form.register("spiceLevel")}
                    className="h-11 bg-transparent border-border text-foreground w-32" 
                  />
                  <p className="text-xs text-muted-foreground">0 = None, 1 = Mild, 2 = Medium, 3 = Hot</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground">Marketing Badges</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="isBestseller"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isBestseller" />
                        <Label htmlFor="isBestseller">Bestseller</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isChefSpecial"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isChefSpecial" />
                        <Label htmlFor="isChefSpecial">Chef's Special</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isHealthyChoice"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isHealthyChoice" />
                        <Label htmlFor="isHealthyChoice">Healthy Choice</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="isNew" />
                        <Label htmlFor="isNew">New Arrival</Label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Nutrition Tab ── */}
            <TabsContent value="nutrition" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Calories (kcal)</Label>
                  <Input 
                    type="number" 
                    {...form.register("calories")}
                    placeholder="e.g. 450" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Serving Size</Label>
                  <Input 
                    {...form.register("servingSize")}
                    placeholder="e.g. 1 bowl (300g)" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-foreground">Protein (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("protein")}
                    placeholder="e.g. 12.5" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Carbs (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("carbs")}
                    placeholder="e.g. 45" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Fat (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("fat")}
                    placeholder="e.g. 18" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-border">
            <SheetFooter>
              {/* @ts-ignore */}
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
